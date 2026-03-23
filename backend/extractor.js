const fs = require('fs');
const log = fs.readFileSync('final_trace.log', 'utf16le');
const lines = log.split('\n');
let found = '';
lines.forEach(l => {
    if (l.includes('"level":50') && l.includes('"err":')) {
        try {
            const data = JSON.parse(l.trim());
            if (data.err && data.err.stack) {
                found += data.err.stack + '\n';
            }
        } catch(e) {}
    }
});
if (!found) found = 'No level 50 err stack found in the log... Make sure the endpoint was actually hit and threw 500.';
fs.writeFileSync('trace_output.txt', found);
console.log("Extraction complete.");
