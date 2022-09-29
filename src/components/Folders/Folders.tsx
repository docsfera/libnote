import React, {useEffect, useRef, useState} from 'react';
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



const Folders = () => {

    const { loading, data, error} = useQuery(GET_ALL_FOLDERS, {variables: {userid: "1"}})


    let [position, setPosition] = useState(0)
    let folderCount
    data ? folderCount = data.getAllFolders.length : folderCount = 0
    const gg = useRef(null)
    const folderSection = useRef(null)
    const folderWidth = 200



    // const min = () => {
    //     let newPosition = position - folderWidth
    //     checkBtns(newPosition)
    //     setPosition(newPosition)
    //     console.log(newPosition)
    //     //@ts-ignore
    //     gg.current.style = `transition: 0.5s; transform:translateX(-${newPosition}px)`
    // }
    //
    // const plus = () => {
    //     let newPosition = position + folderWidth
    //     checkBtns(newPosition)
    //     setPosition(newPosition)
    //     //@ts-ignore
    //     gg.current.style = `transition: 0.5s; transform: translateX(-${newPosition}px)`
    // }

    // const checkBtns = (position: number) => {
    //     console.log(plusBtn)
    //     //@ts-ignore
    //     console.log(folderSection.current.offsetWidth);
    //     //@ts-ignore
    //     (position === 0) ? minBtn.current.style.display = "none" : minBtn.current.style.display = "block";
    //     //@ts-ignore
    //     console.log(folderSection.current.offsetWidth, folderWidth * folderCount)
    //     //@ts-ignore
    //     if(folderSection.current.offsetWidth > folderWidth * folderCount){
    //
    //         //@ts-ignore
    //         plusBtn.current.style.display = "none"
    //     }else{
    //         //@ts-ignore
    //         (position >= (folderCount - 4) * folderWidth) ?  plusBtn.current.style.display = "none" : plusBtn.current.style.display = "block"
    //     }
    //
    // }
    // useEffect(() => checkBtns(0),
    //     //@ts-ignore
    //     [])

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
                            ? data.getAllFolders.map( (i: any) => <Folder folder={i}/>) // TODO: any
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