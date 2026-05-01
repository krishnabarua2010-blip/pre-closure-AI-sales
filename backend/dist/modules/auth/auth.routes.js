"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const auth_controller_1 = require("./auth.controller");
async function authRoutes(fastify) {
    fastify.post('/signup', auth_controller_1.AuthController.signup);
    fastify.post('/login', auth_controller_1.AuthController.login);
    fastify.post('/guest', auth_controller_1.AuthController.guest);
}
