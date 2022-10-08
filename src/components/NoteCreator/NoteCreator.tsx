import React, {useEffect, useRef, useState} from 'react'
import Header from "../Header/Header"
import './NoteCreator.sass'
import {gql, useMutation, useQuery} from "@apollo/client"
import {useLocation, useNavigate, useParams} from "react-router-dom"


const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid){
            id
            name
        }
    }
`

const GET_NOTE_BY_ID = gql`
    query getNoteById($id: ID) {
        getNoteById(id: $id){
            id
            folderid
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


// const useGg = (id: string | undefined): any => {
//     id ? useQuery(GET_NOTE_BY_ID, {variables: {id}}).data : {}
// }


const NoteCreator = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const { state }: any = useLocation() //TODO: any

    const currentNoteData = useQuery(GET_NOTE_BY_ID, {variables: {id}}).data
    const { loading, data, error} = useQuery(GET_ALL_FOLDERS, {variables: {userid: "1"}})

    const [createNote] = useMutation(CREATE_NOTE)
    const [updateNote] = useMutation(UPDATE_NOTE)
    const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)

    const [noteName, setNoteName] = useState("Untitled")
    const [noteContent, setNoteContent] = useState("")
    const [beginFolderId, setBeginFolderId] = useState(null)
    const [nameSelectedFolder, setNameSelectedFolder] = useState("")
    const [idSelectedFolder, setIdSelectedFolder] = useState<string | null>(null)

    const allFolder = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Если обрабатывается существующая заметка
        if(currentNoteData && currentNoteData.getNoteById){
            setNoteName(currentNoteData.getNoteById.title)
            setNoteContent(currentNoteData.getNoteById.content)
            setIdSelectedFolder(currentNoteData.getNoteById.folderid)
            setBeginFolderId(currentNoteData.getNoteById.folderid)

            currentNoteData.getNoteById.folderid && setNameSelectedFolder(data.getAllFolders.filter((i: any) =>
                (i.id === currentNoteData.getNoteById.folderid))[0].name)

        }
        // Если обрабатывается заметка созданная из папки
        if(state && state.folderId){
            setIdSelectedFolder(state.folderId)
            setBeginFolderId(state.folderId)
            setNameSelectedFolder(data.getAllFolders.filter((i: any) =>
                (i.id === state.folderId))[0].name)
        }

    }, [currentNoteData])

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

    const selectCurrentFolder = (e: React.MouseEvent<Element, MouseEvent>, idSelectedFolder: string) => {
        const {target} = e
        const nameFolder = target ? (target as HTMLDivElement).innerText : " "
        if(allFolder && allFolder.current){
            setNameSelectedFolder(nameFolder)
            setIdSelectedFolder(idSelectedFolder)
            allFolder.current.style.display = "none"
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


        navigate(-1)
    }

    return (
        <div className="note-creator-wrapper">
            <Header/>
            <div className="note-creator">
                <div className="note-info">

                    <p className="note-name" contentEditable="true" onBlur={(e) => setNoteName(e.target.innerText)}>{noteName}</p>
                    <div className="note-content" contentEditable="true"
                         onBlur={(e) => setNoteContent(e.target.innerText)}>
                        {noteContent}
                    </div>
                </div>

                <div className="note-attitude">
                    <div className="folder-info">
                        <p>Папка</p>
                        <div className="select select-folder" onClick={showAllFolder}>{nameSelectedFolder}</div>
                        <div className="all-folders" ref={allFolder}>

                            {data ? data.getAllFolders.map(
                                (i: any) => <div className="select" onClick={(e) =>
                                    selectCurrentFolder(e, i.id)}> {i.name}</div>) : " "}

                        </div>


                    </div>
                    <div className="book-info">
                        <p>Книга</p>
                        <div className="select select-book"> </div>
                    </div>
                    <img src="/images/book1.png" alt="" className="image"/>
                    <button className="save-note" onClick={createNoteEvent}>fsfdsfdfd</button>
                </div>
            </div>

        </div>
    );
};

export default NoteCreator;