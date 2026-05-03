"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = discoveryRoutes;
const discovery_controller_1 = require("./discovery.controller");
const auth_1 = require("../../middlewares/auth");
const usage_1 = require("../../middlewares/usage");
async function discoveryRoutes(server) {
    server.addHook('preValidation', auth_1.authenticate);
    // Lead generation with daily caps + cooldown
    server.post('/generate', { preHandler: [usage_1.enforceCooldown, usage_1.checkDailyLeadCap] }, discovery_controller_1.DiscoveryController.generateLeads);
    // Outreach management
    server.post('/outreach', discovery_controller_1.DiscoveryController.generateOutreach);
    server.post('/deploy', { preHandler: [usage_1.enforceCooldown] }, discovery_controller_1.DiscoveryController.deployOutreach);
    // Follow-up sequence
    server.get('/follow-ups/:leadId', discovery_controller_1.DiscoveryController.getFollowUps);
    // CRM pipeline status updates
    server.post('/lead-status', discovery_controller_1.DiscoveryController.updateLeadStatus);
    // Usage stats
    server.get('/usage', discovery_controller_1.DiscoveryController.getUsageStats);
}
