import "reflect-metadata";
import { createExpressServer } from 'routing-controllers';
import { NotesController } from "./api/controllers/NotesController";
import { Container } from "typedi";
import { createConnection, useContainer } from "typeorm";
import { env } from './env';
import { NoteModel } from './api/models/NoteModel';

const server = createExpressServer({
    cors: true,
    controllers: env.app.dirs.controllers,
});

useContainer(Container);
createConnection({
    "name": "default",
    "type": "mysql",
    "host": env.app.host,
    "port": env.db.port,
    "username": env.db.username,
    "password": env.db.password,
    "database": env.db.database,
    "entities": env.app.dirs.entities
});

server.listen(env.app.port, () => {
    console.log(`Server is Running on Port ${env.app.port}`);
});