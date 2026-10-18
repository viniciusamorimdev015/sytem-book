import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors, UsePipes } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { addHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { changeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';

@Controller('book')
@UsePipes(ParseIntIdPipe)
export class BookController {

    constructor( private readonly bookService: BookService ) {}

    @Get(':id')
    FindOne(@Param('id') id: number) {
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
    update(@Param('id') id: number, @Body()updateBookDto: UpdateBookDto) {
        return this.bookService.update(id, updateBookDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.bookService.remove(id)
    }
}