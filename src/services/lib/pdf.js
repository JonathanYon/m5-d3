import PdfPrinter from "pdfmake";

// Define font files

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

//   const PdfPrinter = require('pdfmake');
export const getPDFStream = (data) => {
  try {
    const printer = new PdfPrinter(fonts);
    //   const fs = require('fs');

    const docDefinition = {
      content: [
        // {
        //   image: `${data.avatar}`,
        // },
        `${data.category} is the the category`,
      ],
    };
    console.log(docDefinition);
    const options = {};

    const pdfReadStream = printer.createPdfKitDocument(docDefinition, options);
    //   pdfReadStream.pipe(fs.createWriteStream('document.pdf'));
    pdfReadStream.end();
    return pdfReadStream;
  } catch (error) {
    console.log(error);
  }
};
