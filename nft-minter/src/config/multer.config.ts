import { HttpException, HttpStatus } from "@nestjs/common";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";
require('dotenv').config();

// Multer configuration
export const multerConfig = {
    dest: process.env.CACHE_DIR,
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    limits: {
        fileSize: 1000000,
    },

    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        const fileSize = parseInt(req.headers["content-length"]);
        
        if (fileSize >= 1000000){
            cb(null, true);
        }
        else if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
        }
        else if(file.mimetype == "text/plain" && fileSize <= 1509){ //1024 + 481 bytes = 1kb
            // Allow storage of file
            cb(null, true);
        }
        else if(file.mimetype == "text/plain" && fileSize >= 1509){ //1024 + 481 bytes = 1kb
            // IF file type is text and over 1kb
            cb(new HttpException(`Text file should be around 1kb`, HttpStatus.BAD_REQUEST), false);
        }
        else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },

    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.dest;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },

        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            // cb(null, `${randomUUID()}${extname(file.originalname)}`);
            cb(null, `${file.originalname}`);
        },
    }),
};