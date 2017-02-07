const Vue = require('vue');

module.exports = Vue.component('demo-direction-selector', {
  template: require('./templates/direction-selector.html'),
  props: {
    direction: null,
    directions: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data: function() {
    return {
      value: null
    }
  },
  created: function () {
    this.value = this.direction.code;
  },
  watch: {
    value: function(val) {
      let direction = this.directions.find(function(direction) {
        return (direction.code == val);
      });

      this.$parent.$emit('direction-selector:directionDidChange', direction);
    }
  }
});