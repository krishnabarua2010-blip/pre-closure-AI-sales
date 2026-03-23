const fs = require('fs');
const url = 'postgresql://postgres:W7ZLLgOZSJley0UN@db.sjezasjszvtrlpplxuuu.supabase.co:5432/postgres';
fs.writeFileSync('.env', `DATABASE_URL="${url}"\nREDIS_URL="rediss://default:gQAAAAAAASu2AAIncDJhZGM3ZTM0N2JkMjE0MWMzOWQzNTg4ZmI2NGY3NmI4ZnAyNzY3MjY@fleet-beagle-76726.upstash.io:6379"\nOPENAI_API_KEY="your_real_key_here"\nJWT_SECRET="supersecretkey"\nPORT=8080`);

let p = fs.readFileSync('prisma/schema.prisma','utf8');
p = p.replace(/url\s*=\s*".*?"/, `url = "${url}"`);
fs.writeFileSync('prisma/schema.prisma', p);

const cp = require('child_process');
try {
  console.log(cp.execSync('npx prisma db push', {encoding:'utf8'}));
} catch (e) {
  console.error("STDOUT:", e.stdout);
  console.error("STDERR:", e.stderr);
}
