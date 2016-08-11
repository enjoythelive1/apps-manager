"use strict";
const vhost = require("vhost");

class AppManager {
    constructor(directory, express_server) {
        this.directory = directory;
        this.express_server = express_server;
        this.loadApp(directory);
    }

    loadApp(directory) {
        let App = require(this.directory).App;
        this.app = new App({port: process.env.APP_MANAGER_PORT || 8080});
    }

    register() {
        this.createHandler();
        this.enable();
        this.express_server.use((req, res, next) => {
            if (this.enabled) {
                this.handler(req, res, next);
            } else {
                next();
            }
        });
    }

    enable() {
        this.enabled = true;
    }

    createHandler() {
        this.handler = vhost(this.app.domain, this.app.app);
    }
}

module.exports = AppManager;
module.exports.App = AppManager;