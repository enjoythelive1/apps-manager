"use strict";
const express = require('express');
const vhost = require('vhost');
const path = require('path');
const fs = require('fs');
const debug = require('./debug');
const AppManager = require('./app-manager');

const projectsURL = process.env.APP_MANAGER_APP_LOCATION || path.join(__dirname, './apps');

const app_managers = [];


const server = express();

for (let dir of fs.readdirSync(projectsURL)) {
    dir = path.join(projectsURL, dir);
    let dirStat = fs.statSync(dir);

    if (dirStat.isDirectory()) {
        app_managers.push(new AppManager(dir, server));
    }
}

for (let app_manager of app_managers) {

    app_manager.register(server)
}

function startServer() {
    server.listen(process.env.APP_MANAGER_PORT || 8080, (err) => {
        if (err) {
            console.error(err);
            setTimeout(startServer, 1000);
        } else {
            debug(`Servers started ${app_managers.length} apps`);
        }
    });
}


startServer();

