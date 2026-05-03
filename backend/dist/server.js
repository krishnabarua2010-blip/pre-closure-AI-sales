"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 3000;
console.log("ENV PORT:", process.env.PORT);
console.log("USING PORT:", PORT);
const server = http_1.default.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "alive" }));
});
server.listen(Number(PORT), "0.0.0.0", () => {
    console.log("🔥 SERVER RUNNING ON PORT", PORT);
});
