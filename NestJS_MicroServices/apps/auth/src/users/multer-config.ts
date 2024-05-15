import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';


export const multerConfig: MulterModuleOptions = {
    storage: diskStorage({
      //make the path a .env variable and ensure that after you create the dist file all is in order
      destination: './upload',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filename = path.basename(file.originalname, extension);
        callback(null, `${filename}-${uniqueSuffix}${extension}`);
      },
    }),
   
    //limits: {
      //files: MAX_PROFILE_PICTURE_UPLOAD_COUNT, // Adjust as needed
    //},
  };