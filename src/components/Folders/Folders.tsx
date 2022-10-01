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


    const { loading, data, error, refetch} = useQuery(GET_ALL_FOLDERS, {variables: {userid: "1"}})





    const useGetCountNotesByFolder = (folderid: any) => {
        const { data} = useQuery(GGGG, {variables: {folderid}});
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }


    //@ts-ignore TODO:fix
    useEffect(() => {
        refetch()
        console.log(data)
    }, [props.numOfNotes])



    let [position, setPosition] = useState(0)
    let folderCount
    ///const noteCountInFolder = {}
    data ? folderCount = data.getAllFolders.length : folderCount = 0
    //@ts-ignore
    // (data && data.getAllFolders) && data.getAllFolders.map((i) => noteCountInFolder[i.id] =
    //     useQuery(GGGG, {variables: {folderid: i.id}}))
    const gg = useRef(null)
    const folderSection = useRef(null)
    const folderWidth = 200


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
                            ? data.getAllFolders.map( (i: any) => <Folder folder={i}
                                                                          key={i.id}
                                                                          numOfNotes={props.numOfNotes}
                                                                          useGetCountNotesByFolder={useGetCountNotesByFolder}
                                                                          />) // TODO: any
                            : " "
                        }

                        {/*<Folder folderCount={55} folderName="Неотсортированные"/>*/}
                        {/*<Folder folderCount={55} folderName="Неотсортированные"/>*/}
                        {/*<Folder folderCount={55} folderName="Неотсортированные"/>*/}
                        {/*<Folder folderCount={55} folderName="Неотсортированные"/>*/}
                        {/*<Folder folderCount={55} folderName="Неотсортированные"/>*/}
                        {/*<Folder folderCount={55} folderName="Неотсортированные"/>*/}




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