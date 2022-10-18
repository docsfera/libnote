import React from 'react'
import "./NoteCreatorComponent.sass"
import NoteCreator from "../NoteCreator/NoteCreator";

type NoteCreatorComponentType = {
    userId: string
    currentNoteContent: any
    setCurrentNoteContent: any
}

const NoteCreatorComponent: React.FC<NoteCreatorComponentType> = (props) => {
    return (
        <div className="note-creator-component">
            <NoteCreator isShowHeader={false}
                         currentNoteContent={props.currentNoteContent}
                         setCurrentNoteContent={props.setCurrentNoteContent}/>
        </div>
    );
};

export default NoteCreatorComponent;