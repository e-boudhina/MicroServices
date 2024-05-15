import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import * as path from 'path';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  constructor(private readonly allowedExtensions: string[], private readonly maxSize: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const upload = multer({
      storage: multer.diskStorage({}),
      fileFilter: (req, file, callback) => this.fileFilter(req, file, callback)
    }).single('file');

    return new Observable(observer => {
      upload(context.switchToHttp().getRequest(), context.switchToHttp().getResponse(), err => {
        if (err) {
          return observer.error(err);
        }
        observer.next();
        observer.complete();
      });
    });
  }

  private fileFilter(req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = this.allowedExtensions.includes(ext);

    // Check file size
    const maxSizeInBytes = this.maxSize * 1024 * 1024; // Convert MB to bytes
    const sizeValid = file.size <= maxSizeInBytes;

    if (allowed && sizeValid) {
      callback(null, true);
    } else {
      const errorMessage = !allowed ? 'Only image files are allowed.' : `File size should be less than ${this.maxSize} MB.`;
      callback(new HttpException(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY), false);
    }
  }
}
