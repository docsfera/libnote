import express from "express"
import {graphqlHTTP} from "express-graphql"
import cors from "cors"
import {buildSchema} from "graphql"
import fileUpload, {UploadedFile} from "express-fileupload"
import pg from "pg"
import path from "path"


//@ts-ignore
import {createDir} from "./services/fileService.ts"
import fs from "fs";

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
        userid: ID
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
        getNoteById(id: ID): Note
        getUserById(id: ID): User
        getBookById(id: ID): Book
        getFolderById(id: ID): Folder
        getAllNotes(userid: ID): [Note]
        getAllFolders(userid: ID): [Folder]
        getAllBooks(userid: ID): [Book]
        getNotesByFolder(folderid: ID): [Note] 
        
        
    }
    scalar Upload
    type Mutation {
        createFolder(input: FolderInput): Folder
        createBook(input: BookInput): Book
        createUser(input: UserInput): User
        createNote(input: NoteInput): Note
        deleteNoteById(noteid: ID): Note
        deleteBookById(id: ID): Book
        deleteFolderById(id: ID): Folder
        updateFolderName(id: ID, name: String): Folder
        updateFolderCountNotes(folderid: ID, mode: String): Folder
        updateNote(input: NoteInput): Note
        
        downloadBook(file: Upload!) : Book
        saveBase64(base64: String, bookId: ID): Book
       
    }

`)

const app = express()
app.use(cors())
app.use(fileUpload())

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

const root = {

    getAllUsers: async () => await pool.query('SELECT * FROM users')
        .then(res => res.rows)
    ,
    getUserById: async (params: any) => await pool.query('SELECT * FROM users WHERE id = ($1)'
        , [params.id])
        .then(res => res.rows[0])
    ,
    getNoteById: async ({id}: any) => await pool.query('SELECT * FROM notes WHERE id = ($1)'
    , [id])
    .then(res => res.rows[0])
    ,
    getBookById: async ({id}: any) => await pool.query('SELECT * FROM books WHERE id = ($1)'
        , [id])
        .then(res => res.rows[0])

    ,
    getFolderById: async ({id}: any) => await pool.query('SELECT * FROM folders WHERE id = ($1)'
        , [id])
        .then(res => res.rows[0])
    ,
    createUser: async ({input}: any) => await pool.query('INSERT INTO users (mail, password) VALUES ($1, $2) RETURNING *'
        , [input.mail, input.password])
        .then(res => res.rows[0])
    ,
    createNote: async ({input}: any) => {
        console.log(input)
        await pool.query('INSERT INTO notes (userid, folderid, bookid, title, content, datecreate, dateupdate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            , [input.userid, input.folderid, input.bookid, input.title, input.content, input.datecreate, input.dateupdate])
            .then(res => res.rows[0])

        if(input.folderid) {
            const countOfNotes = await pool.query('SELECT countofnotes FROM folders WHERE id = ($1)',
                [+input.folderid]).then(res => res.rows[0].countofnotes)

            await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                , [countOfNotes + 1, +input.folderid])
        }
    }


    ,
    getAllNotes: async ({userid}: any) => await pool.query('SELECT * FROM notes WHERE userid = ($1) ORDER BY dateupdate DESC'
        , [+userid])
        .then(res => res.rows)
    ,
    getAllBooks : async ({userid}: any) => await pool.query('SELECT * FROM books WHERE userid = ($1)'
        , [+userid])
        .then(res => res.rows)
    ,
    deleteNoteById: async ({noteid}: any) =>
        await pool.query('DELETE FROM notes WHERE id = ($1) RETURNING *'
            , [+noteid])
            .then( async (res) =>  {
                if(res.rows[0].folderid) {
                    const countOfNotes = await pool.query('SELECT countofnotes FROM folders WHERE id = ($1)',
                        [+res.rows[0].folderid]).then(res => res.rows[0].countofnotes)
                    await pool.query('UPDATE folders SET countofnotes = ($1) WHERE id = ($2)'
                        , [countOfNotes - 1, +res.rows[0].folderid])
                }
                return res.rows[0]
            })

    ,
    deleteBookById: async ({id}: any) => await pool.query('DELETE FROM books WHERE id = ($1) RETURNING *'
        , [+id])
        .then(res => res.rows[0])
    ,

    deleteFolderById: async ({id}: any) => { //TODO: doent send response
        await pool.query('UPDATE notes SET folderid = null WHERE folderid = ($1)', [+id])
            .then(() => pool.query('DELETE FROM folders WHERE id = ($1) RETURNING *'
            , [+id])).then(res => {
                console.log(res.rows[0])
                return res.rows[0]
            })
    }
    ,
    createBook: async ({input}: any) => await pool.query('INSERT INTO books (userid, name, image) VALUES ($1, $2, $3) RETURNING *'
        , [input.userid, input.name, input.image])
        .then(res => res.rows[0])
    ,
    createFolder: async ({input}: any) => await pool.query('INSERT INTO folders (userid, name, countofnotes) VALUES ($1, $2, $3) RETURNING *'
        , [input.userid, input.name, input.countofnotes])
        .then(res => res.rows[0])
    ,
    updateFolderName: async ({id, name}: any) => await pool.query('UPDATE folders SET name = ($1) WHERE id = ($2) RETURNING *'
        , [name, id])
        .then(res => {res.rows[0]; console.log(name, id)})
    ,
    updateNote: async ({input}: any) => {
        await pool.query('UPDATE notes SET folderid = ($2), bookid = ($3), title = ($4), content = ($5), datecreate = ($6), dateupdate = ($7) WHERE id = ($1) RETURNING *'
            , [input.id, input.folderid, input.bookid, input.title, input.content, input.datecreate, input.dateupdate])
            .then(res => res.rows[0])
    }
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

    downloadBook: (file: UploadedFile | undefined, userId: string) => {
        if (file){
            const filePath = path.join('C:/Users/Admin/Desktop/libnote/public/files', userId)

            try {
                if(fs.existsSync(filePath)) {
                    file.mv(path.join('C:/Users/Admin/Desktop/libnote/public/files',userId, file.name))
                    pool.query('INSERT INTO books (userid, name, image) VALUES ($1, $2, $3)', [userId, file.name, ""])
                } else{
                    fs.mkdirSync(filePath)
                    console.log({message: "File already exist"})
                }
            } catch (e) {
                console.log({message: "File error", e})
            }
        }else{
            console.log('qq')
        }

    }
    ,

    saveBase64: async (base64: string, bookId: any) => {
        //@ts-ignore
        let base64Data = base64.base64.replace(/^data:image\/png;base64,/, "")

        const getNameImg = () => {
            return `${Math.floor(Math.random() * 1e10)}.png`
        }
        let imgName = getNameImg()
        console.log(imgName, bookId.body.variables.bookId) // TODO: crinjahgdfh
        let isFileExist = true
        let filePath = path.join('C:/Users/Admin/Desktop/libnote/public/files/1', imgName)
        while (isFileExist) {
            if (fs.existsSync(filePath)){
                imgName = getNameImg()
            }else {
                isFileExist = false
                fs.writeFileSync(filePath, base64Data, 'base64')
            }
        }
        await pool.query('UPDATE books SET image = ($2) WHERE id = ($1) RETURNING *'
            , [+bookId.body.variables.bookId, imgName])
            .then(res => res.rows[0])
    }
    ,


}




app.post('/', function(req, res) {
    const file = (req && req.files) && req.files.file as UploadedFile
    const userId = req.body.userId
    //localStorage.setItem("userId", JSON.stringify(1))

    root.downloadBook(file, userId)
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
