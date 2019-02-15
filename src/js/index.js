/* eslint-disable no-eval */
(function() {
  const directives = {};
  const watchers = [];

  const rootScope = window;
  rootScope.name = '';
  rootScope.textLength = 10;

  rootScope.setNameIvan = () => {
    rootScope.name = 'ivan';
  };

  rootScope.setNoName = () => {
    rootScope.name = '';
  };

  rootScope.increaseTextLength = () => {
    rootScope.textLength += 1;
  };

  rootScope.decreaseTextLength = () => {
    if (rootScope.textLength > 0) {
      rootScope.textLength -= 1;
    }
  };

  rootScope.$watch = (name, watcher) => {
    watchers.push({ name, watcher });
  };

  rootScope.$apply = () => {
    watchers.forEach(({ watcher }) => {
      watcher();
    });
  };

  const smallAngular = {
    directive(name, fn) {
      if (!directives[name]) {
        directives[name] = [];
      }

      directives[name].push(fn);
    },

    compile(node) {
      const attrsNg = [];
      const attrsRest = {};

      node.getAttributeNames().forEach(attr => {
        if ((/^ng-.+/ig).test(attr)) {
          attrsNg.push(attr);
        } else {
          attrsRest[attr] = node.getAttribute(attr);
        }
      });

      attrsNg.forEach(attr => {
        if (directives[attr]) {
          directives[attr].forEach(cb => cb(rootScope, node, attrsRest));
        }
      });
    },

    bootstrap(node) {
      this.node = node || document.querySelector('[ng-app]');

      this.compile(this.node);
      this.node.querySelectorAll('*').forEach(el => {
        this.compile(el);
      });
    }
  };


  smallAngular.directive('ng-model', function(scope, node, attrs) {
    const data = node.getAttribute('ng-model');

    function updateVariableValue() {
      scope[data] = node.value;
      scope.$apply();
    }

    node.addEventListener('keyup', () => {
      node.onchange = updateVariableValue();
    });
  });


  smallAngular.directive('ng-bind', function(scope, node, attrs) {
    function updateText() {
      const data = node.getAttribute('ng-bind');
      node.textContent = `${scope[data]}`;

      
    }

    updateText();
    scope.$watch(node.getAttribute('ng-bind'), updateText);
  });


  smallAngular.directive('ng-make-short', function(scope, node, attrs) {
    const { textContent } = node;

    function ngMakeShort() {
      const length = eval(attrs.length);
      node.textContent = textContent.slice(0, length).concat('...');

      if (length > textContent.length - 3) {
        node.textContent = textContent;
      }
    }

    ngMakeShort();
    scope.$watch(node.getAttribute('ng-make-short'), ngMakeShort);
  });


  smallAngular.directive('ng-init', function(scope, node, attrs) {
    const data = node.getAttribute('ng-init');
    eval(data);
  });


  smallAngular.directive('ng-click', function(scope, node, attrs) {
    const data = node.getAttribute('ng-click');

    node.addEventListener('click', () => {
      eval(data);
      scope.$apply();
    });
  });


  smallAngular.directive('ng-random-color', function(scope, node, attrs) {
    function setRandomColor() {
      node.style.backgroundColor = `#${Math.floor(Math.random() * 16581375).toString(16)}`;
    }

    node.addEventListener('click', setRandomColor);
  });


  smallAngular.directive('ng-show', function(scope, node, attrs) {
    function ngShow() {
      const data = node.getAttribute('ng-show');
      const result = eval(data);
      const hasToBeShown = result && node.classList.contains('ng-hide');
      const hasToBeHidden = !result && !node.classList.contains('ng-hide');

      if (hasToBeShown || hasToBeHidden) {
        node.classList.toggle('ng-hide');
      }
    }

    ngShow();
    scope.$watch(node.getAttribute('ng-show'), ngShow);
  });


  smallAngular.directive('ng-hide', function(scope, node, attrs) {
    function ngHide(node) {
      const data = node.getAttribute('ng-hide');
      const result = eval(data);
      const hasToBeHidden = result && !node.classList.contains('ng-hide');
      const hasToBeShown = !result && node.classList.contains('ng-hide');

      if (hasToBeHidden || hasToBeShown) {
        node.classList.add('ng-hide');
      }
    }

    ngHide();
    scope.$watch(node.getAttribute('ng-show'), ngHide);
  });


  // smallAngular.node.querySelectorAll('*').forEach(el => {
  //   const text = el.textContent.match(/{{.+?}}/ig);
  //   console.log(text)
  // })

  // function updateText() {
  //   const variable = eval(data);
  //   const find = text.replace(/{{.+?}}/ig, `${variable}`);
  //   node.textContent = find;
  // }

  // updateText();
  // scope.$watch(node.getAttribute('ng-bind'), updateText);


  // })

  window.smallAngular = smallAngular;
}());

// eslint-disable-next-line no-undef
smallAngular.bootstrap();
