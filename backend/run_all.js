const cp = require('child_process');

console.log("=== GENERATING PRISMA ===");
cp.execSync('node ./node_modules/prisma/build/index.js generate', { stdio: 'inherit' });

console.log("=== PUSHING TO SUPABASE ===");
cp.execSync('node ./node_modules/prisma/build/index.js db push --accept-data-loss', { stdio: 'inherit' });

console.log("=== STARTING THE SERVER ===");
const server = cp.spawn('node', ['./node_modules/tsx/dist/cli.mjs', 'src/server.ts'], { detached: true });

setTimeout(() => {
    console.log("=== RUNNING E2E TESTS ===");
    try {
        cp.execSync('node ./node_modules/tsx/dist/cli.mjs scripts/run_e2e_tests.ts', { stdio: 'inherit' });
    } catch (e) {
        console.error("Test suite failed:", e.message);
    }
    process.kill(-server.pid) || server.kill();
    process.exit(0);
}, 6000);
