import express from "express";
import bodyParser from "body-parser";
import invoiceRoutes from "./routes/invoice.js";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(projectRoot, 'public')));

app.use('/invoice', invoiceRoutes);

app.get("/", (req, res) => {
  res.sendFile(projectRoot + '\\public\\form.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
