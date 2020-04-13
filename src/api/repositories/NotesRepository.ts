import { Repository, EntityRepository } from "typeorm";
import { NoteModel } from "../models/NoteModel";

@EntityRepository(NoteModel)
export class NotesRepository extends Repository<NoteModel> {
}