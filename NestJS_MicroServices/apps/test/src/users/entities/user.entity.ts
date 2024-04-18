import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";

//import { OrderMission } from "../../order-mission/entities/order-mission.entity";
@Entity({ name: 'users' })
//If you have 2 unique colums that must not be repeated use this one (use the @Colum annotation when you want field the be unique seprately but not Combined)
//@Unique(['email']) 
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

    //What does this means
    constructor(User: Partial<User>){
        Object.assign(this, User);
    }
    
}
