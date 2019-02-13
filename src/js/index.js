/* eslint-disable */
(() => {
  const directives = {};

  const smallAngular = {
    directive(name, fn) {
      if (directives[name]) {
        directives[name].push(fn);
      }
  
      if (!directives[name]) {
        directives[name] = [fn];
      }
    },

    compile(node) {
      [...node.attributes].forEach(attr => {
        if(directives[attr.nodeName]) {
          directives[attr.nodeName].forEach(cb => cb(node))
        }
      })
    },

    bootstrap(node) {
      this.node = node || document.querySelector('[ng-app]');

      this.node.querySelectorAll('*').forEach(el => {
        this.compile(el)
      })
    }
  }

  smallAngular.directive('ng-model', function(el) {
    console.log('called directive ng-show on element', el)
  })

  smallAngular.directive('ng-click', function(el) {
    console.log('called directive ng-show on element', el)
  })

  smallAngular.directive('ng-show', function(el) {
    console.log('called directive ng-show on element', el)
  })

  smallAngular.directive('ng-hide', function(el) {
    console.log('called directive ng-show on element', el)
  })

  // smallAngular.directive('ng-init', function(el) {
  //   const expression = el.getAttribute('ng-init');
  //   eval(expression);

  //   smallAngular.node.querySelectorAll('*').forEach(el => {
  //     const text = el.textContent.match(/{{.+?}}/ig);
  //     console.log(text)
  //   })
  // })

  window.smallAngular = smallAngular;
})()

// smallAngular.directive('make_short', function(el){

// })


smallAngular.bootstrap()
