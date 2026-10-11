import { IsEmail } from "class-validator";
import { BookEntity } from "src/book/entities/book.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('person')
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ length: 255 })
    passwordHash: string;

    @Column({
        length: 100
    })
    name: string;

    @OneToMany(() => BookEntity, (book) => book.person)
    books: BookEntity[]

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;



}
