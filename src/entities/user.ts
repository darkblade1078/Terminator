import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class User {

    @PrimaryColumn({
        nullable: false,
    })
    discordId: string;

    @Column({
        nullable: false,
    })
    nationId: number;

    @Column({
        nullable: false,
    })
    verificationToken: string;

    @Column({
        nullable: false,
        default: false,
    })
    verified: boolean;
}