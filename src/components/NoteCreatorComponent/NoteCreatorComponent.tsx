import React from 'react'
import "./NoteCreatorComponent.sass"
import NoteCreator from "../NoteCreator/NoteCreator";

type NoteCreatorComponentType = {
    userId: string
    currentNoteData: any
    setCurrentNoteData: any
}

const NoteCreatorComponent: React.FC<NoteCreatorComponentType> = (props) => {
    return (
        <div className="note-creator-component">
            <NoteCreator isShowHeader={false}
                         currentNoteData={props.currentNoteData}
                         setCurrentNoteData={props.setCurrentNoteData}/>
        </div>
    );
};

export default NoteCreatorComponent;