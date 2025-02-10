import * as dotenv from 'dotenv';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

dotenv.config({ path: "./src/.env" });


export class CreateEnvDto {
    @ApiProperty({"example": "localhost"})
    public DB_HOST: string;
    @ApiProperty()
    public DB_PORT: string;
    @ApiProperty()
    public DB_USER: string;
    @ApiProperty()
    public DB_PASS: string;
    @ApiProperty({
        example: '1234578910',
        required: true
     })
    public DB_NAME: string;    
    
    constructor() {
        dotenv.config();
        this.DB_HOST = process.env.DB_HOST;
        this.DB_PORT = process.env.DB_PORT;
        this.DB_USER = process.env.DB_USERNAME;
        this.DB_PASS = process.env.DB_PASSWORD;
        this.DB_NAME = process.env.DB_DATABASE;
    }
}



