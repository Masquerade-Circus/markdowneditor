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
            content: 'The document is invalid'
        });

        return Promise.reject({
            status: 'error',
            message: 'The document is invalid',
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
                document.isModified = true;
                throw err;
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
                                content: response.message
                            });
                        });
                }
            });
    }
};

export default Service;