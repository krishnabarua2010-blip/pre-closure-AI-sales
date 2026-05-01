"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = widgetRoutes;
const widget_controller_1 = require("./widget.controller");
async function widgetRoutes(fastify) {
    fastify.post('/init', widget_controller_1.WidgetController.initSession);
    fastify.post('/chat', widget_controller_1.WidgetController.chat);
}
