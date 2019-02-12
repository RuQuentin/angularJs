/* eslint-disable */
(() => {
  const directives = [];

  const smallAngular = {
    directive(name, fn) {
      const index = directives.findIndex(el => Object.keys(el)[0] === name);
  
      if (index === -1) {
        directives.push({[name]: [fn]});
      }
  
      if (index !== -1) {
        directives[index][name].push(fn);
      }
    },

    compile(node) {

      directives['ng-click'].forEach(cb => cb(node))
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

// mount app to this node
// or 
// find data attr ng-app - mount app to this node
