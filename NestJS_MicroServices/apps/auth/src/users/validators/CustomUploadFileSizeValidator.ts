import { FileValidator } from '@nestjs/common';

export interface CustomUploadFileSizeValidatorOptions {
  maxSize: number;
}

export class CustomUploadFileSizeValidator extends FileValidator {
  private readonly maxSize: number;

  constructor(protected readonly validationOptions: CustomUploadFileSizeValidatorOptions) {
    super(validationOptions);
    this.maxSize = validationOptions.maxSize;
  }

  public isValid(file?: any): boolean {
    if (!(file && file.size <= this.maxSize)) {
      throw new Error(this.buildErrorMessage());
    }
    return true;
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Maximum file size is ${this.convertBytesToMegabytes(this.maxSize)} MB`;
  }

  private convertBytesToMegabytes(bytes: number): number {
    return bytes / (1024 * 1024);
  }
}