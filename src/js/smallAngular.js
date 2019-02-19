/* eslint-disable no-eval */

(function() {
  const directives = {};
  const watchers = [];
  const rootScope = window;

  // ==================================

  rootScope.setNameIvan = function() {
    this.name = 'ivan';
  };

  rootScope.setNameToEmpty = function() {
    this.name = '';
  };

  rootScope.increaseTextLength = function() {
    this.textLength += 5;
  };

  rootScope.decreaseTextLength = function() {
    if (this.textLength > 0) {
      this.textLength -= 5;
    }
  };

  // ==================================

  rootScope.$watch = (name, watcher) => {
    watchers.push({ name, watcher });
  };

  rootScope.$apply = () => {
    watchers.forEach(obj => obj.watcher());
  };

  // ==================================

  const smallAngular = {
    directive(name, fn, attrs) {
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


    bindCurlyBracedVariables(node) {
      node.innerHTML = node.innerHTML.replace(/{{.+?}}/ig, el => {
        const variable = el.match(/\b.+\b/);

        return `<span ng-bind="${variable}"></span>`;
      });
    },


    addNgStyles() {
      const styles = `
      <style type="text/css">
        .ng-hide {
          display: none !important;
        }
      </style>
      `;

      const head = document.querySelector('head');
      head.innerHTML = styles + head.innerHTML;
    },


    bootstrap(node) {
      this.node = node || document.querySelector('[ng-app]');

      this.addNgStyles();
      this.bindCurlyBracedVariables(this.node);
      this.compile(this.node);
      this.node.querySelectorAll('*').forEach(el => {
        this.compile(el);
      });
    }
  };


  // ======================= DIRECTIVES =======================

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

    scope.$watch(data, () => {
      node.value = scope[data];
    });
  });

  // ========== ng-bind ===========

  smallAngular.directive('ng-bind', function(scope, node, attrs) {
    const data = node.getAttribute('ng-bind');
    node.textContent = scope[data];

    scope.$watch(data, () => {
      node.textContent = scope[data];
    });
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
    scope.$watch(() => eval(attrs.length), ngMakeShort);
  });

  // ========== ng-click ===========

  smallAngular.directive('ng-click', function(scope, node, attrs) {
    const data = node.getAttribute('ng-click');

    node.addEventListener('click', () => {
      eval(scope[data.match(/.+[^())]/i)]());
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

      if (result) {
        node.classList.remove('ng-hide');
      }

      if (!result) {
        node.classList.add('ng-hide');
      }
    }

    ngShow();
    scope.$watch(() => eval(data), ngShow);
  });

  // ========== ng-hide ===========

  smallAngular.directive('ng-hide', function(scope, node, attrs) {
    const data = node.getAttribute('ng-hide');

    function ngHide() {
      const result = eval(data);

      if (!result) {
        node.classList.remove('ng-hide');
      }

      if (result) {
        node.classList.add('ng-hide');
      }
    }

    ngHide();
    scope.$watch(() => eval(data), ngHide);
  });

  // ========== ng-repeat ===========

  smallAngular.directive('ng-repeat', function(scope, node, attrs) {
    const { parentNode } = node;
    const data = node.getAttribute('ng-repeat');
    const [item, items] = data.split(' in ');
    scope[item] = null;

    function ngRepeat() {
      parentNode.innerHTML = '';

      for (scope[item] of scope[items]) {
        const newNode = node.cloneNode(false);
        newNode.textContent = scope[item];
        parentNode.appendChild(newNode);
      }
    }

    ngRepeat();
    scope.$watch(scope[items], ngRepeat);
  });

  window.smallAngular = smallAngular;
}());


// eslint-disable-next-line no-undef
smallAngular.bootstrap();