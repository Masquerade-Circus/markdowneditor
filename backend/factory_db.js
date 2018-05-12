let Loki = require("lokijs");
let Lfsa = require('lokijs/src/loki-fs-structured-adapter.js');

let FactoryDb = () => {
    return new Promise((resolve, reject) => {
        let Adapter = new Lfsa();
        let Db = new Loki('./tmp/markdown.db', {
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