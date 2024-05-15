import { FileValidator } from '@nestjs/common';

export interface CustomUploadFileCountValidatorOptions {
  maxCount: number;
}

export class CustomUploadFileCountValidator extends FileValidator {
  private readonly maxCount: number;

  constructor(protected readonly validationOptions: CustomUploadFileCountValidatorOptions) {
    super(validationOptions);
    this.maxCount = validationOptions.maxCount;
  }

  public isValid(files: any[]): boolean {
    console.log("in");
    console.log(files);
    return files && files.length <= this.maxCount
  }
  //return file && files.length <= this.maxCount;

  public buildErrorMessage(): string {
    return `Upload not allowed. Only ${this.maxCount} file can be uploaded at a time`;
  }
  
  
}
