# datamilk_ab_testing

Tools that customers can use to A/B test DataMilk solution using their Google Analytics.

## How to Install

* Copy the src/ab_test_datamilk.js file to your own server (see topic regarding optional minification below)
* Add the following code to HEAD
```
<script src="PATH_TO_SCRIPT_ON_YOUR_SERVER?gaTrackingId=YOUR_GA_TRACKING_ID&domainId=YOUR_DATAMILK_DOMAIN_ID">
</script>
```
  * the GA trackingId can be copied from your Google Analytics Console
  * the domainId parameter can be copied from your DataMilk dashboard (please, contact customer support if you need assistance)

## What about the conversion pixel?

For simplicity, you can keep the integration of the conversion pixel active for all pages as DataMilk will automatically ignore the ones that are not on the B track.

## How to confirm it is working

* After adding the script to your website and publishing the changes, load the page and on inspect check if the cookie was saved using
```
> document.cookie.includes('datamilk_ab_selection')
> true (if false it means it didn't run)
```

## Troubleshooting

* Check console log for errors while loading the script (for instance, it might be blocked due to CORs configuration)

## Minification

To reduce the size of the script you can use:
```
npm i minify -g
minify ./ab_test_datamilk.js > ab_test_datamilk.min.js
```
And use the minified script instead of the human readable one.

## Unit Testing

To run tests
```
yarn install
yarn test
```
