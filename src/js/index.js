/* eslint-disable no-eval */
(function() {
  const directives = {};
  const watchers = [];

  const rootScope = window;

  rootScope.onClick1 = () => {
    rootScope.name = 'ivan';
  };

  rootScope.onClick2 = () => {
    rootScope.name = 'vasya';
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

      node.getAttributeNames().forEach(el => {
        if ((/^ng-.+/ig).test(el)) {
          attrsNg.push(el);
        } else {
          attrsRest[el] = node.getAttribute(el);
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

      this.node.querySelectorAll('*').forEach(el => {
        this.compile(el);
      });
    }
  };

  smallAngular.directive('ng-model', function(scope, node, attrs) {
    // eslint-disable-next-line no-console
    // console.log('called directive ng-show on element', scope, node, attrs);
  });

  smallAngular.directive('ng-bind', function(scope, node, attrs) {
    // eslint-disable-next-line no-console
    // console.log('called directive ng-bind on element', scope, node, attrs);
  });

  smallAngular.directive('ng-make-short', function(scope, node, attrs) {
    // eslint-disable-next-line no-console
    // console.log('called directive ng-make-short on element', scope, node, attrs);
  });

  smallAngular.directive('ng-init', function(scope, node, attrs) {
    const data = node.getAttribute('ng-init');
    eval(data);
  });

  smallAngular.directive('ng-click', function(scope, node, attrs) {
    function ngClick() {
      const data = node.getAttribute('ng-click');
      node.addEventListener('click', () => {
        eval(data);
        scope.$apply();
      });
    }

    ngClick();
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
      const data = node.getAttribute('ng-show');
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

  // smallAngular.directive('ng-init', function(el) {
  //   const expression = el.getAttribute('ng-init');
  //   eval(expression);

  // smallAngular.node.querySelectorAll('*').forEach(el => {
  //   const text = el.textContent.match(/{{.+?}}/ig);
  //   console.log(text)
  // })
  // })

  window.smallAngular = smallAngular;
}());

// smallAngular.directive('make_short', function(el){

// })

// eslint-disable-next-line no-undef
smallAngular.bootstrap();
