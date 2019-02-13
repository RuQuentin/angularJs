(function() {
  const directives = {};

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
          directives[attr].forEach(cb => cb(node));
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

  smallAngular.directive('ng-model', function(el) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-show on element', el);
  });

  smallAngular.directive('ng-click', function(el) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-show on element', el);
  });

  smallAngular.directive('ng-show', function(el) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-show on element', el);
  });

  smallAngular.directive('ng-hide', function(el) {
    // eslint-disable-next-line no-console
    console.log('called directive ng-show on element', el);
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
