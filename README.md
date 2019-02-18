small AngularJS implementation
=====================

General Project Information
-----------------------------------
This small implementation of AngularJS may be used the same way as original AngularJS. You may use it to extend the functionality of your html document without using JavaScript.
This project includes basic methods and directives and has possibility to add new ones from developers if needed.


Internal Methods
-----------------------------------
**small AngularJS** includes the following methods:

* `directive(name, fn)` - adds new directives to the base. The base of directives is organised as an object, which consists of other objects in the format `{ name, [fn1, fn2, ...] }`

* `compile(node)` - checks if the current node has directives as an attribute inside a tag, and if yes - runs relevant functions from the base for it

* `bindCurlyBracedVariables(node)` - checks if inner text of `ng-app`-node has variables wrapped into double curly braces ( {{ variable }} ), and if yes - replaces it with standart `ng-bind`-span-block

* `bootstrap(node)` - starts the application. It uses the passed node or `ng-app`-node as a basic one, then go through all the child nodes inside it and run `compile` method for each of them


Scope Methods `$watch` And `$apply`
-----------------------------------
Every time application starts it creates `rootScope`. In this particular implementation `rootScope = window`.
`rootScope` includes two methods:

* `$watch(name, watcher)` - adds new watchers to the base. The base of watchers is organised as an array, which consists of objects in the format `{ name, watcher }`

* `$apply()` - run the watchers if the variables or other parameters has changed


Basic Directives
-----------------------------------
**small AngularJS** includes the following directives:

* `ng-init` - allows to evaluate an expression

* `ng-model` - binds an input, select, textarea (or custom form control) to a property on the scope

* `ng-bind` - to replace the text content of the specified HTML element with the value of a given expression, and to update the text content when the value of that expression changes

* `ng-make-short` - allows to shorten text content of the specified HTML element, replacing extra text content with `...`. The number of visible symbols is limited by the value of attribute `length` of the same node tag

* `ng-click` - allows to specify custom behavior when an element is clicked

* `ng-random-color` - set random background color to the clicked element

* `ng-show` - shows or hides the given HTML element based on the expression provided to the ngShow attribute. The element is shown or hidden by removing or adding the `display: none` CSS property onto the element

* `ng-hide` - shows or hides the given HTML element based on the expression provided to the ngShow attribute. The element is shown or hidden by removing or adding the `display: none` CSS property onto the element

* `ng-repeat` - allows to split the iterable value and display its parts as separate HTML elements. Value of the attribute should be set in the format `letter of word`, where `letter` is the name of the variable, `word` is the name of the iterable


Adding New Directives
-----------------------------------
You may add any own directive the following way:

```js
smallAngular.directive('ng-name-of-directive', function(scope, node, attrs) {
  ...
  ...
  scope.$apply();
  scope.$watch(name, watcher);
  });
```
* `ng-name-of-directive` - use your own name for the directive. Plese, pay attention, that it should start with `ng-`. Otherwise it won't be run as directive

Inside the funciton the following arguments may be used:

* `scope` - refer to the rootScope. It has to be used for creating variables and access to them

* `node` - refer to the node, in which the attribute 'ng-name-of-directive' is used

* `attrs` - refer to the other (not `ng-`) attributes, presented in the node tag. `attrs` is an object wich consists of the objects in the format `{ name, value }`

Use `scope.$watch(name, watcher)` if you want your directive to re-perform when arguments change.

Use `scope.$apply()` to run other watchers from the base if your directive change any variables or attributes.


Adding User Functions
-----------------------------------
**small AngularJS** has method `addUserFunction()` for adding user functions to scope. Use it in the following way.

1. Create user function:
```js
function userFunction() {
  ...
}
```
You may use context `this` inside the function for declaring variables or access to another variables from the rootScope. After adding function `this` will be replaced with `rootScope`.

2. Add function to the rootScope.

```js
smallAngular.addUserFunction(userFunction)
```
After adding function to the rootScope it may be used with its own name as a value of `ng-`-attributes.


Usage
-----------------------------------
To use **small AngularJS** on your page add it to you page using the following link:

https://github.com/RuQuentin/angularJs/blob/master/src/js/smallAngular.js

or download this script and add it locally.