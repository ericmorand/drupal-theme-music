require('./direction-selector');

let Vue = require('vue');

module.exports = Vue.component('demo', {
  template: require('./templates/demo.html'),
  props: {
    title: null,
    directions: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data: function () {
    return {
      direction: null
    }
  },
  beforeMount: function() {
      if (!this.direction) {
        this.direction = this.directions[0];
      }
  },
  created: function () {
    this.$on('direction-selector:directionDidChange', function(direction) {
      this.direction = direction;
    });
  }
});