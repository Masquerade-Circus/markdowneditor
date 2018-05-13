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
    find(options = {}) {
        options.deleted = options.deleted || false;

        let documents = Service
            .getCollection()
            .chain()
            .find(options)
            .simplesort('modifiedAt')
            .data()
            .map(item => {
                delete item.deleted;
                delete item.deletedAt;
                return item;
            });

        if (documents.length === 0) {
            return Service
                .new(options.ip)
                .then(doc => {
                    documents.push(doc);
                    return documents;
                });
        }

        return Promise.resolve(documents);
    },
    add(document) {
        if (!Service.isValid(document)) {
            return Promise.reject(new Error('document.error.invalid'));
        }

        let doc = {
            createdAt: new Date(),
            modifiedAt: new Date(),
            title: document.title.trim() || '',
            ip: document.ip.trim() || '',
            code: document.code.trim() || '',
            deleted: false
        };

        return Promise.resolve(Service.getCollection().insert(doc));
    },
    save(document) {
        if (!Service.isValid(document)) {
            return Promise.reject(new Error('document.error.invalid'));
        }

        // Find the document 
        let doc = Service.getCollection().get(document.$loki);

        // If does not exist throw error not found 
        if (doc === null) {
            return Promise.reject(new Error('document.error.not_found'));
        }

        // If exists check if the ip is the same as the saved document 
        // If isnt throw error unauthorized
        if (doc.ip !== document.ip) {
            return Promise.reject(new Error('document.error.unauthorized'));
        }

        // Save the document 
        doc.title = document.title;
        doc.code = document.code;
        doc.modifiedAt = new Date();
        Service.getCollection().update(doc);
        return Promise.resolve(Service.getCollection().get(document.$loki));
    },
    delete(document) {
        if (!Service.isValid(document)) {
            return Promise.reject(new Error('document.error.invalid'));
        }

        // Find the document 
        let doc = Service.getCollection().get(document.$loki);

        // If does not exist throw error not found 
        if (doc === null) {
            return Promise.reject(new Error('document.error.not_found'));
        }

        // If exists check if the ip is the same as the saved document 
        // If isnt throw error unauthorized
        if (doc.ip !== document.ip) {
            return Promise.reject(new Error('document.error.unauthorized'));
        }

        // Save the document 
        doc.deletedAt = new Date();
        doc.deleted = true;
        Service.getCollection().update(doc);
        return Promise.resolve();
    }

};

module.exports = Service;