const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.fieldname.includes("image")) {
      const folderPath = "./public/uploads/user-image";
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      callback(null, folderPath);
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_"));
  },
});


module.exports = multer({
  storage: Storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("image");
