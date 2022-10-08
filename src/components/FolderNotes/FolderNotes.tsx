import React, {useEffect} from 'react';
import "./FolderNotes.sass"
import {useQuery, gql} from "@apollo/client"
import {useNavigate, useParams} from "react-router-dom"
import Note from "../Note/Note"

//TODO: dont repeat yourself
const GET_NOTES_BY_FOLDER = gql` 
    query getNotesByFolder($folderid: ID){
        getNotesByFolder(folderid: $folderid) {
            id
            title
            content
            dateupdate
        }
    }
`

const GET_FOLDER_BY_ID = gql` 
    query getFolderById($id: ID){
        getFolderById(id: $id) {
            name
            countofnotes
        }
    }
`

const FolderNotes = () => {
    const {id} = useParams()

    const {data, refetch} = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderid: id}})
    useEffect(() => {refetch()}, [])


    const navigate = useNavigate()

    const currentFolder = useQuery(GET_FOLDER_BY_ID, {variables: {id}}).data

    const goToNoteCreator = () => {
        navigate(`/note-creator`, {state: {folderId: id}})
    }

    return (
        <div className="folder-notes">
            <div className="folder-notes-wrapper">
                <div className="folder-info">
                    <div className="folder-name">{currentFolder && currentFolder.getFolderById.name}</div>
                    <div className="count-notes">{`Всего заметок ${data && data.getNotesByFolder.length}`}</div>
                </div>
                <div className="create-note" onClick={() => goToNoteCreator()}>
                    Создать заметку
                </div>
            </div>


            {data && data.getNotesByFolder.map((i: any) =>
                <Note noteId={i.id}
                      folderId={id}
                      noteName={i.title}
                      noteContent={i.content}
                      dateUpdate={i.dateupdate}/>)
            }
        </div>
    )
};

export default FolderNotes;