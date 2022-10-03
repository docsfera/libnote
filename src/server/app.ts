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
    type Book{
        id: ID
        name: String
        image: String
    }
    type Folder{
        id: ID
        name: String
        countofnotes: Int
    }
    
    type Note {
        id: ID
        title: String
        folderid: ID
        bookid: ID
        content: String
        datecreate: String
        dateupdate: String
    }
    
    input UserInput {
        id: ID
        mail: String!
        password: String!
    }
    input FolderInput{
        id: ID
        name: String!
        userid: ID!
        countofnotes: Int!
    }
    input BookInput{
        id: ID
        name: String!
        image: String!
        userid: ID!
    }
    
    input NoteInput {
        id: ID
        userid: ID!
        bookid: ID
        folderid: ID
        title: String!
        content: String!
        datecreate: String!
        dateupdate: String!
    }
    
    type Query {
        getAllUsers: [User]
        getUserById(id: ID): User
        getAllNotes(userid: ID): [Note]
        getAllFolders(userid: ID): [Folder]
        getNotesByFolder(folderid: ID): [Note]
    }
    
    type Mutation {
        createFolder(input: FolderInput): Folder
        createBook(input: BookInput): Book
        createUser(input: UserInput): User
        createNote(input: NoteInput): Note
        deleteNoteById(noteid: ID): Note
        updateFolderName(folderid: ID, name: String): Folder
        updateFolderCountNotes(folderid: ID, mode: String): Folder
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
    createUser: async ({input}: any) => await pool.query('INSERT INTO users (mail, password) VALUES ($1, $2) RETURNING *'
        , [input.mail, input.password])
        .then(res => res.rows[0])
    ,
    createNote: async ({input}: any) =>
        await pool.query('INSERT INTO notes (userid, folderid, bookid, title, content, datecreate, dateupdate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            , [input.userid, input.folderid, input.bookid, input.title, input.content, input.datecreate, input.dateupdate])
            .then(res => res.rows[0])
    ,
    getAllNotes: async ({userid}: any) => await pool.query('SELECT * FROM notes WHERE userid = ($1) ORDER BY dateupdate DESC'
        , [+userid])
        .then(res => res.rows)
    ,
    deleteNoteById: async ({noteid}: any) => await pool.query('DELETE FROM notes WHERE id = ($1) RETURNING *'
            , [+noteid])
            .then(res => res.rows[0])
    ,
    createBook: async ({input}: any) => await pool.query('INSERT INTO books (userid, name, image) VALUES ($1, $2, $3) RETURNING *'
        , [input.userid, input.name, input.image])
        .then(res => res.rows[0])
    ,
    createFolder: async ({input}: any) => await pool.query('INSERT INTO folders (userid, name, countofnotes) VALUES ($1, $2, $3) RETURNING *'
        , [input.userid, input.name, input.countofnotes])
        .then(res => res.rows[0])
    ,
    updateFolderName: async ({folderid, name}: any) => await pool.query('UPDATE folders SET name = ($1) WHERE id = ($2) RETURNING *'
        , [name, folderid])
        .then(res => res.rows[0])
    ,
    updateFolderCountNotes: async ({folderid, mode}: any) => {
        const countofnotes = await pool.query('SELECT countofnotes FROM folders WHERE id = ($1)',
            [+folderid]).then(res => res.rows[0].countofnotes)

        if(mode === "-"){
            await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                , [countofnotes - 1, +folderid])
        }else{
            await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                , [countofnotes + 1, +folderid])
        }
    }



    ,
    getAllFolders: async ({userid}: any) => await pool.query('SELECT * FROM folders WHERE userid = ($1)'
        , [+userid])
        .then(res => res.rows)
    ,
    getNotesByFolder: async ({folderid}: any) => await pool.query('SELECT * FROM notes WHERE folderid = ($1)'
        , [+folderid]).then(res => res.rows)
    ,
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

app.set('port', process.env.PORT || 3002)

const server = app.listen(app.get('port'), function() {
    console.log('listening');
});
