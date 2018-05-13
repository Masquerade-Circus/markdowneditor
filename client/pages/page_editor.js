let Page = {
    document: {
        title: '',
        saved: '',
        permalink: '',
        code: '',
        loading: true
    },
    loading: true,
    interval: setInterval(() => Page.save(), 5000),
    isShared: false,
    save() {
        if (
            !Page.isShared,
            Page.document
            && Page.document.isModified
            && !Page.document.isSaving
        ) {
            return SERVICE.Documents
                .save(Page.document)
                .then(document => {
                    m.route.set('/' + document.$loki);
                });
        }

        return Promise.resolve();
    },
    oninit(vnode) {
        Page.isShared = vnode.attrs.isShared;
        if (vnode.attrs.id) {
            SERVICE.Documents.get(vnode.attrs.id)
                .then(response => {
                    Page.document = response.data;
                    Page.isOwner = Page.document.isOwner;
                    Page.loading = false;
                });
        }
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

        if (Page.isShared) {
            return [
                m('h1', [
                    Page.document.title,
                    ' ',
                    m('small', 'La última modificación se realizó ' + SERVICE.Timeago.format(Page.document.modifiedAt))
                ]),
                m('nav', [
                    /* !Page.isOwner
                        ? ''
                        : m('button', {
                            onclick(e) {
                                m.route.set('/' + Page.document.$loki);
                                e.preventDefault();
                            }
                        }, [
                                m('i.icon.icofont.icofont-edit'),
                                ' Editar'
                            ]) */
                ])
            ];
        }

        return [
            m('h1', [
                m('input[type="text"].title-input', {
                    style: 'width: ' + ((Page.document.title.length + 1) * 10) + 'rem;',
                    oninput(e) {
                        if (Page.document.isSaving) {
                            return e.preventDefault();
                        }

                        Page.document.title = e.target.value;
                        Page.document.isModified = true;
                    },
                    onblur() {
                        Page.save();
                    },
                    value: Page.document.title
                }),
                Page.document.isSaving
                    ? m('small', [
                        'Guardando...',
                        m('[data-progress="indeterminated success"]')
                    ])
                    : m('small', 'La última modificación se realizó ' + SERVICE.Timeago.format(Page.document.modifiedAt))
            ]),
            m('nav', [
                !Page.document.$loki
                    ? ''
                    : m('button', {
                        onclick(e) {
                            PAGE.Layout.openShareModal(Page.document);
                            e.preventDefault();
                        }
                    }, [
                            m('i.icon.icofont.icofont-share'),
                            m('span', ' Compartir')
                        ])
            ])
        ];
    },
    getDeleteButton() {
        if (Page.loading) {
            return m('a[href="#"][data-fab="danger"]', { onclick: e => e.preventDefault() });
        }

        return m('a[href="#"][data-fab="danger"]', {
            onclick(e) {
                PAGE.Layout.openDeleteModal(Page.document);
                e.preventDefault();
            }
        }, [
                m('i.icon.icofont.icofont-ui-delete')
            ]);
    },
    view() {
        if (Page.loading) {
            return [
                m('textarea[data-background="default 100"]'),
                m('div.preview', [
                    m('[data-text-placeholder="50"][data-background="default 300"][style="margin-bottom: 10rem"]'),
                    m('[data-text-placeholder="100 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                    m('[data-text-placeholder="100 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                    m('[data-text-placeholder="100 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                    m('[data-text-placeholder="50 sm"][data-background="default 300"][style="margin-bottom: 4rem"]'),
                ])
            ];
        }

        return [
            m('textarea[data-background="default 100"]', {
                oninput(e) {
                    if (Page.document.isSaving || Page.isShared) {
                        return e.preventDefault();
                    }

                    Page.document.code = e.target.value;
                    Page.document.isModified = true;
                },
                onblur(e) {
                    Page.save();
                },
                value: Page.document.code
            }),
            m('div.preview', m.trust(SERVICE.Markdown.render(Page.document.code)))
        ];
    }
};

export default Page;