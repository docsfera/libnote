import React from 'react'
import "./Folder.sass"
import {gql, useQuery} from "@apollo/client";

type folderType = {
    folder: any //TODO: any
}

const GGGG = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
`

const Folder: React.FC<folderType> = (props) => {

    const { loading, data, error} = useQuery(GGGG, {variables: {folderid: props.folder.id}})

    return (
        <div className="folder">
            <div className="folder-info">
                <div className="folder-count">{data ? data.getNotesByFolder.length : " - "}</div>
                <div className="folder-settings">
                    <div className="oval"> </div>
                    <div className="oval"> </div>
                    <div className="oval"> </div>
                </div>
            </div>
            <div className="folder-image"> </div>
            <p className="folder-name">{props.folder.name}</p>
        </div>
    );
};

export default Folder;