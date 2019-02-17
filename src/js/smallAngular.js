/* eslint-disable no-eval */
(function() {
  const directives = {};
  const watchers = [];

  const rootScope = window;

  // ========= USER PROPERTIES ==========

  // rootScope.textLength = 10;

  // ========= USER FUNCTIONS ==========

  // rootScope.setNameIvan = () => {
  //   rootScope.name = 'ivan';
  // };

  // rootScope.setNameToEmpty = () => {
  //   rootScope.name = '';
  // };

  // rootScope.increaseTextLength = () => {
  //   rootScope.textLength += 5;
  // };

  // rootScope.decreaseTextLength = () => {
  //   if (rootScope.textLength > 0) {
  //     rootScope.textLength -= 5;
  //   }
  // };

  // ==================================

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
    },


    addUserFunction(fn) {
      if (typeof fn !== 'function') {
        throw new Error(`${fn} is not a function`)
      }

      rootScope[fn] = fn.bind('rootScope');
    }
  };


  // ============== DIRECTIVES ================

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

    node.addEventListener('keyup', () => {
      scope[data] = node.value;
      scope.$apply();
    });
  });

  // ========== ng-bind ===========

  smallAngular.directive('ng-bind', function(scope, node, attrs) {
    const data = node.getAttribute('ng-bind');

    function updateText() {
      node.textContent = scope[data];
    }

    updateText();
    scope.$watch(node.getAttribute('ng-bind'), updateText);
  });

  // ========== ng-make-short ===========

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

    function ngShow() {
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

  // ========== ng-hide ===========

  smallAngular.directive('ng-hide', function(scope, node, attrs) {
    const data = node.getAttribute('ng-hide');

    function ngHide(node) {
      const result = eval(data);
      const hasToBeHidden = result && !node.classList.contains('ng-hide');
      const hasToBeShown = !result && node.classList.contains('ng-hide');

      if (hasToBeHidden || hasToBeShown) {
        node.classList.add('ng-hide');
      }
    }

    ngHide();
    scope.$watch(node.getAttribute('ng-hide'), ngHide);
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

    function ngRepeat() {
      parentNode.innerHTML = '';

      for (scope[dataAsArray[0]] of scope[dataAsArray[1]]) {
        const newNode = cleanClone.cloneNode(false);
        newNode.textContent = scope[dataAsArray[0]];
        parentNode.appendChild(newNode);
      }
    }

    ngRepeat();
    scope.$watch(node.getAttribute('ng-repeat'), ngRepeat);
  });

  window.smallAngular = smallAngular;
}());

// eslint-disable-next-line no-undef
smallAngular.bootstrap();