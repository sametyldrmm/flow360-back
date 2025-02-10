import { ApiProperty } from "@nestjs/swagger";
//import { Card } from "src/card/entities/card.entity";
//import { Stok } from "src/stok/entities/stok.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn,JoinColumn  } from "typeorm";

@Entity()
export class User {
    
    @ApiProperty({type: Number, description: 'id'})
    @PrimaryGeneratedColumn()
    public id: number;
    
    @ApiProperty({type: String, description: 'username'})
    @Column()
    public username: string;

    @ApiProperty({type: String, description: 'password'})
    @Column()
    public password: string;

}
