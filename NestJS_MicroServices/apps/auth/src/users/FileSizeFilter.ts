import { Request } from 'express';
import { FileValidator } from '@nestjs/common';

export interface FileSizeFilterOptions {
  maxSize: number;
}

export class FileSizeFilter extends FileValidator {
  private readonly maxSize: number;

  constructor(protected readonly validationOptions: FileSizeFilterOptions) {
    super(validationOptions);
    this.maxSize = validationOptions.maxSize;
  }

  public isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }
    return file.size <= this.maxSize;
  }

  public buildErrorMessage(): string {
    return `File size exceeds the maximum limit of ${this.maxSize} bytes`;
  }
}
