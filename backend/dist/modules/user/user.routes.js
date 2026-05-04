"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middlewares/auth");
async function userRoutes(fastify) {
    fastify.get('/me', { preHandler: [auth_1.authenticate] }, user_controller_1.UserController.me);
}
