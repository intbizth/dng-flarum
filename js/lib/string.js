System.register('flarum/override/string', [], function (_export, _context) {
    return {
        setters: [],
        execute: function () {
            /**
             * Truncate a string to the given length, appending ellipses if necessary.
             *
             * @param {String} string
             * @param {Number} length
             * @param {Number} [start=0]
             * @return {String}
             */
            function truncate(string, length) {
                var start = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

                return (start > 0 ? '...' : '') + string.substring(start, start + length) + (string.length > start + length ? '...' : '');
            }

            /**
             * Create a slug out of the given string. Non-alphanumeric characters are
             * converted to hyphens.
             *
             * @param {String} string
             * @return {String}
             */

            _export('truncate', truncate);

            /**
             * Urlify - Refine text so it makes a good ID.
             * https://github.com/bryanbraun/anchorjs/blob/master/anchor.js#L221
             *
             * To do this, we remove apostrophes, replace nonsafe characters with hyphens,
             * remove extra hyphens, truncate, trim hyphens, and make lowercase.
             *
             * @param  {String} text - Any text. Usually pulled from the webpage element we are linking to.
             * @return {String}      - hyphen-delimited text for use in IDs and URLs.
             */
            function slug(text) {
                // Regex for finding the nonsafe URL characters (many need escaping): & +$,:;=?@"#{}|^~[`%!'<>]./()*\
                var nonsafeChars = /[& +$,:;=?@"#{}|^~[`%!'<>\]\.\/\(\)\*\\]/g,
                    urlText;

                // The reason we include this _applyRemainingDefaultOptions is so urlify can be called independently,
                // even after setting options. This can be useful for tests or other applications.
                if (!this.options.truncate) {
                    _applyRemainingDefaultOptions(this.options);
                }

                // Note: we trim hyphens after truncating because truncating can cause dangling hyphens.
                // Example string:                                  // " ⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
                urlText = text.trim()                               // "⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
                    .replace(/\'/gi, '')                  // "⚡⚡ Dont forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."
                    .replace(nonsafeChars, '-')           // "⚡⚡-Dont-forget--URL-fragments-should-be-i18n-friendly--hyphenated--short--and-clean-"
                    .replace(/-{2,}/g, '-')               // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-short-and-clean-"
                    .substring(0, this.options.truncate)  // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-"
                    .replace(/^-+|-+$/gm, '')             // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated"
                    .toLowerCase();                       // "⚡⚡-dont-forget-url-fragments-should-be-i18n-friendly-hyphenated"

                return urlText || text;
            };

            /*function slug(string) {
                return string.toLowerCase()
                        .replace(/[^a-z0-9ก-ฮแเใไโฯๆะาอิอีอึอือุอูอ์อ่อ้อ๊อ๋อัอฺอำอํ]/gi, '-')
                        .replace(/-+/g, '-')
                        .replace(/-$|^-/g, '') || '-';
            }*/

            /**
             * Strip HTML tags and quotes out of the given string, replacing them with
             * meaningful punctuation.
             *
             * @param {String} string
             * @return {String}
             */

            _export('slug', slug);

            function getPlainContent(string) {
                var dom = $('<div/>').html(string.replace(/(<\/p>|<br>)/g, '$1 &nbsp;'));

                dom.find(getPlainContent.removeSelectors.join(',')).remove();

                return dom.text();
            }

            /**
             * An array of DOM selectors to remove when getting plain content.
             *
             * @type {Array}
             */

            _export('getPlainContent', getPlainContent);

            getPlainContent.removeSelectors = ['blockquote', 'script'];

            /**
             * Make a string's first character uppercase.
             *
             * @param {String} string
             * @return {String}
             */
            function ucfirst(string) {
                return string.substr(0, 1).toUpperCase() + string.substr(1);
            }

            _export('ucfirst', ucfirst);
        }
    };
});

System.set('flarum/utils/string', System.get('flarum/override/string'));
