import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateEnvDto } from 'src/env/dto/create-env.dto';

const env = new CreateEnvDto();
@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host: env.DB_HOST,
        port: 5432,
        username: env.DB_USER,
        password: env.DB_PASS,
        database: env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}',__dirname + '/../**/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production
      })],
    controllers: [],
    providers: [],
    exports: []
})
export class TypeormModule {}
