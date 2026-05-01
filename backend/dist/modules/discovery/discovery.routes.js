"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = discoveryRoutes;
const discovery_controller_1 = require("./discovery.controller");
const auth_1 = require("../../middlewares/auth");
async function discoveryRoutes(server) {
    server.addHook('preValidation', auth_1.authenticate);
    server.post('/generate', discovery_controller_1.DiscoveryController.generateLeads);
    server.post('/outreach', discovery_controller_1.DiscoveryController.generateOutreach);
    server.post('/deploy', discovery_controller_1.DiscoveryController.deployOutreach);
}
