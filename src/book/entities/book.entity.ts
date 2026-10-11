import { Person } from "src/person/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('book')
export class BookEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    genre: string;
    
    @Column()
    rating: string;

    @Column()
    status: string;

    @ManyToOne(() => Person, (person) => person.books, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'personId' })
    person: Person;

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

}