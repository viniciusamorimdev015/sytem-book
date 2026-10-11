import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('book')
export class BookController {

    constructor( private readonly bookService: BookService ) {}

    @Get(':id')
    FindOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.findOne(id);
    }   

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.bookService.findAll(paginationDto);
    }

    @Post()
    create(
        @Body() createBookDto: CreateBookDto,
    ) {
        return this.bookService.create(createBookDto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body()updateBookDto: UpdateBookDto) {
        return this.bookService.update(id, updateBookDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.remove(id)
    }
}