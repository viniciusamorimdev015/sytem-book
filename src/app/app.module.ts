import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from 'src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { APP_GUARD } from '@nestjs/core';
import { IsAdmGuard } from 'src/common/guards/is-adm.guard';
import { simpleMiddleware } from 'src/common/middleware/simplemiddleware.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from './app.config';

import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.string().valid('postgres').required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_DATABASE: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_AUTOLOADENTITIES: Joi.boolean().required(),
        DATABASE_SYNCHRONIZE: Joi.boolean().required(),
      }), 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        database: configService.get<string>('database.database'),
        password: configService.get<string>('database.password'),
        autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'), // Carrega entidades sem vc precisa especifica-las
        synchronize: configService.get<boolean>('database.synchronize'), // sincroniza com o banco de dados.
      }),
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
