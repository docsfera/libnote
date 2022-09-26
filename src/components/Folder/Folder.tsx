import React from 'react'
import "./Folder.sass"

type folderType = {
    folderCount: number
    folderName: string
}

const Folder: React.FC<folderType> = (props) => {
    return (
        <div className="folder">
            <div className="folder-info">
                <div className="folder-count">{props.folderCount}</div>
                <div className="folder-settings">
                    <div className="oval"> </div>
                    <div className="oval"> </div>
                    <div className="oval"> </div>
                </div>
            </div>
            <div className="folder-image"> </div>
            <p className="folder-name">{props.folderName}</p>
        </div>
    );
};

export default Folder;