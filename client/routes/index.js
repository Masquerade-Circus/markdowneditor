let ROUTES = {
    '/': {
        render(vnode) {
            HELPER.Title('Markdown Editor');
            vnode.attrs.key = 'index';
            return m(PAGE.Layout, m(PAGE.Editor, vnode.attrs));
        }
    },
    '/:id': {
        render(vnode) {
            vnode.attrs.key = vnode.attrs.id;
            return m(PAGE.Layout, m(PAGE.Editor, vnode.attrs));
        }
    },
    '/shared/:id': {
        render(vnode) {
            vnode.attrs.key = 'shared' + vnode.attrs.id;
            vnode.attrs.isShared = true;
            return m(PAGE.Shared, m(PAGE.Editor, vnode.attrs));
        }
    }

};

window.ROUTES = ROUTES;