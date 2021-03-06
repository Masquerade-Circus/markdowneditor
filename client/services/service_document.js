let Service = {
    isValid(document = {}, checkCode = true) {
        let isValid = typeof document === 'object'
            && !Array.isArray(document)
            && Object.keys(document).length > 0
            && typeof document.title === 'string'
            && (checkCode ? typeof document.code === 'string' : true);

        if (isValid) {
            return Promise.resolve();
        }

        COMPONENT.Notification.open({
            color: 'danger',
            content: SERVICE.Lang('document.error.invalid')
        });

        return Promise.reject({
            status: 'error',
            message: SERVICE.Lang('document.error.invalid'),
            data: document
        });
    },
    new() {
        let doc = Object.assign({}, CONFIG.Documents.new);
        doc.code = '';
        doc.isNew = true;
        return doc;
    },
    add(document) {
        return Service
            .isValid(document)
            .then(() => {
                let doc = Object.assign({
                    title: document.title.trim() || '',
                    code: document.code.trim() || ''
                }, document);
                return SERVICE.Api.post('api', document);
            });
    },
    find(options = {}) {
        return SERVICE.Api.get('api');
    },
    get(id) {
        return SERVICE.Api.get('api', id);
    },
    save(document = {}) {
        document.isSaving = true;
        return Service
            .isValid(document)
            .then(() => {
                if (!document.isModified) {
                    return document;
                }

                let query;

                if (document.isNew && document.$loki === undefined) {
                    query = Service.add(document);
                }

                if (!document.isNew && document.$loki !== undefined) {
                    query = SERVICE.Api.put('api', document);
                }

                return query
                    .then(response => {
                        let doc = response.data;
                        Object.assign(document, doc);
                        document.isModified = false;
                        document.isSaving = false;
                        document.isNew = false;
                        return document;
                    });
            })
            .catch(err => {
                if (err.message === 'document.error.validation') {
                    COMPONENT.Modal.open({
                        header: m('h1', SERVICE.Lang('document.error.validation')),
                        content: [
                            m('ul[data-list="two-line"][data-font="danger"]', Object.keys(err.errors).map(errorName => {
                                let e = err.errors[errorName];
                                let translationCode = e.message;
                                if (e.arg) {
                                    translationCode += '_' + e.arg;
                                }
                                return m('li', [
                                    m('span.wrap', e.path + ': ' + SERVICE.Lang(translationCode))
                                ]);
                            }))
                        ],
                        footer: [
                            m('nav', [
                                m('button[data-button="default"]', {
                                    onclick(e) {
                                        COMPONENT.Modal.close(e);
                                        e.preventDefault();
                                    }
                                }, SERVICE.Lang('actions.close'))
                            ])
                        ]
                    });
                }
                document.isModified = true;
                document.isSaving = false;
            });
    },
    delete(document = {}) {
        document.isSaving = true;
        return Service
            .isValid(document, false)
            .then(() => {
                let query;

                if (document.isNew && document.$loki === undefined) {
                    return Promise.resolve();
                }

                if (!document.isNew && document.$loki !== undefined) {
                    return SERVICE.Api
                        .delete('api', document)
                        .then(response => {
                            COMPONENT.Notification.open({
                                color: 'success',
                                content: SERVICE.Lang(response.message)
                            });
                        });
                }
            });
    }
};

export default Service;