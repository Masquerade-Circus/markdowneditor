let Page = {
    drawerOpened: false,
    title: '',
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
    initialId: 0,
    setCurrent(current) {
        // If current document is modified try to save it one last time
        PAGE.Editor
            .save()
            .then(() => {
                // Set the new current document
                Page.documents.current = Page.documents.list[current];
                Page.documents.current.isModified = false;
                HELPER.Title(Page.documents.current.title);

                // Remove emptyy documents
                if (Page.documents.current.$loki !== undefined) {
                    Page.documents.list.forEach((item, index) => {
                        if (item.isNew && item.code.trim().length === 0) {
                            Page.documents.list.splice(index, 1);
                        }
                    });
                }

                if (!Page.documents.current.isNew) {
                    m.route.set('/' + Page.documents.current.$loki);
                }

                if (Page.documents.current.isNew) {
                    PAGE.Editor.document = Page.documents.current;
                    PAGE.Editor.document.code = '';
                    m.route.set('/');
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
        Page.title = SERVICE.Lang('title');
        Page.find();
    },
    openDeleteModal(document = {}) {
        var name = '';
        var valid = undefined;
        var className = '';

        SERVICE.Documents
            .isValid(document, false)
            .then(() => {
                COMPONENT.Modal.open({
                    content: [
                        m('div', '' + SERVICE.Lang('ui.delete_confirmation.title')),
                        m('.form-group' + className, [
                            m('input[type="text"]', {
                                placeholder: SERVICE.Lang('ui.delete_confirmation.placeholder'),
                                oninput(e) {
                                    name = e.target.value;
                                },
                                value: name
                            }),
                            m('label', SERVICE.Lang('ui.delete_confirmation.placeholder'))
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
                            }, SERVICE.Lang('actions.cancel')),
                            m('button[data-button="danger"]', {
                                onclick(e) {
                                    valid = name === document.title;
                                    className = valid ? '.has-success' : '.has-error';
                                    COMPONENT.Modal.content = [
                                        m('div', SERVICE.Lang('ui.delete_confirmation.title')),
                                        m('.form-group' + className, [
                                            m('input[type="text"]', {
                                                placeholder: SERVICE.Lang('ui.delete_confirmation.placeholder'),
                                                oninput(e) {
                                                    name = e.target.value;
                                                },
                                                value: name
                                            }),
                                            m('label', SERVICE.Lang('ui.delete_confirmation.placeholder'))
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
                            }, SERVICE.Lang('actions.delete'))
                        ])
                    ]
                });
            });
    },
    openShareModal(document = {}) {
        SERVICE.Documents
            .isValid(document, false)
            .then(() => {
                COMPONENT.Modal.open({
                    header: [
                        m('h1', SERVICE.Lang('document.share_modal.title'))
                    ],
                    content: [
                        m('.form-group', [
                            m('input[type="text"]', {
                                value: SERVICE.Api.baseUrl + '/#!/shared/' + document.$loki
                            }),
                            m('label', SERVICE.Lang('document.share_modal.label')),
                            m('p.help-block', [
                                m('a[target="_blank"]', {
                                    href: SERVICE.Api.baseUrl + '/#!/shared/' + document.$loki
                                }, SERVICE.Lang('document.share_modal.test_link'))
                            ])
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
                            }, SERVICE.Lang('actions.close'))
                        ])
                    ]
                });
            });
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
            return m('li', {
                'data-background':
                    (
                        (item.isNew && Page.documents.current.isNew)
                        || (item.$loki === Page.documents.current.$loki)
                    )
                        ? 'info 50'
                        : ''
            }, [
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
                                m('div', [
                                    m('h4', SERVICE.Lang('ui.title'))
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
    view(vnode) {
        return [
            m('header[data-background="info 600"]',
                PAGE.Editor.getHeader(),
                Page.getDrawer()
            ),
            m('article#editor.flex.align-stretch', vnode.children),
            PAGE.Editor.getDeleteButton(),
            m(COMPONENT.Notification),
            m(COMPONENT.Modal),
        ];
    }
};

export default Page;