import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from 'src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { APP_GUARD } from '@nestjs/core';
import { IsAdmGuard } from 'src/common/guards/is-adm.guard';
import { simpleMiddleware } from 'src/common/middleware/simplemiddleware.middleware';
import { ConfigModule, ConfigType } from '@nestjs/config';

import appConfig from './app.config';

import * as Joi from 'joi'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (appConfigurations: ConfigType<typeof appConfig>) => ({
        type: appConfigurations.database.type,
        host: appConfigurations.database.host,
        port: appConfigurations.database.port,
        username: appConfigurations.database.username,
        database: appConfigurations.database.database,
        password: appConfigurations.database.password,
        autoLoadEntities: appConfigurations.database.autoLoadEntities, // Carrega entidades sem vc precisa especifica-las
        synchronize: appConfigurations.database.synchronize, // sincroniza com o banco de dados.
      }),
    }),
    BookModule,
    PersonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: IsAdmGuard
    // }
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
