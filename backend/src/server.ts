import http from "http";

const PORT = process.env.PORT || 3000;

console.log("ENV PORT:", process.env.PORT);
console.log("USING PORT:", PORT);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "alive" }));
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log("🔥 SERVER RUNNING ON PORT", PORT);
});
