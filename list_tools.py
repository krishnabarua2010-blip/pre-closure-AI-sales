import sys
import os
import json
import time
import subprocess

# Set up environment
env = os.environ.copy()
api_key = env.get("API_KEY", "dummy")
env["API_KEY"] = api_key

# Start process
p = subprocess.Popen(
    ["cmd.exe", "/c", "npx -y @testsprite/testsprite-mcp@latest"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    env=env,
    text=True
)

init_msg = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "test-client", "version": "1.0.0"}
    }
}
p.stdin.write(json.dumps(init_msg) + "\n")
p.stdin.flush()

time.sleep(1)

tools_msg = {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
}
p.stdin.write(json.dumps(tools_msg) + "\n")
p.stdin.flush()

time.sleep(2)

p.poll()
outs, errs = "", ""
try:
    outs, errs = p.communicate(timeout=2)
except subprocess.TimeoutExpired:
    p.kill()
    outs, errs = p.communicate()

with open("mcp_tools.json", "w") as f:
    f.write(outs)
with open("mcp_err.log", "w") as f:
    f.write(errs)

print("Done")
