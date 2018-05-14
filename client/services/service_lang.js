
import Lang from '../../locales';

/**
 * Small i18n factory function
 * Default options = {
        separator: '.',
        db: {},
        locale: '',
        debug: false
   }
 * @author Masquerade Circus (christian@masquerade-circus.net)
 * @param {Object} options 
 */
let i18nFactory = function (options = {}) {
    let i18n = function (key) {
        let parsed = key.split(i18n.separator),
            result = i18n.db[i18n.locale],
            last, next;

        if (result === undefined) {
            i18n.debug && console.log('The locale "' + i18n.locale + '" does not exists');
            return key;
        }

        while (parsed.length) {
            next = parsed.shift();

            if (parsed.length > 0 && typeof result[next] !== 'object') {
                i18n.debug && console.log('There is no "' + i18n.locale + '" translation for the key "' + key + '".');
                return key;
            }

            result = result[next];
        }

        return result;
    };

    Object.assign(i18n, {
        separator: '.',
        db: {},
        locale: '',
        debug: false
    }, options);

    return i18n;
};

let Service = function (string = '') {
    return Service.translate(string);
};

Service.translate = function (string) {
    return Service.i18n(string);
};

Service.i18n = i18nFactory({
    debug: true, //[Boolean]: Logs missing translations to console.
    locale: 'es', // Initial locale
    db: Lang
});

Service.setLocale = function (locale) {
    i18n.locale = locale;
};

export default Service;