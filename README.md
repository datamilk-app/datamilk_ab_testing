# datamilk_ab_testing

Tools that customers can use to A/B test DataMilk solution using their Google Analytics.

## How to Install

Install the src/ab_test_datamilk.js (see topic regarding optional minification below) script on the HEAD for lowest possible latency. In addition, make sure your Google Analytics is started as soon as possible so that events are not missed.

## Minification

To reduce the size of the script you can use:
```
npm i minify -g
minify ./ab_test_datamilk.js > ab_test_datamilk.min.js
```
And use the minified script instead of the human readable one.

## Testing

To run tests
```
yarn install
yarn test
```
