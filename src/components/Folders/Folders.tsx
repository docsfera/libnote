import React, {useCallback, useEffect, useRef, useState} from 'react';
import Folder from "../Folder/Folder"
import Arrow from "../Arrow/Arrow"
import "./Folders.sass"
import {gql, useQuery} from "@apollo/client";

const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid){
            id
            name
            countofnotes
        }
    }
`

const GGGG = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
`

type FoldersType = {
    numOfNotes: any
}


const Folders: React.FC<FoldersType> = (props) => {
    useEffect(() => {refetch()}, [props.numOfNotes])

    const { loading, data, error, refetch} = useQuery(GET_ALL_FOLDERS, {variables: {userid: "1"}})

    let [position, setPosition] = useState(0)
    let folderCount
    data ? folderCount = data.getAllFolders.length : folderCount = 0
    const gg = useRef(null)
    const folderSection = useRef(null)
    const folderWidth = 200

    const useGetCountNotesByFolder = (folderid: any) => {
        const { data} = useQuery(GGGG, {variables: {folderid}})
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }

    return (
        <div className="folders-section" ref={folderSection}>
            <p className="name-section">Папки</p>
            <p className="section-count">{`Всего ${folderCount} папок`}</p>
            <div className="folders">
                <Arrow gg={gg}
                       position={position}
                       elementWidth={folderWidth}
                       setPosition={setPosition}
                       currentSection={folderSection}
                       sectionCount={folderCount}
                       isLeftArrow={true}
                       maxCountToShow={4}
                />

                <div className="folders-container">
                    <div ref={gg} className="itemser">
                        {data
                            ? data.getAllFolders.map( (i: any) =>
                                <Folder folder={i}
                                        key={i.id}
                                        useGetCountNotesByFolder={useGetCountNotesByFolder}
                                />) // TODO: any
                            : " "
                        }
                    </div>

                </div>
                <Arrow gg={gg}
                       position={position}
                       elementWidth={folderWidth}
                       setPosition={setPosition}
                       currentSection={folderSection}
                       sectionCount={folderCount}
                       isLeftArrow={false}
                       maxCountToShow={4}
                />
            </div>
        </div>
    );
};

export default Folders;