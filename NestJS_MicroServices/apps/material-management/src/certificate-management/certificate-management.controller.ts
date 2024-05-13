// certificate-management.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificateManagementService } from './certificate-management.service';
import { CreateCertificateManagementDto } from './dto/create-certificate-management.dto';

@Controller('certificate-management')
export class CertificateManagementController {
  constructor(
    private readonly certificateService: CertificateManagementService,
  ) {}

  @Post()
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

  @Delete(':id')
  async removeCertificate(@Param('id') id: number): Promise<void> {
    await this.certificateService.removeCertificate(id);
  }

  @Get(':id')
  async getCertificate(@Param('id') id: number) {
    return this.certificateService.getCertificate(id);
  }

  @Get()
  async getAllCertificates() {
    return this.certificateService.getAllCertificates();
  }

  @Put(':id')
  async updateCertificate(
    @Param('id') id: number,
    @Body() newData: any,
  ): Promise<void> {
    await this.certificateService.updateCertificate(id, newData);
  }
}
