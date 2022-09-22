import express from "express"
import {graphqlHTTP} from "express-graphql"
import cors from "cors"
import {buildSchema} from "graphql"
import fileUpload from "express-fileupload"
import pg from "pg"
import path from "path"


//@ts-ignore
import {createDir} from "./services/fileService.ts"

const Pool = pg.Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'libnote',
    password: 'tankionline',
    port: 5432,
});

const schema = buildSchema(`
    type User {
        id: ID
        mail: String  
        password: String
    }
    
    type Note {
        id: ID
        title: String
        content: String
        datecreate: String
        dateupdate: String
    }
    
    input UserInput {
        id: ID
        mail: String!
        password: String!
    }
    
    input NoteInput {
        id: ID
        userid: ID!
        title: String!
        content: String!
        datecreate: String!
        dateupdate: String!
    }
    
    type Query {
        getAllUsers: [User]
        getUserById(id: ID): User
        getAllNotes(userid: ID): [Note]
    }
    
    type Mutation {
        createUser(input: UserInput): User
        createNote(input: NoteInput): Note
        deleteNoteById(noteid: ID): Note
    }

`)

const app = express()
app.use(cors())
app.use(fileUpload())

const root = {

    getAllUsers: async () => await pool.query('SELECT * FROM users')
             .then(res => res.rows)
    ,
    getUserById: async (params: any) => await pool.query('SELECT * FROM users WHERE id = ($1)'
            , [params.id])
            .then(res => res.rows[0])
    ,
    createUser: async (params: any) => await pool.query('INSERT INTO users (mail, password) VALUES ($1, $2) RETURNING *'
            , [params.mail, params.password])
            .then(res => res.rows[0])
    ,
    createNote: async ({input}: any) => await pool.query('INSERT INTO notes (userid, title, content, datecreate, dateupdate) VALUES ($1, $2, $3, $4, $5) RETURNING *'
            , [input.userid, input.title, input.content, input.datecreate, input.dateupdate])
            .then(res => res.rows[0])
    ,
    getAllNotes: async ({userid}: any) => await pool.query('SELECT * FROM notes WHERE userid = ($1) ORDER BY dateupdate DESC'
            , [+userid])
            .then(res => res.rows)
    ,
    deleteNoteById: async ({noteid}: any) => await pool.query('DELETE FROM notes WHERE id = ($1) RETURNING *'
        , [+noteid])
        .then(res => res.rows[0])


    }

app.post('/', function(req, res) {
    //@ts-ignore
    const file = req.files.file as UploadedFile
    console.log(file)
    createDir(file)
    file.mv(path.join('C:/Users/Admin/Desktop/libnote/files', file.name), function(err: any) {
        if (err) {
            console.log(err);
        }
    });



});

app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
        rootValue: root
    }
))

app.set('port', process.env.PORT || 3001)

const server = app.listen(app.get('port'), function() {
    console.log('listening');
});
