import React, {useCallback, useEffect, useRef, useState} from 'react';
import Folder from "../Folder/Folder"
import Arrow from "../Arrow/Arrow"
import "./Folders.sass"
import {gql, useMutation, useQuery} from "@apollo/client";

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

const CREATE_FOLDER = gql`
    mutation createFolder($input: FolderInput){
        createFolder(input: $input) {
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
    const [createFolder] = useMutation(CREATE_FOLDER)
    const createFolderEvent = async () => {
        await createFolder(
            {
                variables: {
                    input: {
                        userid: "1",
                        name: "name",
                        countofnotes: 0
                    }
                }
            })
        refetch()
        }
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
            <div className="folders-wrapper">
                <div className="folders-info">
                    <p className="name-section">Папки</p>
                    <p className="section-count">{`Всего ${folderCount} папок`}</p>
                </div>
                <div className="create-folder" onClick={createFolderEvent}>
                    Создать папку
                </div>
            </div>


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
                                        refetchFolders={refetch}
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