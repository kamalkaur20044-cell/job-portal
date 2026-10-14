import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Must use require() so dotenv runs BEFORE ES module imports are evaluated
require("dotenv").config({ path: join(__dirname, "config", "config.env") });

const { default: app } = await import("./app.js");
const { default: cloudinary } = await import("cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
