let Loki = require("lokijs");
let Lfsa = require('lokijs/src/loki-fs-structured-adapter.js');
let path = require('path');

let FactoryDb = () => {
    return new Promise((resolve, reject) => {
        let Adapter = new Lfsa();
        let dbDir =
            process.env.NOW
                ? '/tmp/markdown.db'
                : path.join(__dirname, '../tmp/markdown.db');
        let Db = new Loki(dbDir, {
            adapter: Adapter,
            autoload: true,
            autoloadCallback: () => {
                resolve(Db);
            },
            autosave: true,
            autosaveInterval: 30000
        });
    });
};


module.exports = FactoryDb;