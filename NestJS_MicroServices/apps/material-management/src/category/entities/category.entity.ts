import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Material } from '../../entities/material.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Material, (material) => material.category)
  materials: Material[];

  // Autres attributs de la catégorie
}
