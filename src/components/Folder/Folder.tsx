import React, {useEffect, useState} from 'react'
import "./Folder.sass"
import {gql, useQuery} from "@apollo/client";

type folderType = {
    folder: any //TODO: any
    useGetCountNotesByFolder: any
}

const Folder: React.FC<folderType> = (props) => {

//нельзя убирать, еще нужен будет для перехода к папке
// const { loading, data, error} = useQuery(GGGG, {variables: {folderid: props.folder.id}})

    return (
        <div className="folder">
            <div className="folder-info">
                <div className="folder-count">{props.folder.countofnotes}</div>
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