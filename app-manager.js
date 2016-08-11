const vhost = require("vhost");

class AppManager {
    constructor(directory, express_server) {
        this.directory = directory;
        this.express_server = express_server;
        this.loadApp(directory);
    }

    loadApp(directory) {
        this.app = require(this.directory);
    }

    registger() {
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
        this.handler = vhost(this.domain, this.app.app);
    }
}

module.exports = AppManager;
module.exports.App = AppManager;