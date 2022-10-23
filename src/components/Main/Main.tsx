// const Main = () => (
//     <main>
//         <Switch>
//             <Route exact path='/' component={Home}/>
//             <Route path='/roster' component={Roster}/>
//             <Route path='/schedule' component={Schedule}/>
//         </Switch>
//     </main>
// )

import React, {useEffect, useRef} from 'react';
import "./Main.sass"
import Header from "../Header/Header";
import Folders from "../Folders/Folders"
import NewBooks from "../NewBooks/NewBooks";
import NewNotes from "../NewNotes/NewNotes";
import LatestBooks from "../LatestBooks/LatestBooks";
import InputNoteCreator from "../InputNoteCreator/InputNoteCreator";
import Note from "../Note/Note";
import {useQuery, gql, useMutation} from '@apollo/client';


const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
            id
        }
    }
    `;

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            content
            dateupdate
        }
    }
`

const Main = () => {
    const getAllNotesQuery = useQuery(GET_ALL_NOTES, {variables: {userid: "1"}})
    const smokeWindow = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if(smokeWindow && smokeWindow.current){
            smokeWindow.current.style.height = `${smokeWindow.current.ownerDocument.body.offsetHeight}px`
        }
    },[smokeWindow, smokeWindow.current])

    useEffect(() => {getAllNotesQuery.refetch()}, [])
    const numOfNotes: any = (getAllNotesQuery.data && getAllNotesQuery.data.getAllNotes) && getAllNotesQuery.data.getAllNotes.length
    console.log(getAllNotesQuery.data)
    //TODO: как типизировать data, data.getAllNotes?
    return (
        <div>
            <Header/>
            <div className="main">
                <div ref={smokeWindow} className="smoke"> </div>

                <Folders numOfNotes={numOfNotes} smokeWindow={smokeWindow}/>
                <NewBooks/>
                <NewNotes getAllNotesQuery={getAllNotesQuery}/>
            </div>
        </div>

    );
};

export default Main;