import React, {useEffect} from 'react';
import "./NewNotes.sass"
import {gql, useMutation, useQuery} from "@apollo/client"
import { useNavigate } from "react-router-dom"
import Note from "../Note/Note"

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            folderid
            content
            dateupdate
        }
    }
`

const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
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


const NewNotes = () => {
    useEffect(() => {refetch()}, [])

    const navigate = useNavigate()
    const createNoteEvent = () => navigate('/note-creator')

    const [deleteNote] = useMutation(DELETE_NOTE_BY_ID)
    const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)

    const deleteNoteEvent = async (noteId: string, folderId: any) => {
        await deleteNote({variables: {noteid: noteId}})
        await updateFolderCountNotes({variables: {folderid: folderId, mode: "-"}})
        await refetch()
    }

    const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: "1"}})

    return (
        <div className="notes-section">
            <div className="notes-wrapper">
                <div className="notes-info">
                    <p className="name-section">Заметки</p>
                    <p className="section-count">{`Всего ${data ? data.getAllNotes.length : "0"} заметок`}</p>
                </div>
                <div className="create-note" onClick={createNoteEvent}>
                    Создать заметку
                </div>
            </div>

            <div className="notes">
                {data
                    ? data.getAllNotes.map((i: any) => <Note noteId={i.id}
                                                             folderId={i.folderid}
                                                             noteContent={i.content}
                                                             dateUpdate={i.dateupdate}
                                                             deleteNoteEvent={deleteNoteEvent}
                                                             noteName={i.title}
                    />)
                    : " "}

            </div>
        </div>
    );
};

export default NewNotes;