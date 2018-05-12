
let Router = ROUTER();

Router
    .post('/', (req, res) => {
        req.body.ip = req.ip;
        SERVICE.Documents
            .add(req.body)
            .then(data => res.success.OK('document.success.add', data))
            .catch(err => res.error.UnprocessableEntity('document.error.add', { errors: err }));
    })
    .get('/', (req, res) => {
        SERVICE.Documents
            .find({ ip: req.ip })
            .then(data => res.success.OK('document.success.find', data))
            .catch(err => res.error.UnprocessableEntity('document.error.find', { errors: err }));
    })
    ;

module.exports = Router;