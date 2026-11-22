
import multer from "multer";
import { randomUUID } from "crypto";
import fs from "fs";

export const multerLocal = ({
    customPath = "General",
    customTypes = []
} = {}) => {

    const pathFolder = `uploads/${customPath}`;

    if (!fs.existsSync(pathFolder)) {
        fs.mkdirSync(pathFolder, { recursive: true });
    }

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            console.log("file before", file);
            cb(null, pathFolder);
        },

        filename: (req, file, cb) => {
            cb(null, `${randomUUID()}_${file.originalname}`);
        }
    });

    function fileFilter(req, file, cb) {

        if (
            customTypes.length > 0 &&
            !customTypes.includes(file.mimetype)
        ) {
            return cb(new Error("Invalid file!"));
        }

        cb(null, true);
    }

    return multer({ storage, fileFilter });
};
