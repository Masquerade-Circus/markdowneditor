let ROUTES = {
    '/': {
        render() {
            HELPER.Title('Markdown Editor');
            return m(PAGE.Layout);
        }
    }
};

window.ROUTES = ROUTES;