const { spawn } = require('child_process');
const fs = require('fs');

const server = spawn('npx', ['-y', '@testsprite/testsprite-mcp@latest'], {
  env: { ...process.env, API_KEY: process.env.API_KEY || 'dummy' },
  shell: true
});

let buffer = '';
let output = '';

server.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep the last incomplete line
  
  for (const line of lines) {
       if (line.trim()) {
           try {
             const msg = JSON.parse(line.trim());
             output += JSON.stringify(msg, null, 2) + '\n';
           } catch(e) {}
       }
  }
});

server.stderr.on('data', (data) => {
  console.error(`STDERR: ${data}`);
});

const initMsg = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" }
  }
};

const listToolsMsg = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/list",
  params: {}
};

server.stdin.write(JSON.stringify(initMsg) + '\n');
setTimeout(() => {
    server.stdin.write(JSON.stringify(listToolsMsg) + '\n');
}, 2000);

setTimeout(() => {
    fs.writeFileSync('mcp_tools.json', output);
    server.kill();
    process.exit(0);
}, 5000);
