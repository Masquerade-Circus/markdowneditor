let fs = require('fs');
let cors = require('cors');
let compression = require('compression');
let bodyParser = require('body-parser');
let responseHandler = require('express-response-handler');

let Router = ROUTER();

// Create index file
let packageJson = require('../../package.json');
let indexHtml = HELPER.compile(fs.readFileSync('./public/index.html', 'utf8'), {
    version: packageJson.version,
    title: 'Markdown Editor'
});

Router
    // Add cors middleware
    .use(cors())
    // Add compression middleware
    .use(compression())
    // Add response handler
    .use(responseHandler())
    // Parse body
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    // Serve public folder
    .use(express.static('./public'))
    // Serve index file
    .get('/', HELPER.render(indexHtml))
    // We have no favicon
    .get('/favicon.ico', (req, res) => 'Not found')
    ;

module.exports = Router;