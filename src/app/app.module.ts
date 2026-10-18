import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from 'src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { APP_GUARD } from '@nestjs/core';
import { IsAdmGuard } from 'src/common/guards/is-adm.guard';
import { simpleMiddleware } from 'src/common/middleware/simplemiddleware.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '12345',
      autoLoadEntities: true, // Carrega entidades sem vc precisa especifica-las
      synchronize: true // sincroniza com o banco de dados.

    }),
    BookModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: IsAdmGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  consumer.apply(simpleMiddleware).forRoutes({
    path: '{*splat}',
    method: RequestMethod.ALL
  })    
  }
}
