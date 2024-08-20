import {
  // ErrorInterceptor,
  // IsAuth,
  formatError,
  validationSchema,
} from '@/common';
import { SharedModule } from '@/shared/shared.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { IssueModule } from './issue/issue.module';
import { ProjectModule } from './project/project.module';
import { CommentModule } from './comment/comment.module';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigService } from '@/shared/services';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        type: 'postgres',
        url: apiConfigService.dbUrl,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema,
      // validationOptions: {
      //   allowUnknown: false,
      //   abortEarly: false,
      // },
    }),
    UserModule,
    IssueModule,
    ProjectModule,
    CommentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError,
      // buildSchemaOptions: {
      //   fieldMiddleware: [IsAuth, ErrorInterceptor],
      // },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
