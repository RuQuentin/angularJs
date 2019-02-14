(function() {
  // ========== HELPING FUNCTIONS ============
  function _runExpression(node, ngName) {
    const expression = node.getAttribute(ngName);

    // eslint-disable-next-line no-eval
    return eval(expression);
  }

  // =========================================

  const directives = {};

  const rootScope = window;

  const smallAngular = {
    directive(name, fn) {
      if (!directives[name]) {
        directives[name] = [];
      }

      directives[name].push(fn);
    },

    compile(node) {
      const attrs = node.getAttributeNames();

      attrs.forEach(attr => {
        if (directives[attr]) {
          directives[attr].forEach(cb => cb(rootScope, node, attrs));
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

  smallAngular.directive('ng-click', function(scope, node, attrs) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-show on element', scope, node, attrs);
  });


  smallAngular.directive('ng-show', function(scope, node, attrs) {
    const result = _runExpression(node, 'ng-show');

    if (result && node.classList.contains('ng-hide')) {
      node.classList.remove('ng-hide');
    }

    if (!result && !node.classList.contains('ng-hide')) {
      node.classList.add('ng-hide');
    }

    // eslint-disable-next-line no-console
    console.log('called directive ng-show on element', scope, node, attrs);
  });


  smallAngular.directive('ng-hide', function(scope, node, attrs) {
    const result = _runExpression(node, 'ng-hide');

    if (result && !node.classList.contains('ng-hide')) {
      node.classList.add('ng-hide');
    }

    if (!result && node.classList.contains('ng-hide')) {
      node.classList.remove('ng-hide');
    }

    // eslint-disable-next-line no-console
    console.log('called directive ng-hide on element', scope, node, attrs);
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
