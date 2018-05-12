let express = require('express');
let ROUTER = express.Router;
let CONFIG = require('./config');
let HELPER = require('./helpers');
let SERVICE = require('./services');


global.express = express;
global.ROUTER = ROUTER;
global.CONFIG = CONFIG;
global.HELPER = HELPER;
global.SERVICE = SERVICE;
