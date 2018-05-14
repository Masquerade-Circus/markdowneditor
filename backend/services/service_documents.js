let ServiceValidate = require('./service_validate');

let Schemas = {
    json: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            code: { type: 'string' },
            ip: { type: 'string' },
            $loki: { type: 'string' }
        },
        required: []
    }
};

let Service = {
    schmas: Schemas,
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
    Validator: ServiceValidate(Schemas.json),
    validate(document) {
        return Service.Validator
            .data(document)
            .normalize()
            .validate()
            .then(data => data);
    },
    isValid(document = {}, checkCode = true) {
        return new Promise((resolve, reject) => {
            let valid = typeof document === 'object'
                && !Array.isArray(document)
                && Object.keys(document).length > 0
                && typeof document.title === 'string'
                && typeof document.ip === 'string'
                && (checkCode ? typeof document.code === 'string' : true);

            // To avoid schema validation if its not required
            if (!checkCode) {
                return valid
                    ? resolve(document)
                    : reject(new Error('document.error.invalid'));
            }

            resolve(Service.validate(document));
        });
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
                // This is to not modify the original item
                let doc = Object.assign({}, item);
                delete doc.deleted;
                delete doc.deletedAt;
                delete doc.code;
                return doc;
            });

        if (documents.length === 0) {
            return Service
                .new(options.ip)
                .then(item => {
                    // This is to not modify the original item
                    let doc = Object.assign({}, item);
                    delete doc.deleted;
                    delete doc.deletedAt;
                    delete doc.code;
                    documents.push(doc);
                    return documents;
                });
        }

        return Promise.resolve(documents);
    },
    get(id) {
        let doc = Service
            .getCollection()
            .get(id);

        // If does not exist throw error not found 
        if (doc === null) {
            return Promise.reject(new Error('document.error.not_found'));
        }

        return Promise.resolve(doc);
    },
    add(document) {
        return Service.isValid(document)
            .then(document => {
                let doc = {
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    title: document.title.trim() || '',
                    ip: document.ip.trim() || '',
                    code: document.code.trim() || '',
                    deleted: false
                };

                return Service.getCollection().insert(doc);
            });
    },
    save(document) {
        return Service.isValid(document)
            .then(document => {
                // Find the document 
                let doc = Service.getCollection().get(document.$loki);

                // If does not exist throw error not found 
                if (doc === null) {
                    throw new Error('document.error.not_found');
                }

                // If exists check if the ip is the same as the saved document 
                // If isnt throw error unauthorized
                if (doc.ip !== document.ip) {
                    throw new Error('document.error.unauthorized');
                }

                // Save the document 
                doc.title = document.title;
                doc.code = document.code;
                doc.modifiedAt = new Date();
                Service.getCollection().update(doc);
                return Service.getCollection().get(document.$loki);
            });
    },
    delete(document) {
        return Service.isValid(document, false)
            .then(document => {
                // Find the document 
                let doc = Service.getCollection().get(document.$loki);

                // If does not exist throw error not found 
                if (doc === null) {
                    throw new Error('document.error.not_found');
                }

                // If exists check if the ip is the same as the saved document 
                // If isnt throw error unauthorized
                if (doc.ip !== document.ip) {
                    throw new Error('document.error.unauthorized');
                }

                // Save the document 
                doc.deletedAt = new Date();
                doc.deleted = true;
                Service.getCollection().update(doc);

                // Do not return anything
            });
    }

};

module.exports = Service;