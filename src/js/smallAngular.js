/* eslint-disable no-eval */

(function() {
  const directives = {};
  const watchers = [];
  const rootScope = window;

  rootScope.$watch = (valueChecker, previousValue, watcher) => {
    watchers.push({ valueChecker, previousValue, watcher });
  };

  rootScope.$apply = () => {
    watchers.forEach(obj => {
      const currentValue = obj.valueChecker();

      if (currentValue !== obj.previousValue) {
        obj.previousValue = currentValue;
        obj.watcher();
      }
    });
  };

  // ==================================

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


    bootstrap(node) {
      this.node = node || document.querySelector('[ng-app]');

      this.compile(this.node);
      this.node.querySelectorAll('*').forEach(el => {
        this.compile(el);
      });
    },


    addUserFunction(fn) {
      if (typeof fn !== 'function') {
        throw new Error(`${fn} is not a function`)
      }

      rootScope[fn] = fn.bind('rootScope');
    }
  };

  window.smallAngular = smallAngular;
}());