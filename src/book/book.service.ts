import { Injectable, NotFoundException } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>
    ) { }

    books: BookEntity[] = []

    async create(createBookDto: CreateBookDto) {
        const newBook = {
            ...createBookDto
        }

        const book = await this.bookRepository.create(newBook)

        return this.bookRepository.save(book)
    }

    async findAll() {
        const books = await this.bookRepository.find();
        return books;
    }

    async findOne(id: number) {
        const book = await this.bookRepository.findOne({
            where: {
                id,
            },
        });

        if (book) return book;

        throw new NotFoundException(`Livro com ID ${id} não encontrado`);

    }

    async update(id: number, updateBookDto: UpdateBookDto) {
        
        const book = await this.bookRepository.preload({
            id,
            ...updateBookDto
        });

        if(!book) {
            throw new NotFoundException(`Livro com ID ${id} não foi encontrado`)
        }

        return this.bookRepository.save(book)
    }

    async remove(id: number) {

        const book = await this.bookRepository.findOneBy({
            id,
        });

        if (!book) {
            throw new NotFoundException(`Livro com o ID ${id} não foi encontrado.`);
        }

        return this.bookRepository.remove(book);

    }

}
