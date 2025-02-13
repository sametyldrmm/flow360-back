import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn,JoinColumn, OneToOne } from "typeorm";
import { State } from '../../state/entities/state.entity';

@Entity()
export class User {
    
    @ApiProperty({type: Number, description: 'id'})
    @PrimaryGeneratedColumn()
    public id: number;
    
    @ApiProperty({type: String, description: 'Ad'})
    @Column()
    public name: string;

    @ApiProperty({type: String, description: 'Soyad'})
    @Column()
    public surname: string;

    @ApiProperty({type: String, description: 'Kullanıcı adı'})
    @Column({unique: true})
    public nickname: string;

    @ApiProperty({type: String, description: 'E-posta'})
    @Column({unique: true})
    public email: string;

    @ApiProperty({type: String, description: 'Telefon'})
    @Column()
    public tel: string;

    @ApiProperty({type: String, description: 'Şifre'})
    @Column()
    public password: string;

    @ApiProperty({type: String, description: 'TC Kimlik No'})
    @Column({unique: true})
    public tc: string;

    @ApiProperty({type: String, description: 'Doğum Tarihi'})
    @Column()
    public birthDate: string;

    @ApiProperty({type: String, description: 'Şehir'})
    @Column()
    public city: string;

    @ApiProperty({type: String, description: 'Rol'})
    @Column({default: 'user'})
    public role: string;

    @ApiProperty({type: Boolean, description: 'KVKK Onayı'})
    @Column()
    public kvkk: boolean;

    @ApiProperty({type: String, description: 'Sosyal Medya'})
    @Column({nullable: true})
    public socialMedia: string;

    @ApiProperty({type: String, description: 'YouTube Kanalı'})
    @Column({nullable: true})
    public youtube: string;

    @OneToOne(() => State, state => state.user, {cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: true})
    state: State;

    // Şifrelenecek alanları belirten metod
    encryptedFields() {
        return [
            'name',
            'surname',
            'email',
            'tel',
            'password',
            'tc',
            'birthDate',
            'city',
            'socialMedia',
            'youtube'
        ];
    }
}
