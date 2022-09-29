import React from 'react'
import "./Note.sass"
// TODO: type of function!
type NoteProps = {
    noteId: string
    noteName: string
    noteContent: string
    dateUpdate: string
    deleteNoteEvent: any
}

const Note: React.FC<NoteProps> = (props) => {

    // const dateFormatter = (date: string) => {
    //     const strDate = new Date(+date)
    //     const getCorrectNum = (num: number) => (num < 10) ? `0${num}` : num
    //     const days = strDate.getDate()
    //     const months = strDate.getMonth() + 1
    //     return `${getCorrectNum(days)}.${getCorrectNum(months)}.${strDate.getFullYear()}`
    // }

    return (
        <div className="note">
            <div className="delete-note" onClick={() => props.deleteNoteEvent(props.noteId)}> </div>
            <div className="note-wrapper">
                <div className="note-info">
                    <p className="note-name">{props.noteName}</p>
                    <p className="note-book"> </p>
                </div>
                <p className="note-content">{props.noteContent}</p>
                <p className="note-time">{props.dateUpdate}</p>
            </div>
        </div>
    );
};

export default Note;