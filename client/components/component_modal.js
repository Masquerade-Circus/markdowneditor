let Component = {
    opened: false,
    header: undefined,
    content: undefined,
    footer: undefined,
    open(options = {}) {
        Component.header = options.header || undefined;
        Component.content = options.content || undefined;
        Component.footer = options.footer || undefined;
        Component.opened = true;
    },
    close(e) {
        Component.header = undefined;
        Component.content = undefined;
        Component.footer = undefined;
        Component.opened = false;
        e && e.preventDefault && e.preventDefault();
    },
    view(vnode) {
        if (!Component.opened) {
            return '';
        }

        return m('dialog[data-card][open]#modal', [
            Component.header
                ? m('header', Component.header)
                : '',
            Component.content
                ? m('section', Component.content)
                : '',
            Component.footer
                ? m('footer', Component.footer)
                : ''
        ]);
    }
};

export default Component;