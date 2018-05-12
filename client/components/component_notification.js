let Component = {
    opened: false,
    color: '',
    content: '',
    size: '',
    sizes: {
        'three-line': 120,
        'two-line': 60,
        '': 30
    },
    timeout: undefined,
    closeAfter: 3,
    open(options = {}) {
        Component.closeAfter = options.closeAfter || 3;
        Component.color = options.color || '';
        Component.content = options.content || '';
        for (let i in Component.sizes) {
            if (Component.content.length <= Component.sizes[i]) {
                Component.size = i;
            }
        }
        Component.opened = true;
        clearTimeout(Component.timeout);
        Component.timeout = setTimeout(() => {
            Component.close();
        }, Component.closeAfter * 1000);
    },
    close(e) {
        Component.closeAfter = 3;
        Component.color = '';
        Component.content = '';
        Component.size = '';
        Component.opened = false;
        clearTimeout(Component.timeout);
        e && e.preventDefault && e.preventDefault();
    },
    view(vnode) {
        if (!Component.opened) {
            return '';
        }

        return m('dialog[data-card][open]#notification', [
            m('section', {
                'data-background': Component.color + ' 50'
            }, [
                    m('div', {
                        'data-list': Component.size
                    }, [
                            m('li', [
                                m('span', Component.content),
                                m('a[href="#"]', { onclick: Component.close }, [
                                    m('i.icon.icofont.icofont-close[data-font="danger"]')
                                ])
                            ])
                        ])
                ])
        ]);
    }
};

export default Component;