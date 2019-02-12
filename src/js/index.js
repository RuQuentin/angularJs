(function() {
  const directives = [];

  const smallAngular = {
    directive()  {

    },

    compile(node) {
      // apply direcitves to this node
    },

    bootstrap(node) {

      node.queryselectorAll('*').forEach(el => {
        compile(el)
      })
    })
  }

  smallAngular.directive('model', function(el) {

  })

  smallAngular.directive('click', function(el) {

  })
  
})()