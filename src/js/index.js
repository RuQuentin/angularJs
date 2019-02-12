/* eslint-disable */
(() => {
  const directives = {};

  const smallAngular = {
    directive(name, fn) {
      if (Object.keys(directives).includes(name)) {
        directives[name].push(fn);
      }
  
      if (!Object.keys(directives).includes(name)) {
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
      node = node || [...document.querySelectorAll('*')].find(el => el.hasAttribute('ng-app'));

      node.querySelectorAll('*').forEach(el => {
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

  window.smallAngular = smallAngular;
})()

// smallAngular.directive('make_short', function(el){

// })


smallAngular.bootstrap()
