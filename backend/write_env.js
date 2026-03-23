const fs = require('fs');

const pass = 'W7ZLLgOZSJley0UN';
const hostPart = 'db.sjezasjszvtrlpplxuuu';
const domainPart = '.supabase.co';
const portPart = ':5432';
const dbPart = '/postgres?sslmode=require&pgbouncer=true';

// Construct it perfectly without long single lines
const dbUrl = 'postgresql://postgres:' + pass + '@' + hostPart + domainPart + portPart + dbPart;

const redisUrl = 'rediss://default:gQAAAAAAASu2AAIncDJhZGM3ZTM0N2JkMjE0MWMzOWQzNTg4ZmI2NGY3NmI4ZnAyNzY3MjY@fleet-beagle-76726.upstash.io:6379';

const envContent = [
  'DATABASE_URL="' + dbUrl + '"',
  'REDIS_URL="' + redisUrl + '"',
  'OPENAI_API_KEY="testing_key"',
  'JWT_SECRET="supersecretkey"',
  'PORT=8080'
].join('\n');

fs.writeFileSync('.env', envContent, 'utf8');

// Fix schema.prisma dynamically without regex errors
let schemaStr = fs.readFileSync('prisma/schema.prisma', 'utf8');
schemaStr = schemaStr.replace(/url\s+=\s+".*?"/g, 'url = env("DATABASE_URL")');
fs.writeFileSync('prisma/schema.prisma', schemaStr, 'utf8');

console.log("ENV and SCHEMA fixed perfectly.");
