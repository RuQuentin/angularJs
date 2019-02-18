/* global smallAngular */
/* eslint-disable no-eval */

// ========== ng-app ===========

smallAngular.directive('ng-app', function(scope, node, attrs) {
  node.innerHTML = node.innerHTML.replace(/{{.+?}}/ig, el => {
    const variable = el.match(/\b.+\b/);

    return `<span ng-bind="${variable}"></span>`;
  });
});

// ========== ng-init ===========

smallAngular.directive('ng-init', function(scope, node, attrs) {
  const data = node.getAttribute('ng-init');
  eval(data);
});

// ========== ng-model ===========

smallAngular.directive('ng-model', function(scope, node, attrs) {
  const data = node.getAttribute('ng-model');

  function getCurrentValue() {
    return scope[data];
  }

  function updateValue() {
    node.value = scope[data];
  }

  node.addEventListener('keyup', () => {
    scope[data] = node.value;
    scope.$apply();
  });

  scope.$watch(getCurrentValue, getCurrentValue(), updateValue);
});

// ========== ng-bind ===========

smallAngular.directive('ng-bind', function(scope, node, attrs) {
  const data = node.getAttribute('ng-bind');

  function getCurrentValue() {
    return scope[data];
  }

  function updateText() {
    node.textContent = getCurrentValue();
  }

  updateText();
  scope.$watch(getCurrentValue, getCurrentValue(), updateText);
});

// ========== ng-make-short ===========

smallAngular.directive('ng-make-short', function(scope, node, attrs) {
  const { textContent } = node;

  function getCurrentValue() {
    return eval(attrs.length);
  }

  function ngMakeShort() {
    const length = getCurrentValue();
    node.textContent = textContent.slice(0, length).concat('...');

    if (length > textContent.length - 3) {
      node.textContent = textContent;
    }
  }

  ngMakeShort();
  scope.$watch(getCurrentValue, getCurrentValue(), ngMakeShort);
});

// ========== ng-click ===========

smallAngular.directive('ng-click', function(scope, node, attrs) {
  const data = node.getAttribute('ng-click');

  node.addEventListener('click', () => {
    eval(data);
    scope.$apply();
  });
});

// ========== ng-random-color ===========

smallAngular.directive('ng-random-color', function(scope, node, attrs) {
  node.addEventListener('click', () => {
    node.style.backgroundColor = `#${Math.floor(Math.random() * 16581375).toString(16)}`;
  });
});

// ========== ng-show ===========

smallAngular.directive('ng-show', function(scope, node, attrs) {
  const data = node.getAttribute('ng-show');

  function getCurrentValue() {
    return eval(data);
  }

  function ngShow() {
    const result = getCurrentValue();
    const hasToBeShown = result && node.classList.contains('ng-hide');
    const hasToBeHidden = !result && !node.classList.contains('ng-hide');

    if (hasToBeShown || hasToBeHidden) {
      node.classList.toggle('ng-hide');
    }
  }

  ngShow();
  scope.$watch(getCurrentValue, getCurrentValue(), ngShow);
});

// ========== ng-hide ===========

smallAngular.directive('ng-hide', function(scope, node, attrs) {
  const data = node.getAttribute('ng-hide');

  function getCurrentValue() {
    return eval(data);
  }

  function ngHide(node) {
    const result = getCurrentValue();
    const hasToBeHidden = result && !node.classList.contains('ng-hide');
    const hasToBeShown = !result && node.classList.contains('ng-hide');

    if (hasToBeHidden || hasToBeShown) {
      node.classList.add('ng-hide');
    }
  }

  ngHide();
  scope.$watch(getCurrentValue, getCurrentValue(), ngHide);
});

// ========== ng-repeat ===========

smallAngular.directive('ng-repeat', function(scope, node, attrs) {
  const data = node.getAttribute('ng-repeat');
  const dataAsArray = data.split(' in ');
  scope[dataAsArray[0]] = null;

  const { parentNode } = node;
  const cleanClone = node.cloneNode(false);
  cleanClone.removeAttribute('ng-repeat');
  node.classList.add('ng-hide');

  function getCurrentValue() {
    return scope[dataAsArray[1]];
  }

  function ngRepeat() {
    parentNode.innerHTML = '';

    for (scope[dataAsArray[0]] of scope[dataAsArray[1]]) {
      const newNode = cleanClone.cloneNode(false);
      newNode.textContent = scope[dataAsArray[0]];
      parentNode.appendChild(newNode);
    }
  }

  ngRepeat();
  scope.$watch(getCurrentValue, scope[dataAsArray[1]], ngRepeat);
});

// eslint-disable-next-line no-undef
smallAngular.bootstrap();