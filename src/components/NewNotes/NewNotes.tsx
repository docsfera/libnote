import React from 'react';
import "./NewNotes.sass"
import {gql, useMutation, useQuery} from "@apollo/client"
import Note from "../Note/Note"

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
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


const NewNotes = () => {

    const [deleteNote] = useMutation(DELETE_NOTE_BY_ID)

    const deleteNoteEvent = async (noteId: string) => {
        await deleteNote({variables: {noteid: noteId}})
        await refetch()
    }

    const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: "1"}})
    console.log(data)

    return (
        <div className="notes-section">
            <div className="notes-wrapper">
                <div className="notes-info">
                    <p className="name-section">Заметки</p>
                    <p className="section-count">{`Всего ${data ? data.getAllNotes.length : "0"} заметок`}</p>
                </div>
                <div className="create-note">
                    Создать заметку
                </div>
            </div>

            <div className="notes">
                {data
                    ? data.getAllNotes.map((i: any) => <Note noteId={i.id}
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