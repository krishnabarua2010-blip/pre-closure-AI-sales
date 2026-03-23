const fs = require('fs');
const cp = require('child_process');

const cleanUrl = 'postgresql://postgres:W7ZLLgOZSJley0UN@db.sjezasjszvtrlpplxuuu.supabase.co:5432/postgres?sslmode=require';

// Update .env
fs.writeFileSync('.env', `DATABASE_URL="${cleanUrl}"\nREDIS_URL="rediss://default:gQAAAAAAASu2AAIncDJhZGM3ZTM0N2JkMjE0MWMzOWQzNTg4ZmI2NGY3NmI4ZnAyNzY3MjY@fleet-beagle-76726.upstash.io:6379"\nOPENAI_API_KEY="testing_key"\nJWT_SECRET="supersecretkey"\nPORT=8080`);

// Update Prisma schema
let p = fs.readFileSync('prisma/schema.prisma','utf8');
p = p.replace(/url\s*=\s*".*?"/, `url = "${cleanUrl}"`);
fs.writeFileSync('prisma/schema.prisma', p);

try {
  console.log("Generating Prisma client...");
  console.log(cp.execSync('npx prisma generate', {encoding:'utf8'}));
  console.log("Pushing DB schema...");
  console.log(cp.execSync('npx prisma db push', {encoding:'utf8'}));
} catch(e) {
  console.error("Prisma error:", e.stdout || e.message);
  process.exit(1);
}
