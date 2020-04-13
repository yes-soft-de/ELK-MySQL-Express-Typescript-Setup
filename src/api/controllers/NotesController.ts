import { JsonController, Post, Body, Get } from "routing-controllers";
import { NoteModel } from "../models/NoteModel";
import { Container, Inject } from "typedi";
import { NotesService } from "../services/NotesService";

@JsonController('/notes')
export class NotesController {
    @Inject()
    private notesService = Container.get(NotesService);
    
    @Post()
    public create(@Body() body: any) {
        const note = new NoteModel;
        note.writer = body.writer;
        note.note = body.note;

        return this.notesService.create(note);
    }
    @Get()
    public getAll() {
        return this.notesService.getAll();
    }
}