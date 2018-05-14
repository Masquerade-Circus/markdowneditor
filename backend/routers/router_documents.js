
let Router = ROUTER();

let errorCatcher = (res, method = 'undefined') => {
    return (err) => {
        if (err.message === 'document.error.' + method) {
            return res.error.UnprocessableEntity('document.error.' + method, { errors: err });
        }

        if (err.message === 'document.error.invalid') {
            return res.error.UnprocessableEntity('document.error.invalid', { errors: err });
        }

        if (err.message === 'document.error.not_found') {
            return res.error.NotFound('document.error.not_found', { errors: err });
        }

        if (err.message === 'document.error.unauthorized') {
            return res.error.Unauthorized('document.error.unauthorized', { errors: err });
        }

        if (err.name === 'ValidationError') {
            return res.error.NotAcceptable('document.error.validation', err);
        }

        return res.error.BadRequest('document.error.bad_request', { errors: err });
    };
};

Router
    .get('/', (req, res) => {
        SERVICE.Documents
            .find({ ip: req.ip })
            .then(data => res.success.OK('document.success.find', data))
            .catch(errorCatcher(res, 'find'));
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
            .catch(errorCatcher(res, 'get'));
    })
    .post('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .add(req.body)
            .then(data => res.success.OK('document.success.add', data))
            .catch(errorCatcher(res, 'add'));
    })
    .put('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .save(req.body)
            .then(data => {
                res.success.OK('document.success.save', data);
            })
            .catch(errorCatcher(res, 'save'));
    })
    .delete('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .delete(req.body)
            .then(data => res.success.OK('document.success.delete', data))
            .catch(errorCatcher(res, 'delete'));
    })
    ;

module.exports = Router;