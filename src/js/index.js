(function() {
  const smallAngular = {
    directive(name, fn)  {
      const index = directives.findIndex(el => Object.keys(el)[0] === name);
  
      if (index === -1) {
        directives.push({[name]: [fn]});
      }
  
      if (index !== -1) {
        directives[index][name].push(fn);
      }
    },

    compile(node){
      directives['ng-click'].forEach(cb => cb(node))
    },
    bootstrap(node) {

      node.queryselectorAll('*').forEach(el => {
        compile(el)
      })
    }
  }

  smallAngular.directive('ng-model', function(el){

  })
  smallAngular.directive('ng-click', function(el){

  })

  smallAngular.directive('ng-show', function(el){

  })

  smallAngular.directive('ng-hide', function(el){

  })
  
  window.smallAngular = smallAngular;
})()

smallAngular.directive('make_short', function(el){

})


smallAngular.bootstrap(node) /*
mount app to this node
or 
find data attr ng-app - mount app to this node
