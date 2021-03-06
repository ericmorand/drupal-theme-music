'use strict';

const fs = require('fs-extra');
const path = require('path');
const merge = require('merge');
const postcss = require('postcss');
const log = require('log-util');

const Promise = require('promise');
const fsCopy = Promise.denodeify(fs.copy);
const fsRemove = Promise.denodeify(fs.remove);
const fsEmptyDir = Promise.denodeify(fs.emptyDir);
const fsReadFile = Promise.denodeify(fs.readFile);
const fsOutputFile = Promise.denodeify(fs.outputFile, 3);
const fsMkdirs = Promise.denodeify(fs.mkdirs, 1);

const Stromboli = require('stromboli');

let componentsBuilderRoot = 'src/components';
let componentsBuilderConfig = require('./config/build');

let write = require('./lib/write');
let tmpPath = 'tmp';

let componentsBuilder = new Stromboli();

fsEmptyDir(componentsBuilderConfig.paths.dist).then(
  function () {
    return Promise.all([
      componentsBuilder.getPlugins(componentsBuilderConfig),
      componentsBuilder.getComponents(componentsBuilderConfig.componentRoot, componentsBuilderConfig.componentManifest)
    ]).then(
      function (results) {
        let plugins = results[0];
        let components = results[1];

        components.forEach(function (component) {
          plugins.forEach(function (plugin) {
            let entry = plugin.entry;
            let entryPath = path.join(component.path, entry);

            if (!plugin.entries) {
              plugin.entries = [];
            }

            try {
              fs.statSync(entryPath);

              plugin.entries.push(entryPath);
            }
            catch (err) {
            }
          });
        });

        // create the final component
        let tmpPath = path.join('tmp', 'build');
        let promises = [];

        plugins.forEach(function (plugin) {
          let data = '';

          plugin.entries.forEach(function (entry) {
            switch (plugin.name) {
              case 'js':
                data += 'require("' + path.relative(tmpPath, entry) + '");';
                break;
              case 'css':
                data += '@import "' + path.relative(tmpPath, entry) + '";';
                break;
              case 'html':
                data += '{% include "' + path.relative(tmpPath, entry) + '" %}';
            }
          });

          promises.push(fsOutputFile(path.join(tmpPath, plugin.entry), data));
        });

        // manifest
        let manifest = {
          name: 'build'
        };

        promises.push(fsOutputFile(path.join(tmpPath, 'component.json'), JSON.stringify(manifest)));

        return Promise.all(promises).then(
          function () {
            // build the final component
            componentsBuilderConfig.componentRoot = tmpPath;
            componentsBuilderConfig.componentManifest = 'component.json';

            componentsBuilder.start(componentsBuilderConfig).then(
              function (components) {
                // write
                return write.writeComponents(components, componentsBuilderConfig.paths.dist).then(
                  function () {
                    let processStylesheet = function (stylesheet) {
                      let config = componentsBuilderConfig;

                      return fsReadFile(stylesheet).then(
                        function (css) {
                          return postcss(config.postcss.plugins).process(css.toString(), {from: stylesheet}).then(
                            function (result) {
                              return fsOutputFile(path.join(path.dirname(stylesheet), 'index.css'), result.css);
                            }
                          );
                        }
                      )
                    };

                    let finalizeStylesheet = function (stylesheet) {
                      let to = path.join(componentsBuilderConfig.paths.dist, 'css', 'index.css');

                      return fsMkdirs(path.dirname(to)).then(
                        function () {
                          return fsCopy(stylesheet, to).then(
                            function() {
                              return processStylesheet(to);
                            }
                          )
                        }
                      )
                    };

                    let finalizeScript = function (script) {
                      let to = path.join(componentsBuilderConfig.paths.dist, 'js', 'index.js');

                      return fsCopy(script, to);
                    };

                    let promises = [];

                    // css
                    components.forEach(function (component) {
                      let stylesheet = path.join(componentsBuilderConfig.paths.dist, component.name, 'index.css');

                      promises.push(finalizeStylesheet(stylesheet));
                    });

                    // js
                    components.forEach(function (component) {
                      let script = path.join(componentsBuilderConfig.paths.dist, component.name, 'index.js');

                      promises.push(finalizeScript(script));
                    });

                    // html
                    components.forEach(function (component) {
                      let renderResult = component.renderResults.get('html');
                      let index = 0;

                      renderResult.getDependencies().forEach(function(dependency) {
                        if (index > 0) {
                          let relativeDependencyPath = path.relative(componentsBuilderRoot, dependency);
                          let to = path.join(componentsBuilderConfig.paths.dist, 'templates', relativeDependencyPath);

                          promises.push(fsMkdirs(path.dirname(to)).then(
                            function () {
                              return fsCopy(dependency, to);
                            }
                          ));
                        }

                        index++;
                      });
                    });

                    // manifestos
                    promises.push(fsCopy(path.resolve('src/manifestos/'), componentsBuilderConfig.paths.dist));

                    // ...

                    // clean
                    return Promise.all(promises).then(
                      function () {
                        // clean
                        let promises = [];

                        components.forEach(function (component) {
                          promises.push(fsRemove(path.join(componentsBuilderConfig.paths.dist, component.name)));
                        });

                        return Promise.all(promises);
                      },
                      function (err) {
                        console.log(err);
                      }
                    );
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              }
            )
          },
          function (err) {
            console.log(err);
          }
        );
      }
    );
  },
  function (err) {
    console.log(err);
  }
);
