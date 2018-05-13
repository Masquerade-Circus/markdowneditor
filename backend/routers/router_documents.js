
let Router = ROUTER();

Router
    .get('/', (req, res) => {
        SERVICE.Documents
            .find({ ip: req.ip })
            .then(data => res.success.OK('document.success.find', data))
            .catch(err => {
                if (err.message === 'document.error.find') {
                    return res.error.UnprocessableEntity('document.error.find', { errors: err });
                }

                console.log(err);

                return res.error.BadRequest('document.error.bad_request', { errors: err });
            });
    })
    .get('/:id', (req, res) => {
        SERVICE.Documents
            .get(req.params.id)
            .then(data => {
                // If the request has the same ip set tell the user that he/she is the owner
                if (data.ip === req.ip) {
                    data.isOwner = true;
                }

                res.success.OK('document.success.get', data);
            })
            .catch(err => {
                if (err.message === 'document.error.get') {
                    return res.error.UnprocessableEntity('document.error.get', { errors: err });
                }

                if (err.message === 'document.error.not_found') {
                    return res.error.NotFound('document.error.not_found', { errors: err });
                }

                console.log(err);

                return res.error.BadRequest('document.error.bad_request', { errors: err });
            });
    })
    .post('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .add(req.body)
            .then(data => res.success.OK('document.success.add', data))
            .catch(err => {
                if (err.message === 'document.error.invalid') {
                    return res.error.UnprocessableEntity('document.error.invalid', { errors: err });
                }

                return res.error.BadRequest('document.error.bad_request', { errors: err });
            });
    })
    .put('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .save(req.body)
            .then(data => res.success.OK('document.success.save', data))
            .catch(err => {
                if (err.message === 'document.error.invalid') {
                    return res.error.UnprocessableEntity('document.error.invalid', { errors: err });
                }

                if (err.message === 'document.error.not_found') {
                    return res.error.NotFound('document.error.not_found', { errors: err });
                }

                if (err.message === 'document.error.unauthorized') {
                    return res.error.Unauthorized('document.error.unauthorized', { errors: err });
                }
            });
    })
    .delete('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .delete(req.body)
            .then(data => res.success.OK('document.success.delete', data))
            .catch(err => {
                if (err.message === 'document.error.invalid') {
                    return res.error.UnprocessableEntity('document.error.invalid', { errors: err });
                }

                if (err.message === 'document.error.not_found') {
                    return res.error.NotFound('document.error.not_found', { errors: err });
                }

                if (err.message === 'document.error.unauthorized') {
                    return res.error.Unauthorized('document.error.unauthorized', { errors: err });
                }
            });
    })
    ;

module.exports = Router;