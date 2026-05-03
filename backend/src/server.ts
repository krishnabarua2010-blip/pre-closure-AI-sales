import Fastify from 'fastify';

const server = Fastify({ logger: true });

server.get('/', async () => {
  return { status: 'alive' };
});

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;

    console.log("🔥 STARTING FASTIFY ON", PORT);

    await server.listen({
      port: Number(PORT),
      host: '0.0.0.0',
    });

    console.log("🔥 FASTIFY RUNNING");
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
};

start();
