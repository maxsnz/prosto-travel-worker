import { markup } from "./_markup";
import { askGPT } from "./askGPT";
import { getCity } from "./city";
import { generatePdfFromMarkdown } from "./pdfGenerator/generatePdfFromMarkdown";
import { getPlaces } from "./places";
import { saveToFile } from "./saveToFile";
import { sendError } from "./sendError";
import { sendPdfToTelegram } from "./sendPdfToTelegram";

export async function generateGuide({ chatId, cityId, days }) {
  try {
    const city = await getCity(cityId);
    const guide = await askGPT({ city, days });

    const filepath = `tmp/${Date.now()}.txt`;
    await saveToFile(guide, filepath);

    generatePdfFromMarkdown(guide)
      .then((pdfBuffer) => {
        return sendPdfToTelegram(chatId, pdfBuffer);
      })
      .catch((err) => {
        console.error("❌ Error generating/sending guide:", err);
      });

    // generatePDF({ city, days, guide })
  } catch (err) {
    console.error("❌ Error getting places:", err);
    sendError(chatId, err);
  }
}
