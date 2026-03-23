const cp = require('child_process');
const fs = require('fs');
const axios = require('axios');

try {
    cp.execSync('taskkill /F /IM node.exe');
} catch(e) {}

const child = cp.spawn('node', ['./node_modules/tsx/dist/cli.mjs', 'src/server.ts']);
let logData = '';

child.stdout.on('data', chunk => logData += chunk.toString());
child.stderr.on('data', chunk => logData += chunk.toString());

setTimeout(async () => {
    console.log("Sending POST request...");
    try {
        await axios.post('http://localhost:8080/auth/signup', {
            email: `trace_${Date.now()}@example.com`,
            password: 'password123',
            company_name: 'TraceCorp'
        });
    } catch (e) {
        console.log("Caught:", e.response ? e.response.status : e.message);
    }

    setTimeout(() => {
        fs.writeFileSync('server_trace.log', logData);
        console.log("Trace captured!");
        try { process.kill(child.pid); } catch(err){}
        process.exit(0);
    }, 2000);
}, 5000);
