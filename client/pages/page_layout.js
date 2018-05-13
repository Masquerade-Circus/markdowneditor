let Page = {
    drawerOpened: false,
    title: 'Markdown Editor',
    documents: {
        current: {
            title: '',
            saved: '',
            permalink: '',
            code: '',
            loading: true
        },
        list: []
    },
    loading: true,
    interval: setInterval(() => Page.save(), 5000),
    save() {
        if (
            Page.documents.current
            && Page.documents.current.isModified
            && !Page.documents.current.isSaving
        ) {
            return SERVICE.Documents.save(Page.documents.current);
        }

        return Promise.resolve();
    },
    setCurrent(current) {
        // If current document is modified try to save it one last time
        Page.save()
            .then(() => {
                // Set the new current document
                Page.documents.current = Page.documents.list[current];
                Page.documents.current.isModified = false;

                // Remove emptyy documents
                if (Page.documents.current.$loki !== undefined) {
                    Page.documents.list.forEach((item, index) => {
                        if (item.isNew && item.code.trim().length === 0) {
                            Page.documents.list.splice(index, 1);
                        }
                    });
                }
            });
    },
    find() {
        return SERVICE.Documents
            .find()
            .then(response => {
                Page.documents.list = response.data;
                Page.setCurrent(0);
                Page.loading = false;
            })
            .catch(response => console.log(response));
    },
    oninit() {
        Page.find();
    },
    openDeleteModal(document = {}) {
        var name = '';
        var valid = undefined;
        var className = '';

        SERVICE.Documents
            .isValid(document)
            .then(() => {
                COMPONENT.Modal.open({
                    content: [
                        m('div', 'Escribe nuevamente el nombre del documento para borrarlo'),
                        m('.form-group' + className, [
                            m('input[type="text"][placeholder="Nombre del documento"]', {
                                oninput(e) {
                                    name = e.target.value;
                                },
                                value: name
                            }),
                            m('label', 'Nombre del documento')
                        ])
                    ],
                    footer: [
                        m('nav', [
                            m('button[data-button="default"]', {
                                onclick(e) {
                                    COMPONENT.Modal.close(e);
                                    name = '';
                                    e.preventDefault();
                                }
                            }, 'Cancelar'),
                            m('button[data-button="danger"]', {
                                onclick(e) {
                                    valid = name === document.title;
                                    className = valid ? '.has-success' : '.has-error';
                                    COMPONENT.Modal.content = [
                                        m('div', 'Escribe nuevamente el nombre del documento para borrarlo'),
                                        m('.form-group' + className, [
                                            m('input[type="text"][placeholder="Nombre del documento"]', {
                                                oninput(e) {
                                                    name = e.target.value;
                                                },
                                                value: name
                                            }),
                                            m('label', 'Nombre del documento')
                                        ])
                                    ];
                                    if (valid) {
                                        COMPONENT.Modal.close(e);
                                        name = '';
                                        SERVICE.Documents
                                            .delete(document)
                                            .then(() => {
                                                Page.find();
                                            });
                                    }
                                }
                            }, 'Eliminar')
                        ])
                    ]
                });
            });
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
                m('input[type="text"].title-input', {
                    style: 'width: ' + ((Page.documents.current.title.length + 1) * 10) + 'rem;',
                    oninput(e) {
                        if (Page.documents.current.isSaving) {
                            return e.preventDefault();
                        }

                        Page.documents.current.title = e.target.value;
                        Page.documents.current.isModified = true;
                    },
                    onblur() {
                        Page.save();
                    },
                    value: Page.documents.current.title
                }),
                Page.documents.current.isSaving
                    ? m('small', [
                        'Guardando...',
                        m('[data-progress="indeterminated success"]')
                    ])
                    : m('small', 'La última modificación se realizó ' + SERVICE.Timeago.format(Page.documents.current.modifiedAt))
            ]),
            m('nav', [
                !Page.documents.current.$loki
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

        return m('ul[data-list="two-line"]', Page.documents.list.map((item, index) => {
            return m('li', { 'data-background': index === Page.documents.current.index ? 'info 50' : '' }, [
                m('a[href="#"]', {
                    onclick(e) {
                        Page.setCurrent(index);
                        e.preventDefault();
                    }
                }, [
                        m('i.icon.icofont.icofont-ebook', { 'data-background': item.id === Page.documents.current.id ? 'info' : 'default' }),
                        item.title,
                        m('small', SERVICE.Timeago.format(item.modifiedAt))
                    ]),
                m('a[href="#"]', {
                    onclick(e) {
                        Page.openDeleteModal(item);
                        e.preventDefault();
                    }
                }, [
                        m('i.icon.icofont.icofont-ui-delete[data-font="danger"]')
                    ])
            ]);
        }));
    },
    getNewButton() {
        if (Page.loading) {
            return m('button[data-button="success raised new"]');
        }

        return m('button[data-button="success raised new"]', {
            onclick(e) {

                if (Page.documents.current.isNew && Page.documents.current.code.trim().length === 0) {
                    Object.assign(Page.documents.current, SERVICE.Documents.new());
                    e.preventDefault();
                    return;
                }

                Page.documents.list.unshift(SERVICE.Documents.new());
                Page.setCurrent(0);
                e.preventDefault();
            }
        }, 'Nuevo');
    },
    getDeleteButton() {
        if (Page.loading) {
            return m('a[href="#"][data-fab="danger"]', { onclick: e => e.preventDefault() });
        }

        return m('a[href="#"][data-fab="danger"]', {
            onclick(e) {
                Page.openDeleteModal(Page.documents.current);
                e.preventDefault();
            }
        }, [
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
            m('textarea[data-background="default 100"]', {
                oninput(e) {
                    if (Page.documents.current.isSaving) {
                        return e.preventDefault();
                    }

                    Page.documents.current.code = e.target.value;
                    Page.documents.current.isModified = true;
                },
                onblur(e) {
                    Page.save();
                },
                value: Page.documents.current.code
            }),
            m('div.preview', m.trust(SERVICE.Markdown.render(Page.documents.current.code))),
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
                m(COMPONENT.Notification)
            ]),
            m(COMPONENT.Modal)
        ];

    }
};

export default Page;