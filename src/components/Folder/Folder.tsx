import React, {useEffect, useState} from 'react'
import "./Folder.sass"
import {gql, useQuery} from "@apollo/client";

type folderType = {
    folder: any //TODO: any
    numOfNotes: any
    useGetCountNotesByFolder: any
}

const GGGG = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
`

const Folder: React.FC<folderType> = (props) => {

    const gg = props.useGetCountNotesByFolder(props.folder.id)
    //@ts-ignore
    useEffect(() => {console.log('lof')}, [props])

    // const fff = useState(props.numOfNotes)
    // console.log(fff)
//нельзя убирать, еще нужен будет для перехода к папке
    const { loading, data, error} = useQuery(GGGG, {variables: {folderid: props.folder.id}})
    // {data ? data.getNotesByFolder.length : " - "}
    return (
        <div className="folder">
            <div className="folder-info">
                <div className="folder-count">{gg}</div>
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