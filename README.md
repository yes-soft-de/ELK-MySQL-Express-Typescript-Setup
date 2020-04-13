# ElasticSearch-MySQL-Express-Typescript-Setup
ExpressJS Server Application Written in TypeScript with MySQL and ElasticSearch integration

## What are we trying to do

in this repository we are trying to explain how to integrate multiple data sources into a single server, using ExpressJS as our server, writing it in structured style, handling events to post to ElasticSearch (or Kafka for that matter), getting data when searching from ElasticSearch and when asking for a list from MySQL.

while the applications seems trivial and doesn't require all that much tech, this is an education POC project repository to explain a specific way to integrate the stack.

for this purposes we are writing a notes server. which have search in it.

## Explaining the Stack and the Technology

since the stack is rather long we are going to divide it into 2 separate layers. one for the server writing style and architecture and another for the integration.

## Technologies and Data Pipeline in the Project



### ExpressJS dependencies

to develop the application I will be using `yarn` as a package manger.

first we create the application, we included the dependencies needed bellow.

```json
{
    "dependencies": {
    "class-transformer": "0.2.3",
    "class-validator": "0.10.1",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "mysql2": "^2.1.0",
    "reflect-metadata": "^0.1.13",
    "routing-controllers": "^0.8.1-alpha.2",
    "typedi": "^0.8.0",
    "typeorm": "^0.2.24",
    "typeorm-typedi-extensions": "^0.2.3",
    "uuid": "^7.0.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.5",
    "@types/uuid": "^7.0.2",
    "ts-node": "^8.8.2",
    "typescript": "^3.8.3"
  }
}
```



Now we can create a Model using the format

```typescript
// filepath: src/api/models/notemodule.ts
@Entity()
export class NoteModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    writer: string;

    @Column()
    note: string;
}
```

and we can then create a repository fast and easy using

```typescript
// filepath: src/api/repositories/noterepository.ts
@EntityRepository(NoteModel)
export class NotesRepository extends Repository<NoteModel> {
}
```

we then consume this using a service, which for now is like this, but we will change that later, since it will dispatch creations for Elastic Search

```typescript
// filepath: src/api/services/noteservice.ts
@Service()
export class NotesService {
    constructor(
        @OrmRepository() private notesRepository: NotesRepository
    ){}
    async create(note: NoteModel): Promise<NoteModel> {
        console.log('Note Service Here');
        note.id = v1();
        // Save the Note to the MySQL Database
        const newNote = await this.notesRepository.save(note);
        // Dispatch Event to Insert into ElasticSearch
        // TODO: Create the Dispatch

        return newNote;
    }
    getAll(): Promise<NoteModel[]> {
        console.log('Note Service Here');
        return this.notesRepository.find();
    }
}
```

Ok, we only need a controller now, and here it is

```typescript
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
```

to test this I have created 2 scripts for `package.json` which will make this easier, and they are:

```json
{"start": "tsc && ts-node ./dist/app.js",
    "migration:make": "ts-node ./node_modules/typeorm/cli.js migration:generate -n PostRefactoring",
    "migration:exec": "ts-node ./node_modules/typeorm/cli.js migration:run"
}
```

Ok, create a schema in you database, create a migration, execute it and everything should be cool.



### Integrating Elastic Search

First we should implement an event dispatcher, to do that I used a code provided by w3tech in their old boilerplate, 



 