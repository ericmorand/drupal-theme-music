module.exports = {
  transform: [
    ['stringify', {
      appliesTo: {
        includeExtensions: ['html']
      }
    }],
    ['aliasify', {
      aliases: {
        'path': 'path/path',
        'vue': 'vue/dist/vue'
      }
    }]
  ],
  plugin: [
    ['tsify']
  ]
};