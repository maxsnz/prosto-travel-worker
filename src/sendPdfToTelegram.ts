import FormData from "form-data";
import dotenv from "dotenv";
import { request } from "undici";
dotenv.config();

export async function sendPdfToTelegram(chatId: number, pdfBuffer: Buffer) {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    console.error("TELEGRAM_TOKEN not set");
    return;
  }

  const form = new FormData();
  form.append("chat_id", chatId.toString());
  form.append("document", pdfBuffer, {
    filename: "guide.pdf",
    contentType: "application/pdf",
  });

  const res = await request(
    `https://api.telegram.org/bot${token}/sendDocument`,
    {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    }
  );

  const { statusCode, body } = res;

  if (statusCode >= 400) {
    const text = await body.text();
    throw new Error(`Telegram API error: ${statusCode} - ${text}`);
  }
}
