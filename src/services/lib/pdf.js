import PdfPrinter from "pdfmake";

// Define font files
const fonts = {
  Roboto: {
    normal: "Verdana",
    bold: "Verdana-Bold",
    italics: "Verdana-Italic",
    bolditalics: "Verdana-MediumItalic",
  },
};

//   const PdfPrinter = require('pdfmake');
export const getPDFStream = () => {
  const printer = new PdfPrinter(fonts);
  //   const fs = require('fs');

  const docDefinition = {
    content: ["hello world"],
  };
  console.log(docDefinition);
  const options = {};

  const pdfReadStream = printer.createPdfKitDocument(docDefinition, options);
  //   pdfReadStream.pipe(fs.createWriteStream('document.pdf'));
  pdfReadStream.end();
  return pdfReadStream;
};
