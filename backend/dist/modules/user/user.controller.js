"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    static async me(request, reply) {
        try {
            const user = request.user;
            if (!user) {
                return reply.code(401).send({ error: 'User not found' });
            }
            // Return consistent fields as requested
            return reply.send({
                id: user.id,
                email: user.email,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus,
            });
        }
        catch (error) {
            console.error("🔥 ME ERROR:", error);
            return reply.code(500).send({ error: 'Failed to fetch user' });
        }
    }
}
exports.UserController = UserController;
