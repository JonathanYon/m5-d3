import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
        `${data.category} is the the category!`,
      ],
    };
    console.log("docDefinition", docDefinition);
    const options = {};

    const pdfReadStream = printer.createPdfKitDocument(docDefinition, options);
    //   pdfReadStream.pipe(fs.createWriteStream('document.pdf'));
    pdfReadStream.end();
    return pdfReadStream;
  } catch (error) {
    console.log(error);
  }
};

export const generatePDF = async (data) => {
  try {
    const asyncPipeline = promisify(pipeline);
    const printer = new PdfPrinter(fonts);
    const docDefnition = {
      content: [`hello world ${data.greeting}`],
    };
    const options = {};
    const pdfReadStream = printer.createPdfKitDocument(docDefnition, options);
    pdfReadStream.end();
    const path = join(dirname(fileURLToPath(import.meta.url)), "test.pdf");
    await asyncPipeline(pdfReadStream, fs.createWriteStream(path));
    return path;
  } catch (error) {
    console.log(error);
  }
};
