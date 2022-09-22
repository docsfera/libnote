import React from 'react'
import "./Note.sass"
// TODO: type of function!
type NoteProps = {
    noteId: string
    noteContent: string
    noteDate: string
    deleteNoteEvent: any
}

const Note: React.FC<NoteProps> = (props) => {

    const dateFormatter = (date: string) => {
        const strDate = new Date(+date)
        const getCorrectNum = (num: number) => (num < 10) ? `0${num}` : num
        const days = strDate.getDate()
        const months = strDate.getMonth() + 1
        return `${getCorrectNum(days)}.${getCorrectNum(months)}.${strDate.getFullYear()}`
    }

    return (
        <div className="note">
            <div className="note-delete"
                 onClick={() => props.deleteNoteEvent(props.noteId)}>
                <img src={`${process.env.PUBLIC_URL}/images/delete.svg`} alt="delete"/>
            </div>
            <p className="note-content">{props.noteContent}</p>
            <p className="note-date">{dateFormatter(props.noteDate)}</p>
        </div>
    );
};

export default Note;