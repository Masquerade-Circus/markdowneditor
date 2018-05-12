let Initial = require('./router_initial');
let Documents = require('./router_documents');

let App = express();

App
    .use('/', Initial)
    .use('/api', Documents)
    ;

module.exports = App;