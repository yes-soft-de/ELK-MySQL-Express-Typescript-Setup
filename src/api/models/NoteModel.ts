import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class NoteModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    writer: string;

    @Column()
    note: string;
}
