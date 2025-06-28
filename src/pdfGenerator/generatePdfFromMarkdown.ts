// generatePdfFromMarkdown.ts
import PdfPrinter from "pdfmake";
import * as marked from "marked";
// import * as fsPromises from "fs/promises";
import * as fs from "fs";
import * as cheerio from "cheerio";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { downloadAndConvertToBase64 } from "./downloadAndConvertToBase64";
import { fonts } from "./fonts";
import { docDefinition } from "./docDefinition";
import { processInlineNodes } from "./processInlineNodes";
import { log, warn, error } from "./logger";
import { IMAGE_MAX_WIDTH, PAGE_MARGIN, PAGE_WIDTH } from "./constants";

/**
 * Generates PDF from Markdown text using intermediate HTML conversion with Cheerio.
 * Handles image downloading and embedding.
 * @param markdownContent Content in Markdown format.
 * @returns Promise<Buffer> The generated PDF as a Buffer
 */
export async function generatePdfFromMarkdown(
  markdownContent: string
): Promise<Buffer> {
  log("1. Converting Markdown to HTML...");
  const htmlFragment: string = await marked.parse(markdownContent);
  log("[DEBUG] HTML after Markdown parse:\n" + htmlFragment);

  log("2. Loading HTML fragment into Cheerio...");
  const $ = cheerio.load(htmlFragment);

  // Debug: log structure of first ordered list
  const firstOl = $("ol").first();
  if (firstOl.length) {
    log("[DEBUG] First <ol> HTML:\n" + firstOl.html());
  }

  log("3. Processing HTML elements and building PDF content...");
  const rootElements = $("body").children().get();

  for (const element of rootElements) {
    const $element = $(element);
    log(`[Root Element] Processing tag: ${element.name}`);

    switch (element.name) {
      case "h1":
        const h1Content = await processInlineNodes(
          $,
          element.children,
          docDefinition.content as Content[],
          (docDefinition.content as Content[]).length
        );
        if (h1Content.length > 0) {
          (docDefinition.content as Content[]).push({
            text: h1Content,
            style: "h1",
          });
          log(`[Root Element] Added H1.`);
        }
        break;
      case "h2":
        const h2Content = await processInlineNodes(
          $,
          element.children,
          docDefinition.content as Content[],
          (docDefinition.content as Content[]).length
        );
        if (h2Content.length > 0) {
          (docDefinition.content as Content[]).push({
            text: h2Content,
            style: "h2",
          });
          log(`[Root Element] Added H2.`);
        }
        break;
      case "h3":
        const h3Content = await processInlineNodes(
          $,
          element.children,
          docDefinition.content as Content[],
          (docDefinition.content as Content[]).length
        );
        if (h3Content.length > 0) {
          (docDefinition.content as Content[]).push({
            text: h3Content,
            style: "h3",
          });
          log(`[Root Element] Added H3.`);
        }
        break;
      case "p": {
        const pContent = await processInlineNodes(
          $,
          element.children,
          docDefinition.content as Content[],
          (docDefinition.content as Content[]).length
        );
        if (pContent.length > 0) {
          // Проверяем, есть ли картинки или блоки с картинками
          const hasImage = pContent.some(
            (item) =>
              typeof item === "object" &&
              ("image" in item ||
                ("stack" in item &&
                  Array.isArray(item.stack) &&
                  item.stack.some((el: any) => el.image)))
          );
          if (hasImage) {
            // Разбиваем на последовательные блоки: текст/картинка/текст...
            let buffer: Content[] = [];
            for (const item of pContent) {
              const anyItem = item as any;
              if (
                typeof anyItem === "object" &&
                (anyItem.image ||
                  (anyItem.stack &&
                    Array.isArray(anyItem.stack) &&
                    anyItem.stack.some((el: any) => el.image)))
              ) {
                if (buffer.length > 0) {
                  (docDefinition.content as Content[]).push({
                    text: buffer,
                    style: "paragraph",
                  });
                  buffer = [];
                }
                (docDefinition.content as Content[]).push(item);
              } else {
                buffer.push(item);
              }
            }
            if (buffer.length > 0) {
              (docDefinition.content as Content[]).push({
                text: buffer,
                style: "paragraph",
              });
            }
            log(`[Root Element] Added split paragraph with images.`);
          } else {
            (docDefinition.content as Content[]).push({
              text: pContent,
              style: "paragraph",
            });
            log(`[Root Element] Added paragraph.`);
          }
        }
        break;
      }
      case "ul":
      case "ol": {
        const listItems: Content[] = [];
        for (const liElement of $element.find("li").get()) {
          const liContent = await processInlineNodes(
            $,
            liElement.children,
            docDefinition.content as Content[],
            (docDefinition.content as Content[]).length
          );
          if (liContent.length > 0) {
            listItems.push({ stack: liContent, style: "listItemContent" });
          }
        }
        if (listItems.length > 0) {
          if (element.name === "ul") {
            (docDefinition.content as Content[]).push({ ul: listItems });
            log(
              `[Root Element] Added unordered list with ${listItems.length} items.`
            );
          } else {
            (docDefinition.content as Content[]).push({ ol: listItems });
            log(
              `[Root Element] Added ordered list with ${listItems.length} items.`
            );
          }
        }
        break;
      }
      case "hr":
        (docDefinition.content as Content[]).push({
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 5,
              x2: PAGE_WIDTH - 2 * PAGE_MARGIN,
              y2: 5,
              lineWidth: 1,
            },
          ],
          margin: [0, 10, 0, 10],
        });
        log(`[Root Element] Added horizontal rule.`);
        break;
      case "img": // If img is a root element, handle it directly
        const imageUrl = $element.attr("src");
        const imageAlt = $element.attr("alt");
        if (imageUrl) {
          log(`[Root Element] Found root image: ${imageUrl}`);
          const base64Image = await downloadAndConvertToBase64(imageUrl);
          if (base64Image) {
            const imageBlock: Content[] = [
              {
                image: base64Image.base64,
                width: IMAGE_MAX_WIDTH,
                alignment: "left",
              },
            ];
            if (imageAlt) {
              imageBlock.push({ text: imageAlt, style: "imageCaption" });
            }
            (docDefinition.content as Content[]).push({ stack: imageBlock });
            log(`[Root Element] Successfully added root image: ${imageUrl}`);
          } else {
            warn(
              `[Root Element] Could not add root image (base64 conversion failed): ${imageUrl}`
            );
          }
        } else {
          warn(`[Root Element] Root image tag found without 'src' attribute.`);
        }
        break;
      default:
        // For other root-level tags (e.g., if Markdown generates a div or span directly)
        // Process their children as inline content and add as a paragraph.
        if (element.children) {
          log(
            `[Root Element] Processing children of unknown root tag: ${element.name}`
          );
          const childrenContent = await processInlineNodes(
            $,
            element.children,
            docDefinition.content as Content[],
            (docDefinition.content as Content[]).length
          );
          if (childrenContent.length > 0) {
            let currentDefaultTextRun: Content[] = [];
            for (const item of childrenContent) {
              // This case should ideally not happen if images are handled as block-level earlier.
              // But as a fallback, if an image somehow gets here, treat it as a separate block.
              if ((item as any).image) {
                if (currentDefaultTextRun.length > 0) {
                  (docDefinition.content as Content[]).push({
                    text: currentDefaultTextRun,
                  });
                  currentDefaultTextRun = [];
                }
                (docDefinition.content as Content[]).push(item);
              } else {
                currentDefaultTextRun.push(item);
              }
            }
            if (currentDefaultTextRun.length > 0) {
              (docDefinition.content as Content[]).push({
                text: currentDefaultTextRun,
              });
            }
          }
        }
        break;
    }
  }

  log("5. Generating PDF...");
  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    pdfDoc.on("data", (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      log("PDF successfully generated as Buffer");
      resolve(pdfBuffer);
    });
    pdfDoc.on("error", (err) => {
      error("Error generating PDF:", err);
      reject(err);
    });
    pdfDoc.end();
  });
}
