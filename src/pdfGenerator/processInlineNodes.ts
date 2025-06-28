// processInlineNodes.ts
import { Content } from "pdfmake/interfaces";
import { log, warn } from "./logger";
import { downloadAndConvertToBase64 } from "./downloadAndConvertToBase64";
import { IMAGE_MAX_WIDTH } from "./constants";

/**
 * Helper function for processing Cheerio child nodes
 * and converting them to an array of *inline* pdfmake Content objects (text, bold, links, images, etc.)
 * This function does NOT handle block-level elements like <p>, <ul>, <img> directly.
 * @param elements Cheerio elements to process.
 * @param docContent The docDefinition.content array to insert images into.
 * @param insertIndex The index in docContent after which to insert images.
 * @returns A Promise that resolves to an array of pdfmake Content objects suitable for a 'text' run.
 */
export const processInlineNodes = async (
  $,
  // @ts-expect-error
  elements: cheerio.Element[],
  docContent: Content[],
  insertIndex: number
): Promise<Content[]> => {
  const inlineContent: Content[] = [];

  for (const element of elements) {
    const $element = $(element);

    if (element.type === "text") {
      const text = element.data || "";
      if (text.length > 0) {
        inlineContent.push({ text });
      }
    } else if (element.type === "tag") {
      switch (element.name) {
        case "strong": {
          const strongChildren = await processInlineNodes(
            $,
            element.children,
            docContent,
            insertIndex
          );
          if (strongChildren.length > 0) {
            for (const child of strongChildren) {
              inlineContent.push({
                ...(typeof child === "object" ? child : { text: child }),
                bold: true,
              });
            }
          }
          break;
        }
        case "a": {
          const linkChildren = await processInlineNodes(
            $,
            element.children,
            docContent,
            insertIndex
          );
          const href = $element.attr("href");
          if (
            href &&
            linkChildren.some(
              (c) => (c as any).text && (c as any).text.length > 0
            )
          ) {
            const linkObject = {
              text: linkChildren,
              link: href,
              style: "link",
            };
            inlineContent.push(linkObject);
            log(`[Inline Node] Added link: ${JSON.stringify(linkObject)}`);
          } else {
            inlineContent.push(...linkChildren);
            warn(
              `[Inline Node] Skipped link due to missing href or empty text: href="${href}", text="${JSON.stringify(
                linkChildren
              )}"`
            );
          }
          break;
        }
        case "br":
          inlineContent.push({ text: "\n" });
          break;
        case "img": {
          const src = $element.attr("src");
          const alt = $element.attr("alt");
          if (src) {
            const base64Image = await downloadAndConvertToBase64(src);
            if (base64Image) {
              const imageBlock: Content[] = [
                {
                  image: base64Image.base64,
                  width: IMAGE_MAX_WIDTH,
                  alignment: "left",
                },
              ];
              if (alt) {
                imageBlock.push({ text: alt, style: "imageCaption" });
              }
              inlineContent.push({ stack: imageBlock });
            }
          }
          break;
        }
        default:
          if (element.children) {
            inlineContent.push(
              ...(await processInlineNodes(
                $,
                element.children,
                docContent,
                insertIndex
              ))
            );
          }
          break;
      }
    }
  }
  return inlineContent;
};
