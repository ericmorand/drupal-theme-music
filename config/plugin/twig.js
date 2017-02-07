var path = require('path');

module.exports = {
    namespaces: {
        music: path.resolve('src/components'),
        node: path.resolve('node_modules/drupal8-templates/src/core/modules/node/templates'),
        system: path.resolve('node_modules/drupal8-templates/src/core/modules/system/templates'),
        classy: path.resolve('node_modules/drupal8-templates/src/core/themes/classy/templates')
    }
};