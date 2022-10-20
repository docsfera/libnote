import React, {useEffect, useRef} from 'react'
import "./Note.sass"
// TODO: type of function!
type NoteProps = {
    noteId: string
    folderId?: string
    bookId?: string
    noteName: string
    noteContent: string
    dateUpdate: string
    deleteNoteEvent?: any
    goToNoteCreator?: any
    searchWord?: string
    getNoteCreatorComponentEvent?: any
}

const Note: React.FC<NoteProps> = (props) => {

    // const dateFormatter = (date: string) => {
    //     const strDate = new Date(+date)
    //     const getCorrectNum = (num: number) => (num < 10) ? `0${num}` : num
    //     const days = strDate.getDate()
    //     const months = strDate.getMonth() + 1
    //     return `${getCorrectNum(days)}.${getCorrectNum(months)}.${strDate.getFullYear()}`
    // }

    const noteNameRef = useRef<HTMLDivElement>(null)
    const noteContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(noteNameRef && noteNameRef.current && noteContentRef && noteContentRef.current){
            noteNameRef.current.innerHTML = insertMarkHTML(props.noteName, props.searchWord)
            noteContentRef.current.innerHTML = insertMarkHTML(props.noteContent, props.searchWord)
        }
    }, [props.searchWord])

    const insertMark = (str: string, pos: number, len: number) =>{
        if(pos === 0 && len === 0) return str
        return str.slice(0, pos) + '<mark>' + str.slice(pos, pos+len) + '</mark>' + str.slice(pos+len)
    }


    const insertMarkHTML = (noteName: string, searchWord: string | undefined) => {
        if(searchWord){
            return insertMark(noteName, noteName.toLowerCase().search(searchWord.toLowerCase()), searchWord.length)
        }else{
            return noteName
        }
    }

    const noteClickEvent = () => {
        props.goToNoteCreator && props.goToNoteCreator(props.noteId)
        props.getNoteCreatorComponentEvent
        && props.getNoteCreatorComponentEvent(props.noteName, props.noteContent, props.bookId, props.folderId)
    }



    return (
        <div className="note" onClick={noteClickEvent}>
            <div className="delete-note" onClick={(e) => {
                e.stopPropagation();
                props.deleteNoteEvent(props.noteId, props.folderId)
            }}> </div>
            <div className="note-wrapper">
                <div className="note-info">
                    <p ref={noteNameRef} className="note-name"> </p>
                    <p className="note-book"> </p>
                </div>
                <p ref={noteContentRef} className="note-content"> </p>
                <p className="note-time">{props.dateUpdate}</p>
            </div>
        </div>
    );
};

export default Note;