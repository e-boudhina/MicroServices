import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificateManagementService } from './certificate-management.service';
import { CreateCertificateManagementDto } from './dto/create-certificate-management.dto';
import { CertificateManagement } from './entities/certificate-management.entity';

@Controller('certificate-management')
export class CertificateManagementController {
  constructor(
    private readonly certificateService: CertificateManagementService,
  ) {}

  @Post('/generate-certificate')
  async generateCertificate(
    @Body() data: CreateCertificateManagementDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.certificateService.generateCertificate(data);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="certificate.pdf"',
      'Content-Length': pdfBuffer.length.toString(),
    });
    res.send(pdfBuffer);
  }

  @Get('/:id')
  async getCertificate(
    @Param('id') id: number,
  ): Promise<CertificateManagement> {
    const certificate = await this.certificateService.getCertificate(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return certificate;
  }

  @Get()
  async getAllCertificates(): Promise<CertificateManagement[]> {
    return this.certificateService.getAllCertificates();
  }

  @Get('/pdfs')
  async getAllPDFs(@Res() res: Response): Promise<void> {
    const pdfs = await this.certificateService.getAllPDFs();
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="pdfFiles.zip"',
    });
    //res.zip(pdfs); // Assuming you have a method to zip the PDF files
  }

  @Put('/:id')
  async updateCertificate(
    @Param('id') id: number,
    @Body() newData: any,
  ): Promise<void> {
    await this.certificateService.updateCertificate(id, newData);
  }

  @Delete('/:id')
  async removeCertificate(@Param('id') id: number): Promise<void> {
    await this.certificateService.removeCertificate(id);
  }
}
