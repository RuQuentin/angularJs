/* eslint-disable no-eval */
(function() {
  const directives = {};
  const watchers = {};

  const rootScope = window;

  rootScope.$watch = (name, watcher) => {
    watchers[name] = watcher;
  };

  rootScope.$apply = () => {
    watchers.forEach(watcher => watcher());
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
    console.log('called directive ng-show on element', scope, node, attrs);
  });

  smallAngular.directive('ng-bind', function(scope, node, attrs) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-bind on element', scope, node, attrs);
  });

  smallAngular.directive('ng-make-short', function(scope, node, attrs) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-make-short on element', scope, node, attrs);
  });

  smallAngular.directive('ng-click', function(scope, node, attrs) {
    // const data = node.getAttribute('ng-click');
    // node.addEventListener('click', eval(data));
  });

  smallAngular.directive('ng-random-color', function(scope, node, attrs) {
    const data = node.getAttribute('ng-random-color');

    function setRandomColor() {
      node.style.backgroundColor = `rgb(
        ${Math.floor(Math.random() * (255 - 0))},
        ${Math.floor(Math.random() * (255 - 0))},
        ${Math.floor(Math.random() * (255 - 0))}
        )`;
    }

    node.addEventListener('click', setRandomColor);
  });


  smallAngular.directive('ng-show', function(scope, node, attrs) {
    const data = node.getAttribute('ng-show');

    function ngShow(data) {
      const result = eval(data);
      const hasToBeShown = result && node.classList.contains('ng-hide');
      const hasToBeHidden = !result && !node.classList.contains('ng-hide');

      if (hasToBeShown || hasToBeHidden) {
        node.classList.toggle('ng-hide');
      }
    }

    ngShow(data);
    scope.$watch(data, ngShow);
  });


  smallAngular.directive('ng-hide', function(scope, node, attrs) {
    const data = node.getAttribute('ng-show');

    function ngHide(data) {
      const result = eval(data);
      const hasToBeHidden = result && !node.classList.contains('ng-hide');
      const hasToBeShown = !result && node.classList.contains('ng-hide');

      if (hasToBeHidden || hasToBeShown) {
        node.classList.add('ng-hide');
      }
    }

    ngHide(data);
    scope.$watch(data, ngHide);
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
