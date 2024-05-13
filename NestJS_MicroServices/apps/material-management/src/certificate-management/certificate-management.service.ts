// certificate-management.service.ts
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificateManagement } from './entities/certificate-management.entity';

const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class CertificateManagementService {
  constructor(
    @InjectRepository(CertificateManagement)
    private readonly certificateRepository: Repository<CertificateManagement>,
  ) {}

  async generateCertificate(data: any): Promise<Buffer> {
    // Save input data to the database
    const certificate = await this.certificateRepository.save(data); // Assuming data matches the structure of CertificateManagement entity

    // Generate PDF
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // Customize your PDF document
      doc.text(`Start Date: ${data.startDate}`, 100, 50);
      doc.text(`End Date: ${data.endDate}`, 100, 70);
      doc.text(`Username: ${data.username}`, 100, 90);
      doc.text(`CIN Number: ${data.cinNumber}`, 100, 110);
      doc.text(`Additional Info: ${data.additionalInfo}`, 100, 130);
      doc.text(`Position: ${data.position}`, 100, 150);
      doc.text(`Status: ${data.status}`, 100, 170);

      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    // Write PDF to local folder
    const folderPath = './MicroServices/uploads/pdfFiles'; // Modify the path here
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = `${folderPath}/certificate_${certificate.id}.pdf`;
    await writeFileAsync(filePath, pdfBuffer);

    return pdfBuffer; // Return the PDF buffer
  }

  async removeCertificate(id: number): Promise<void> {
    // Remove entry from the database
    await this.certificateRepository.delete(id);

    // Delete associated PDF file from local folder
    const folderPath = 'C:/Users/DELL/Desktop/pdfFiles'; // Modify the path here
    const filePath = `${folderPath}/certificate_${id}.pdf`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getCertificate(id: number): Promise<CertificateManagement> {
    return this.certificateRepository.findOne({ where: { id } });
  }

  async getAllCertificates(): Promise<CertificateManagement[]> {
    return this.certificateRepository.find();
  }

  async updateCertificate(id: number, newData: any): Promise<void> {
    // Update entry in the database
    await this.certificateRepository.update(id, newData);

    // Generate new PDF
    await this.generateCertificate(newData);

    // Delete old PDF
    const folderPath = 'C:/Users/DELL/Desktop/pdfFiles'; // Modify the path here
    const oldFilePath = `${folderPath}/certificate_${id}.pdf`;
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }
}
