# flitz

## 0.11.3

* can submit a single middleware now

## 0.10.1

* add `use()` for adding global middlewares

## 0.9.2

* add `static()` method to flitz instance

## 0.8.4

* fix: `instance` property of Flitz instance appears as enumerable property now

## 0.8.3

* update donation links to [open collective](https://opencollective.com/flitz) and [PayPal](https://paypal.me/MarcelKloubert)

## 0.7.0

* [BREAKING CHANGE]: removed `addr` parameter from `listen()` method of `Flitz interface`

## 0.6.0

* [BREAKING CHANGE]: functions (handlers, middlewares) are not wrapped with `bind()` anymore

## 0.5.3

* `options` can also be an array of functions now
* type checks of `options` parameter

## 0.4.1

* [BREAKING CHANGE]: `RequestPathValidator` type gets an `IncomingMessage` object as argument instead a string now

## 0.3.8

initial release
