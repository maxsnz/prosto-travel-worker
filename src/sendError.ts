import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function sendError(error: unknown, chatId: number) {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    console.error("TELEGRAM_TOKEN not set");
    return;
  }

  let message = "❌ Произошла неизвестная ошибка";

  if (error instanceof Error) {
    message = `❌ Ошибка: ${error.name}\n${error.message}`;
  } else if (typeof error === "string") {
    message = `❌ Ошибка: ${error}`;
  } else {
    message = `❌ Ошибка: ${JSON.stringify(error)}`;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  } catch (err) {
    console.error("❌ Не удалось отправить сообщение об ошибке:", err);
  }
}
