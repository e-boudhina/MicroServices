// vehicle.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity({ name: "vehicle" })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nbPlate: string;

  @Column()
  brand: string;

  @Column()
  type: string;

  @Column()
  energy: string;

  @Column()
  indexKm: number;
  constructor(Vehicle: Partial<Vehicle>) {
    Object.assign(this, Vehicle);
  }
}
