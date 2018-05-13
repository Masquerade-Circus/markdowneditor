import timeago from 'timeago.js';
import Locales from '../../locales';

let Service = {
    timeago: timeago(),
    format(date) {
        return Service.timeago.format(date);
    },
    setLocale(locale = 'es') {
        Service.timeago.setLocale(locale);
    },
    register(locale) {
        timeago.register(locale, (number, index) => Locales[locale].timeago[index]);
    },
    init() {
        for (let i in Locales) {
            if (Locales[i].timeago) {
                Service.register(i);
            }
        }

        Service.setLocale('es');
    },
};

Service.init();

export default Service;