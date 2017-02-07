let TwigPlugin = require('stromboli-plugin-twig');

class Plugin extends TwigPlugin {
    constructor(config) {
        super(config);

        this.twig.extend(function (Twig) {
            Twig.exports.extendTag({
                type: "trans",
                regex: /^trans$/,
                next: ["endtrans"],
                open: true,
                parse: function (token, context, chain) {
                    let output = Twig.parse.apply(this, [token.output, context]);

                    return {
                        chain: chain,
                        output: output
                    };
                }
            });

            // a matching end tag type
            Twig.exports.extendTag({
                type: "endtrans",
                regex: /^endtrans$/,
                next: [],
                open: false
            });
        })

        this.twig.extendFunction("path", function (name, parameters, relative) {
            return '#' + name;
        });

        // filters
        // @see https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Template!TwigExtension.php/function/TwigExtension%3A%3AgetFilters/8.2.x
        this.twig.extendFilter('t', function (value) {
            return value;
        });

        this.twig.extendFilter('trans', function (value) {
            return value;
        });

        this.twig.extendFilter('placeholder', function (value) {
            return value;
        });

        this.twig.extendFilter('drupal_escape', function (value) {
            return value;
        });

        this.twig.extendFilter('safe_join', function (value) {
            return value;
        });

        this.twig.extendFilter('without', function (value) {
            return value;
        });

        this.twig.extendFilter('clean_class', function (value) {
            return value;
        });

        this.twig.extendFilter('clean_id', function (value) {
            return value;
        });

        this.twig.extendFilter('render', function (value) {
            return value;
        });

        this.twig.extendFilter('format_date', function (value) {
            return value;
        });
    }
}

module.exports = Plugin;