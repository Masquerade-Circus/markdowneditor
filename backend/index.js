require('./bootstrap');
let FactoryDb = require('./factory_db');
let Router = require('./routers');

// Init server after the db is created/loaded
let startQuery = FactoryDb()
    .then(Db => global.DB = Db)
    .then(() => {
        let port = process.env.port || 3000;
        Router.listen(port, () => console.log('Express server listening on port ' + port));
    })
    .catch(e => {
        console.log(e);
        process.exit();
    });

module.exports = startQuery;
