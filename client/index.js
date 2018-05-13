import './bootstrap';
import './routes';

HELPER.Ready(() => {
    let bodyElement = window.document.body || window.document.getElementsByTagName('body')[0];
    m.route(bodyElement, '/', ROUTES);

    setInterval(() => {
        m.redraw();
    }, 10000);
});
