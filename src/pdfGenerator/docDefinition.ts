// docDefinition.ts
import { TDocumentDefinitions } from "pdfmake/interfaces";

export const docDefinition: TDocumentDefinitions = {
  content: [],
  styles: {
    h1: {
      fontSize: 24,
      bold: true,
      margin: [0, 30, 0, 5],
    },
    h2: {
      fontSize: 18,
      bold: true,
      margin: [0, 20, 0, 5],
    },
    h3: {
      fontSize: 14,
      bold: true,
      margin: [0, 11, 0, 4],
    },
    paragraph: {
      margin: [0, 10, 0, 5],
    },
    link: {
      color: "blue",
      decoration: "underline",
    },
    imageCaption: {
      fontSize: 9,
      color: "#888888",
      alignment: "left",
      margin: [0, 2, 0, 10],
    },
    listItemContent: {
      marginBottom: 10, // Add margin to the bottom of each list item's content stack
    },
  },
};
