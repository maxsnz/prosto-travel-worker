import { createServer } from "http";
import dotenv from "dotenv";
import { generateGuide } from "./guide";
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/generate") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { chatId, cityId, days } = JSON.parse(body);

        if (
          typeof chatId !== "number" ||
          typeof cityId !== "number" ||
          typeof days !== "number"
        ) {
          throw new Error("Invalid parameter types");
        }

        res.writeHead(200);
        res.end("Accepted");
        console.log("generate guide", { chatId, cityId, days });
        generateGuide({ chatId, cityId, days });
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        res.writeHead(400);
        res.end("Bad request");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Worker listening on http://localhost:${PORT}`);
});
