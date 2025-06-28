import PDFDocument from "pdfkit";
// TODO pdfmake

export async function generatePDF({ city, days, guide }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("Ваш персональный гид", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Город: ${city.name}`);
    doc.text(`Длительность: ${days} дней`);
    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Здесь будет гайд, подобранный специально под ваш маршрут...`);

    doc.end();
  });
}
