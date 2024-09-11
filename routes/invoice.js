import express from "express";
import puppeteer from "puppeteer";
import fs from "fs";
import path, {dirname, join} from "path";
import {fileURLToPath} from "url";
import Handlebars from "handlebars";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const __filename = dirname(fileURLToPath(import.meta.url));
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname);


router.post('/generate', async (req, res) => {
  try {
    const invoiceData = req.body;
    const templatePath = projectRoot + '\\templates\\invoice-template.hbs';
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(invoiceData);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

        const uniqueFileName = `invoice-${Date.now()}-${uuidv4()}.pdf`;
        const pdfPath = path.join(__dirname + `\\public\\${uniqueFileName}`);

    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    res.status(200).send("<h2>Invoice generated successfully.").redirect('/');
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Error generating invoice', error: error.toString() });
  }
});


export default router;
