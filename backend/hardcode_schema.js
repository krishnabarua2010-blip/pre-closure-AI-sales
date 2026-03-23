const fs = require('fs');
const cp = require('child_process');

const pass = 'W7ZLLgOZSJley0UN';
const user = 'postgres.sjezasjszvtrlpplxuuu';
const hostPart = 'aws-1-ap-south-1.pooler.supabase.com';
const portPart = ':6543';
const dbPart = '/postgres?sslmode=require&pgbouncer=true';

const dbUrl = 'postgresql://' + user + ':' + pass + '@' + hostPart + portPart + dbPart;

let schemaStr = fs.readFileSync('prisma/schema.prisma', 'utf8');
schemaStr = schemaStr.replace(/url\s*=\s*(env\("DATABASE_URL"\)|".*?")/g, 'url = "' + dbUrl + '"');

fs.writeFileSync('prisma/schema.prisma', schemaStr, 'utf8');
console.log("Hardcoded schema.prisma");

try {
  console.log(cp.execSync('node ./node_modules/prisma/build/index.js generate', {encoding:'utf8'}));
  console.log(cp.execSync('node ./node_modules/prisma/build/index.js db push --accept-data-loss', {encoding:'utf8'}));
} catch(e) {
  console.error("STDOUT:", e.stdout);
  console.error("STDERR:", e.stderr);
  process.exit(1);
}
