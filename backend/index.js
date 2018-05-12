let fs = require('fs');
let micro = require('micro');
let Router = require('micro-ex-router');
let cors = require('cors');
let compression = require('compression');
let Helper = require('./helpers');
let SERVICE = require('./services');

// Create index file
let packageJson = require('../package.json');
let indexHtml = Helper.compile(fs.readFileSync('./public/index.html', 'utf8'), {
    version: packageJson.version,
    title: 'Markdown Editor'
});

// Create a new router
let router = Router();

router
    // Add cors middleware
    .use((req, res) => new Promise(next => cors()(req, res, next)))
    // Add compression middleware
    .use((req, res) => new Promise(next => compression()(req, res, next)))
    // Serve public folder
    .use(Helper.serveDir('./public'))
    // Serve index file
    .get('/', Helper.render(indexHtml))
    // We have no favicon
    .get('/favicon.ico', (req, res) => 'Not found')
    ;

// Init micro server
let server = micro(router);
let port = process.env.port || 3000;
server.listen(port, async () => console.log('Micro listening on port ' + port));

module.exports = server;
