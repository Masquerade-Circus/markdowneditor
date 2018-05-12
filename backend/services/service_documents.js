let Service = {
    collection: undefined,
    getCollection() {
        if (Service.collection === undefined) {
            Service.collection = DB.getCollection("files");

            if (Service.collection === null) {
                Service.collection = DB.addCollection("files", {
                    indices: ['ip'],
                    disableMeta: true
                });
            }
        }

        return Service.collection;
    },
    isValid(document = {}) {
        return typeof document === 'object'
            && !Array.isArray(document)
            && Object.keys(document).length > 0
            && typeof document.title === 'string'
            && typeof document.ip === 'string'
            && typeof document.code === 'string';
    },
    new(ip) {
        let doc = Object.assign({}, CONFIG.Documents.new);
        doc.ip = ip;
        return Service.add(doc);
    },
    add(document) {
        if (!Service.isValid(document)) {
            return Promise.reject(new Error('document.add.invalid'));
        }

        let doc = Object.assign({
            createdAt: new Date(),
            modifiedAt: new Date(),
            title: document.title.trim() || '',
            ip: document.ip.trim() || '',
            code: document.code.trim() || ''
        }, document);

        return Promise.resolve(Service.getCollection().insert(doc));
    },
    find(options = {}) {
        let documents = Service
            .getCollection()
            .chain()
            .find(options)
            .simplesort('modifiedAt')
            .data();

        if (documents.length === 0) {
            return Service
                .new()
                .then(doc => {
                    documents.push(doc);
                    return documents;
                });
        }

        return Promise.resolve(documents);
    }
};

module.exports = Service;