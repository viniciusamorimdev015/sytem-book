import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    PersonModule
  ],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
