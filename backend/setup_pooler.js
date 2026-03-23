const fs = require('fs');

const pass = 'W7ZLLgOZSJley0UN';
const user = 'postgres.sjezasjszvtrlpplxuuu';
const hostPart = 'aws-1-ap-south-1.pooler.supabase.com';
const portPart = ':6543';
const dbPart = '/postgres?sslmode=require&pgbouncer=true';

const dbUrl = 'postgresql://' + user + ':' + pass + '@' + hostPart + portPart + dbPart;

const redisUrl = 'rediss://default:gQAAAAAAASu2AAIncDJhZGM3ZTM0N2JkMjE0MWMzOWQzNTg4ZmI2NGY3NmI4ZnAyNzY3MjY@fleet-beagle-76726.upstash.io:6379';

const envContent = [
  'DATABASE_URL="' + dbUrl + '"',
  'REDIS_URL="' + redisUrl + '"',
  'OPENAI_API_KEY="testing_key"',
  'JWT_SECRET="supersecretkey"',
  'PORT=8080'
].join('\n');

fs.writeFileSync('.env', envContent, 'utf8');

let schemaStr = fs.readFileSync('prisma/schema.prisma', 'utf8');
schemaStr = schemaStr.replace(/url\s+=\s+".*?"/g, 'url = env("DATABASE_URL")');
fs.writeFileSync('prisma/schema.prisma', schemaStr, 'utf8');

console.log("ENV built with:", dbUrl);
