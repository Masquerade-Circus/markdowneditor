let Service = {
    isValid(document = {}) {
        return typeof document === 'object'
            && !Array.isArray(document)
            && Object.keys(document).length > 0
            && typeof document.title === 'string'
            && typeof document.code === 'string';
    },
    new() {
        let doc = Object.assign({}, CONFIG.Documents.new);
        doc.code = '';
        doc.isNew = true;
        return doc;
    },
    add(document) {
        if (Service.isValid(document)) {
            let doc = Object.assign({
                title: document.title.trim() || '',
                code: document.code.trim() || ''
            }, document);
            return SERVICE.Api.post('api', document);
        }

        return Promise.reject({
            status: 'error',
            message: 'The document is invalid',
            data: document
        });
    },
    find(options = {}) {
        return SERVICE.Api.get('api');
    }
};

export default Service;