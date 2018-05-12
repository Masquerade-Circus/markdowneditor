let Page = {
    drawerOpened: false,
    title: 'Markdown Editor',
    documents: {
        current: {
            title: '',
            saved: '',
            permalink: '',
            loading: true
        },
        list: []
    },
    loading: true,
    openModal() {
        COMPONENT.Modal.open({
            content: [
                m('div', 'Escribe nuevamente el nombre del documento para borrarlo'),
                m('.form-group', [
                    m('input[type="text"][placeholder="Nombre del documento"]'),
                    m('label', 'Nombre del documento')
                ])
            ],
            footer: [
                m('nav', [
                    m('button[data-button="default"]', {
                        onclick(e) {
                            COMPONENT.Modal.opened = false;
                            e.preventDefault();
                        }
                    }, 'Cancelar'),
                    m('button[data-button="danger"]', 'Eliminar')
                ])
            ]
        });
    },
    getModal() {
        return m(COMPONENT.Modal);
    },
    getNotification() {
        return m(COMPONENT.Notification);
    },
    getHeader() {
        if (Page.loading) {
            return [
                m('h1', [
                    m('[data-text-placeholder="25 sm"][data-background="info 100"]')
                ]),
                m('nav', [
                    m('button', [
                        m('[data-icon-placeholder][data-background="info 100"]'),
                        ' ',
                        m('[data-text-placeholder="25 sm"][data-background="info 100"][style="width: 90rem"]')
                    ])
                ])
            ];
        }


        return [
            m('h1', [
                Page.documents.current.title,
                m('small', Page.documents.current.saved)
            ]),
            m('nav', [
                Page.documents.current.permalink.trim().length <= 0
                    ? ''
                    : m('button', [
                        m('i.icon.icofont.icofont-share'),
                        ' Compartir'
                    ])
            ])
        ];
    },
    getList() {
        if (Page.loading) {
            return m('ul[data-list="two-line"]', [
                m('li', [
                    m('a[href="#"]', { onclick: e => e.preventDefault() }, [
                        m('i.icon.icofont[data-background="default 300"]'),
                        m('span[data-text-placeholder="50 md"][data-background="default 300"]'),
                        m('small[data-text-placeholder="25 lt"][data-background="default 300"]'),
                    ]),
                    m('a[href="#"]', { onclick: e => e.preventDefault() }, [
                        m('.icon[data-icon-placeholder][data-background="default 300"]')
                    ])
                ])
            ]);
        }

        return m('ul[data-list="two-line"]', Page.documents.list.map(item => {
            return m('li', { 'data-background': item.id === Page.documents.current.id ? 'info 50' : '' }, [
                m('a[href="#"]', { onclick: e => e.preventDefault() }, [
                    m('i.icon.icofont.icofont-ebook', { 'data-background': item.id === Page.documents.current.id ? 'info' : 'default' }),
                    item.title,
                    m('small', item.saved)
                ]),
                m('a[href="#"]', { onclick: e => e.preventDefault() }, [
                    m('i.icon.icofont.icofont-ui-delete[data-font="danger"]')
                ])
            ]);
        }));
    },
    getNewButton() {
        if (Page.loading) {
            return m('button[data-button="success raised new"]');
        }

        return m('button[data-button="success raised new"]', 'Nuevo');
    },
    getDeleteButton() {
        if (Page.loading) {
            return m('a[href="#"][data-fab="danger"]', { onclick: e => e.preventDefault() }, [

            ]);
        }

        return m('a[href="#"][data-fab="danger"]', { onclick: e => e.preventDefault() }, [
            m('i.icon.icofont.icofont-ui-delete')
        ]);
    },
    getDrawer() {
        return [
            m('button[data-button][data-drawer-button]', {
                onclick(e) {
                    Page.drawerOpened = !Page.drawerOpened;
                    e.preventDefault();
                }
            }, m('i.icofont.icofont-navigation-menu')),
            m('[data-drawer]', {
                onclick(e) {
                    Page.drawerOpened = false;
                    e.preventDefault();
                },
                open: Page.drawerOpened
            }, [
                    m('[data-drawer-content]', [
                        m('[data-flexible-bar]', [
                            m('[data-flexible-bar-media][data-background="info 700"]', [
                                m('div[style="margin-top:50rem"]', [
                                    m('h4', Page.title)
                                ])
                            ])
                        ]),
                        Page.getNewButton(),
                        Page.getList(),
                        m('footer[data-background="info 700"]', [
                            m('nav', [
                                /* m('button', 'Changelog'),
                                m('button', 'Roadmap') */
                            ])
                        ])
                    ])
                ])
        ];
    },
    getEditor() {
        if (Page.loading) {
            return [
                m('textarea[data-background="default 100"]'),
                m('div.preview', [
                    m('[data-text-placeholder="50"][data-background="default 300"][style="margin-bottom: 10rem"]'),
                    m('[data-text-placeholder="100 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                    m('[data-text-placeholder="100 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                    m('[data-text-placeholder="100 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                    m('[data-text-placeholder="50 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                ]),
                Page.getDeleteButton()
            ];
        }
        return [
            m('textarea[data-background="default 100"]'),
            m('div.preview'),
            Page.getDeleteButton()
        ];
    },
    view(vnode) {
        return [
            m('header[data-background="info 600"]',
                Page.getHeader(),
                Page.getDrawer()
            ),
            m('article#editor.flex.align-stretch', [
                Page.getEditor(),
                Page.getNotification()
            ]),
            Page.getModal()
        ];

    }
};

export default Page;