import { FastifyInstance } from 'fastify';
import { WidgetController } from './widget.controller';

export default async function widgetRoutes(fastify: FastifyInstance) {
  fastify.post('/init', WidgetController.initSession);
  fastify.post('/chat', WidgetController.chat);
}
