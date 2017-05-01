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

            function slug(string) {
                return string.toLowerCase()
                        .replace(/[^a-z0-9ก-ฮแเใไโฯๆะาอิอีอึอือุอูอ์อ่อ้อ๊อ๋อัอฺอำอํ]/gi, '-')
                        .replace(/-+/g, '-')
                        .replace(/-$|^-/g, '') || '-';
            }

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
