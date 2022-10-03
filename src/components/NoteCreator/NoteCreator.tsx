import React, {useRef, useState} from 'react';
import Header from "../Header/Header"
import './NoteCreator.sass'
import {gql, useMutation, useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";

const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid){
            id
            name
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
const UPDATE_FOLDER_COUNT_NOTES = gql`
    mutation updateFolderCountNotes($folderid: ID, $mode: String){
        updateFolderCountNotes(folderid: $folderid, mode: $mode) {
            id
        }
    }

`



const NoteCreator = () => {
    const navigate = useNavigate()
    const { loading, data, error} = useQuery(GET_ALL_FOLDERS, {variables: {userid: "1"}})
    const [createNote] = useMutation(CREATE_NOTE)
    const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)
    const [nameSelectedFolder, setNameSelectedFolder] = useState("")
    const [idSelectedFolder, setIdSelectedFolder] = useState<string | null>(null)

    const allFolder = useRef<HTMLDivElement>(null)
    //const currentFolderElement = useRef<HTMLDivElement>(null)
    const showAllFolder = () => {
        if(allFolder && allFolder.current) {
            if(allFolder.current.style.display === "none"){
                allFolder.current.style.display = "block"
            }else{
                allFolder.current.style.display = "none"
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
        await createNote(
            {
                variables: {
                    input: {
                        userid: "1",
                        folderid: idSelectedFolder,
                        title: "title",
                        content: "content",
                        datecreate: "1",
                        dateupdate: "1"
                    }
                }
            })
        console.log({folderid: idSelectedFolder, mode: "+"})
        await updateFolderCountNotes({variables: {folderid: idSelectedFolder, mode: "+"}})

        navigate('../')
    }

    return (
        <div className="note-creator-wrapper">
            <Header/>
            <div className="note-creator">
                <div className="note-info">
                    <p className="note-name">Название заметки</p>
                    <div className="note-content">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, at corporis
                        culpa cupiditate dolorem dolores ducimus earum et fuga hic impedit laborum magni
                        maxime natus nihil perspiciatis praesentium quibusdam quidem rerum saepe sit tempore totam vel vero voluptatibus? Animi dignissimos dolor eos expedita id illo mollitia nobis, obcaecati quas tempore.
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