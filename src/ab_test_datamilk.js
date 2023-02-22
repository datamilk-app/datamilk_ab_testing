var scripts = document.getElementsByTagName('script');
var scriptUrl = new URL("http://" + scripts[scripts.length-1].attributes.src.value);

const PARAMS = {
  trackingId: scriptUrl.searchParams.get("gaTrackingId"),
  domainId: scriptUrl.searchParams.get("domainId"),
}

const COOKIE_EXPIRATION_DAYS = 56;
const COOKIE_DATAMILK_AB_KEY = 'datamilk_ab_selection';

const SCRIPT_TO_FETCH = 'https://datamilk.app/magic_ai.js?id=' + PARAMS.domainId;

const HIT_TYPE = 'event';
const EVENT_CATEGORY = 'DataMilk A/B';
const EVENT_ACTION = 'DM A/B';
const LABEL_TREATMENT = 'datamilk_ab_optimized';
const LABEL_CONTROL = 'datamilk_ab_original';

const GA = 'ga';
const GOOGLE_ANALYTICS_OBJECT = 'GoogleAnalyticsObject';
const GA_SEND = 'send';

const GA_TRACKING_ID = 'trackingId';
const GA_FUNCTION_NAME = 'name';

const getGoogleAnalytics = () => {
  return window[GA] ?? window[window[GOOGLE_ANALYTICS_OBJECT]];
};

const getTrackerInfo = (ga) => {
  const trackers = ga.getAll();
  const result = {};
  trackers
    ?.filter((entry) => typeof entry?.get === 'function')
    .forEach((entry) => {
      const trackingId = entry.get(GA_TRACKING_ID);
      if (!result[trackingId]) {
        result[trackingId] = {
          functionName: `${entry.get(GA_FUNCTION_NAME)}.${GA_SEND}`,
        };
      }
    });
  return result;
};

const getTrackerFunctions = (ga) => {
  const result = [];
  try {
    const trackerIdToFunctionNames = getTrackerInfo(ga);
    Object.entries(trackerIdToFunctionNames).forEach(([trackingId, value]) => {
      if (PARAMS.trackingId === trackingId) {
        result.push(value.functionName);
      }
    });
  } catch {}
  return result;
};

const exponentialBackOff = (func, waitingTime, maxTime, ratio) => {
  if (func()) {
    return;
  }
  setTimeout(
    () => exponentialBackOff(func, Math.min(ratio * waitingTime, maxTime), maxTime, ratio),
    waitingTime
  );
};

const sendHitEvent = (ga, trackerFunctions, eventLabel) => {
  try {
    trackerFunctions.forEach((functionName) => {
      ga(functionName, {
        hitType: HIT_TYPE,
        eventCategory: EVENT_CATEGORY,
        eventAction: EVENT_ACTION,
        eventLabel,
        nonInteraction: true,
      });
    });
  } catch {}
};

const sendHitEventWithExponentialBackOffIfNeeded = (eventLabel) => {
  const MIN_WAITING_TIME = 10;
  const MAX_BACK_OFF_TIME = 50;
  const EXP_BACK_OFF_RATIO = 2;
  exponentialBackOff(
    () => {
      const ga = getGoogleAnalytics();
      if (ga?.getAll) {
        const trackerFunctions = getTrackerFunctions(ga);
        if (trackerFunctions.length > 0) {
          sendHitEvent(ga, trackerFunctions, eventLabel);
          return true;
        }
      }
      return false;
    },
    MIN_WAITING_TIME,
    MAX_BACK_OFF_TIME,
    EXP_BACK_OFF_RATIO
  );
};

const saveABSelection = (cValue) => {
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = COOKIE_DATAMILK_AB_KEY + '=' + cValue + ';' + expires + ';path=/';
};

const getCurrentABSelection = () => {
  const name = COOKIE_DATAMILK_AB_KEY + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const runTreatment = () => {
  const script = document.createElement('script');
  script.src = SCRIPT_TO_FETCH;
  document.head.appendChild(script);
};

const applyABTest = () => {
  let abSelection = getCurrentABSelection().trim();
  if (abSelection !== 'A' && abSelection !== 'B') {
    abSelection = Math.random() < 0.5 ? 'B' : 'A';
    saveABSelection(abSelection);
  }
  if (abSelection === 'B') {
    sendHitEventWithExponentialBackOffIfNeeded(LABEL_TREATMENT);
    runTreatment();
  } else {
    sendHitEventWithExponentialBackOffIfNeeded(LABEL_CONTROL);
    // Run nothing on control except the tagging on GA.
  }
};

const ABTestDataMilk = () => {
  if (!window.fetch) {
    // This should exclude IE11 and other old browsers.
    return;
  }
  applyABTest();
};

ABTestDataMilk();
