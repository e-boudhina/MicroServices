import { Request } from 'express';
import * as path from 'path';
import { FileValidator } from '@nestjs/common';

export interface ImageFilterOptions {
  allowedExtensions: string[];
}

export class ImageFilter extends FileValidator {
  private readonly allowedExtensions: string[];

  constructor(protected readonly validationOptions: ImageFilterOptions) {
    super(validationOptions);
    this.allowedExtensions = validationOptions.allowedExtensions;
  }

  public isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }
    const ext = path.extname(file.originalname).toLowerCase();
    return this.allowedExtensions.includes(ext);
  }

  public buildErrorMessage(): string {
    return `Only files with extensions ${this.allowedExtensions.join(', ')} are allowed`;
  }
}
export const imageFilterFactory = (imageFilter: ImageFilter): (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void => {
  return (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (imageFilter.isValid(file)) {
      callback(null, true);
    } else {
      const error = new Error(imageFilter.buildErrorMessage());
      (error as any).statusCode = 422; // Unprocessable Entity
      callback(error, false);
    }
  };
};

/*import { Request } from 'express';
import * as path from 'path';

export const imageFilter = (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
  // Check if the file type is an image
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    callback(null, true); // Accept the file
  } else {
    const error = new Error('Only image files are allowed');
    // Set a custom property to the error object to handle it in the controller
    (error as any).statusCode = 422; // Unprocessable Entity status code
    callback(error, false); // Reject the file
  }
};
*/