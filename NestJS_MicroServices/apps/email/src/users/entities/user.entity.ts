import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";


//import { OrderMission } from "../../order-mission/entities/order-mission.entity";
@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    username: string;

    //@IsEmail()
    @Column()
    //managed in controller
    @Column({unique: true}) 
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    hashedRt?: string; // Use '?' to indicate optional property

    @Column({ nullable: true })
    passwordResetToken: string; 

    @Column({ nullable: true })
    resetPasswordExpirationToken: Date;
    
}
