import React, {useEffect, useRef, useState} from 'react'
import Header from "../Header/Header"
import './NoteCreator.sass'
import {gql, useMutation, useQuery} from "@apollo/client"
import {useLocation, useNavigate, useParams} from "react-router-dom"

const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid) {
            id
            name
        }
    }
`
const GET_ALL_BOOKS = gql`
    query getAllBooks($userid: ID) {
        getAllBooks(userid: $userid) {
            id
            name
            image
        }
    }
`
const GET_NOTE_BY_ID = gql`
    query getNoteById($id: ID) {
        getNoteById(id: $id){
            id
            folderid
            bookid
            title
            content
        }
    }
`
const CREATE_NOTE = gql`
      mutation createNote($input: NoteInput) {
        createNote(input: $input){
            id
        }
    }
`
const UPDATE_NOTE = gql`
      mutation updateNote($input: NoteInput) {
        updateNote(input: $input){
            id
        }
    }
`


const UPDATE_FOLDER_COUNT_NOTES = gql`
    mutation updateFolderCountNotes($folderid: ID, $mode: String){
        updateFolderCountNotes(folderid: $folderid, mode: $mode) {
            id
        }
    }

`

type NoteCreatorType = {
    isShowHeader?: boolean
    currentNoteContent?: any
    setCurrentNoteContent?: any
}

const NoteCreator: React.FC<NoteCreatorType> = (props) => {
    const navigate = useNavigate()
    const {id} = useParams()
    const { state }: any = useLocation() //TODO: any

    const {data, refetch} = useQuery(GET_NOTE_BY_ID, {variables: {id}})
    const allFolders = useQuery(GET_ALL_FOLDERS, {variables: {userid: "1"}}).data
    const dataBooks = useQuery(GET_ALL_BOOKS, {variables: {userid: "1"}}).data

    const [createNote] = useMutation(CREATE_NOTE)
    const [updateNote] = useMutation(UPDATE_NOTE)
    const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)

    const [noteName, setNoteName] = useState("Untitled")
    const [noteContent, setNoteContent] = useState("")
    const [beginFolderId, setBeginFolderId] = useState(null)
    const [nameSelectedFolder, setNameSelectedFolder] = useState("")
    const [nameSelectedBook, setNameSelectedBook] = useState("")
    const [idSelectedFolder, setIdSelectedFolder] = useState<string | null>(null)
    const [idSelectedBook, setIdSelectedBook] = useState<string | null>(null)

    const [pathToImageSelectedBook, setPathToImageSelectedBook] = useState<string>("/images/book1.png") // `/files/1/${useGetImageBook(idSelectedBook)}`

    const allFolder = useRef<HTMLDivElement>(null)
    const allBooks = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Если обрабатывается существующая заметка
        if(data && data.getNoteById){
            setNoteName(data.getNoteById.title)
            setNoteContent(data.getNoteById.content)
            setIdSelectedFolder(data.getNoteById.folderid)
            setIdSelectedBook(data.getNoteById.bookid)
            setBeginFolderId(data.getNoteById.folderid)

            data.getNoteById.folderid && setNameSelectedFolder(allFolders.getAllFolders.filter((i: any) =>
                (i.id === data.getNoteById.folderid))[0].name)
            data.getNoteById.bookid && setNameSelectedBook(dataBooks.getAllBooks.filter((i: any) =>
                (i.id === data.getNoteById.bookid))[0].name);


            if(dataBooks && dataBooks.getAllBooks && idSelectedBook) {
                setPathToImageSelectedBook(
                    `/files/1/${dataBooks.getAllBooks.filter((i:any) => i.id === idSelectedBook)[0].image}`)
            }
        }
        // Если обрабатывается заметка созданная из папки
        if(state && state.folderId){
            setIdSelectedFolder(state.folderId)
            setBeginFolderId(state.folderId)
            setNameSelectedFolder(allFolders.getAllFolders.filter((i: any) =>
                (i.id === state.folderId))[0].name)

        }
        // Если обрабатывается заметка pdfViewer
        if(props.currentNoteContent){
            setNoteName(props.currentNoteContent.name)
            setNoteContent(props.currentNoteContent.content)


        }

    }, [data, dataBooks])

    const showAllFolder = () => {
        if(allFolder && allFolder.current) {
            if(allFolder.current.style.cssText == ""){
                allFolder.current.style.display = "block"
            }else{
                if(allFolder.current.style.display === "none"){
                    allFolder.current.style.display = "block"
                }else{
                    allFolder.current.style.display = "none"
                }
            }
        }
    }

    const showAllBooks = () => {
        if(allBooks && allBooks.current) {
            if(allBooks.current.style.cssText == ""){
                allBooks.current.style.display = "block"
            }else{
                if(allBooks.current.style.display === "none"){
                    allBooks.current.style.display = "block"
                }else{
                    allBooks.current.style.display = "none"
                }
            }
        }
    }

    const selectCurrentFolder = (e: React.MouseEvent<Element, MouseEvent>, idSelectedFolder: string) => {
        const {target} = e
        const nameFolder = target ? (target as HTMLDivElement).innerText : " "
        if(allFolder && allFolder.current){
            setNameSelectedFolder(nameFolder)
            setIdSelectedFolder(idSelectedFolder)
            allFolder.current.style.display = "none"
        }

    }

    const selectCurrentBook = (e: React.MouseEvent<Element, MouseEvent>, idSelectedBook: string) => {
        const {target} = e
        const nameBook = target ? (target as HTMLDivElement).innerText : " "
        if (allBooks && allBooks.current) {
            setNameSelectedBook(nameBook)
            setIdSelectedBook(idSelectedBook)
            allBooks.current.style.display = "none"
        }
        if(dataBooks && dataBooks.getAllBooks && idSelectedBook) {
            setPathToImageSelectedBook(
                `/files/1/${dataBooks.getAllBooks.filter((i:any) => i.id === idSelectedBook)[0].image}`)
        }
    }

    const createNoteEvent = async () => { // TODO: rename?
        if(!id){
            await createNote(
                {
                    variables: {
                        input: {
                            userid: "1",
                            folderid: idSelectedFolder,
                            bookid: idSelectedBook,
                            title: (noteName === "") ? "Untitled" : noteName,
                            content: noteContent,
                            datecreate: String(Date.now()),
                            dateupdate: String(Date.now())
                        }
                    }
                })
            idSelectedFolder && await updateFolderCountNotes({variables: {folderid: idSelectedFolder, mode: "+"}})
        }else{
            await updateNote(
                {
                    variables: {
                        input: {
                            id,
                            userid: "1",
                            folderid: idSelectedFolder,
                            bookid: idSelectedBook,
                            title: (noteName === "") ? "Untitled" : noteName,
                            content: noteContent,
                            datecreate: String(Date.now()),
                            dateupdate: String(Date.now())
                        }
                    }
                })
            if(beginFolderId !== idSelectedFolder){
                await updateFolderCountNotes({variables: {folderid: beginFolderId, mode: "-"}})    // TODO: REDO?
                await updateFolderCountNotes({variables: {folderid: idSelectedFolder, mode: "+"}}) // TODO: REDO?
            }
        }
        refetch()

        !(props.isShowHeader === false) && navigate(-1)
    }

    const reductStr = (str:string) => (str.length > 20) ? `${str.substr(0, 20)}...` : str



    return (
        <div className="note-creator-wrapper">
            {!(props.isShowHeader === false) && <Header/>}
            <div className="note-creator">
                <div className="note-info">

                    <p className="note-name" contentEditable="true" onBlur={(e) => {
                        setNoteName(e.target.innerText)
                        props.setCurrentNoteContent({name: e.target.innerText, content: props.currentNoteContent.content})
                    }}>{reductStr(noteName)}</p>
                    <div className="note-content" contentEditable="true"
                         onBlur={(e) => {
                             setNoteContent(e.target.innerText)
                             props.setCurrentNoteContent({name: props.currentNoteContent.name, content: e.target.innerText})
                         }}>
                        {reductStr(noteContent)}
                    </div>
                </div>

                <div className="note-attitude">

                    <div className="folder-info">
                        <p>Папка</p>
                        <div className="select select-folder" onClick={showAllFolder}>{nameSelectedFolder}</div>
                        <div className="all-folders" ref={allFolder}>
                            {allFolders ? allFolders.getAllFolders.map(
                                (i: any) => <div className="select" onClick={(e) =>
                                    selectCurrentFolder(e, i.id)}> {reductStr(i.name)}</div>) : " "}
                        </div>
                    </div>

                    <div className="book-info">
                        <p>Книга</p>
                        <div className="select select-book" onClick={showAllBooks}>{nameSelectedBook}</div>
                        <div className="all-books" ref={allBooks}>
                            {dataBooks ? dataBooks.getAllBooks.map(
                                (i: any) => <div className="select" onClick={(e) =>
                                    selectCurrentBook(e, i.id)}> {reductStr(i.name)} </div>) : " "}
                        </div>
                    </div>

                    <img src={pathToImageSelectedBook} alt="" className="image"/>
                    <button className="save-note" onClick={createNoteEvent}>fsfdsfdfd</button>
                </div>
            </div>

        </div>
    );
};

export default NoteCreator;