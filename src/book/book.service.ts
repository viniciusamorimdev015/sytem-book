import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';


const BOOK_SELECT = {
    id: true,
    title: true,
    author: true,
    genre: true,
    rating: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    person: { id: true, name: true, email: false },
};

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
        private readonly personService: PersonService
    ) { }

    books: BookEntity[] = []


    //CRIA UM LIVRO NOVO
    async create(createBookDto: CreateBookDto) {

        const { personId, ...bookData } = createBookDto;

        const person = await this.personService.findOne(personId)

        const newBook = {
            ...bookData,
            person: person
        }

        const book = await this.bookRepository.create(newBook)

        return this.bookRepository.save(book)
    }

    //BUSCA TODOS OS LIVROS NA BASE DE DADOS
    async findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0 } = paginationDto

        // const books = await this.bookRepository.find();
        // return books;

        return this.bookRepository.find({
            take: limit, // quantos registros serao exibidos por paginas
            skip: offset, // quantos registros devem ser pulados
            relations: { person: true },
            select: BOOK_SELECT
        })
    }

    //BUSCA UM LIVO ESPECIFICO PELO ID 
    async findOne(id: number) {
        const book = await this.bookRepository.findOne({
            where: {id},
            relations: { person: true },
            select: BOOK_SELECT
        });

        if (book) return book;

        throw new NotFoundException(`Livro com ID ${id} não encontrado`);

    }

    //ATUALIZA INFORMAÇÕES DE UM LIVRO
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

    //APAGA UM LIVRO DO BANCO DE DADOS
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
