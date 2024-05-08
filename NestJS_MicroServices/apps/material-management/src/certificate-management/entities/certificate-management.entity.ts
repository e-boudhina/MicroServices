// certificate-management.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CertificateManagement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  username: string;

  @Column()
  cinNumber: string;

  @Column()
  additionalInfo: string;

  @Column()
  position: string;

  @Column()
  status: string;
}
