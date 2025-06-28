import path from "path";
import { fileURLToPath } from "url";
import { TFontDictionary } from "pdfmake/interfaces";

// --- Derive __dirname equivalent for ES Modules ---
const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const fonts: TFontDictionary = {
  Roboto: {
    normal: path.join(currentDir, "../fonts", "Roboto-Regular.ttf"),
    bold: path.join(currentDir, "../fonts", "Roboto-Medium.ttf"),
    italics: path.join(currentDir, "../fonts", "Roboto-Italic.ttf"),
    bolditalics: path.join(currentDir, "../fonts", "Roboto-MediumItalic.ttf"),
  },
};
