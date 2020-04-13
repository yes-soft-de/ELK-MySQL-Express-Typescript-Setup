import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import { NotesRepository } from '../repositories/NotesRepository';
import { NoteModel } from '../models/NoteModel';
import {v1} from 'uuid';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { events } from '../../api/subscribers/events';
import { ElasticRepository } from '../repositories/ElasticRepository';

@Service()
export class NotesService {
    constructor(
        @OrmRepository() private notesRepository: NotesRepository,
        @Service() private elasticRepository: ElasticRepository
    ){}

    async create(note: NoteModel): Promise<NoteModel> {
        note.id = v1();

        // Save the Note to the MySQL Database
        const newNote = await this.notesRepository.save(note);

        // Dispatch Event to Insert into ElasticSearch
        this.elasticRepository.dispatchToElasticSearch(events.note.created, newNote);

        return newNote;
    }
    getAll(): Promise<NoteModel[]> {
        return this.notesRepository.find();
    }
}