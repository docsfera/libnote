import React from 'react'
import "./NoteCreatorComponent.sass"
import NoteCreator from "../NoteCreator/NoteCreator";

const NoteCreatorComponent = () => {
    return (
        <div className="note-creator-component">
            <NoteCreator isShowHeader={false}/>
        </div>
    );
};

export default NoteCreatorComponent;