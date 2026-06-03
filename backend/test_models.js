const { OpenAI } = require('openai');
require('dotenv').config();

const apiKey = process.env.NGC_API_KEY || process.env.MISTRAL_API_KEY;
console.log("NGC_API_KEY prefix:", apiKey ? apiKey.substring(0, 10) : "none");

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1'
});

async function main() {
  try {
    console.log("Testing chat completion with deepseek-ai/deepseek-v4-pro...");
    const response = await client.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro",
      messages: [{ role: "user", content: "Hello, who are you? Answer in 5 words." }],
      max_tokens: 30
    });
    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("Failed deepseek-ai/deepseek-r1:", error.message);
    try {
      console.log("Testing chat completion with deepseek-ai/deepseek-r1-distill-llama-70b...");
      const response = await client.chat.completions.create({
        model: "deepseek-ai/deepseek-r1-distill-llama-70b",
        messages: [{ role: "user", content: "Hello, who are you? Answer in 5 words." }],
        max_tokens: 30
      });
      console.log("Response:", response.choices[0].message.content);
    } catch (err) {
      console.error("Failed deepseek-ai/deepseek-r1-distill-llama-70b:", err.message);
      try {
        console.log("Listing available Nvidia NIM models containing deepseek...");
        const list = await client.models.list();
        const deepseekModels = list.data.filter(m => m.id.toLowerCase().includes('deepseek')).map(m => m.id);
        console.log("DeepSeek models available:", deepseekModels);
      } catch (listErr) {
        console.error("Failed to list models:", listErr.message);
      }
    }
  }
}

main();
