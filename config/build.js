const merge = require('merge');
const path = require('path');

let tmpPath = 'tmp';
let distPath = '/var/www/html/drupal/drupal-8.2.5/themes/music';
// let distPath = 'dist';

module.exports = {
  componentRoot: 'src/components',
  componentManifest: 'component.json',
  plugins: {
    js: {
      module: require('stromboli-plugin-javascript'),
      config: merge.recursive(require('./plugin/javascript'), {
        plugin: [
          ['tsify'],
          function (bundle, opts) {
            return require('minifyify')(bundle, {map: false});
          }
        ]
      }),
      entry: 'index.js'
    },
    css: {
      module: require('stromboli-plugin-sass'),
      config: merge.recursive(require('./plugin/sass'), {
        sourceMap: false,
        sourceComments: false
      }),
      entry: 'index.scss'
    },
    html: {
      module: require('../lib/plugin/twig'),
      entry: 'index.twig',
      config: merge.recursive(require('./plugin/twig'))
    }
  },
  postcss: {
    plugins: [
      require('cssnano')({
        discardDuplicates: true
      }),
      require('postcss-copy')({
        src: path.resolve('.'),
        dest: distPath,
        inputPath: function (decl) {
          return path.resolve('.');
        },
        template: function (fileMeta) {
          return 'assets/' + fileMeta.hash + '.' + fileMeta.ext;
        },
        relativePath: function (dirname, fileMeta, result, options) {
          return path.dirname(fileMeta.sourceInputFile);
        },
        hashFunction: function (contents) {
          // sha256
          const createSha = require('sha.js');

          return createSha('sha256').update(contents).digest('hex');
        }
      })
    ]
  },
  paths: {
    tmp: tmpPath,
    dist: distPath
  }
};