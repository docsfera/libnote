// const Main = () => (
//     <main>
//         <Switch>
//             <Route exact path='/' component={Home}/>
//             <Route path='/roster' component={Roster}/>
//             <Route path='/schedule' component={Schedule}/>
//         </Switch>
//     </main>
// )

import React, {useEffect} from 'react';
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


    const { loading, data, error, refetch} = useQuery(GET_ALL_NOTES, {variables: {userid: "1"}})

    useEffect(() => console.log("update"), [data])
    const numOfNotes: any = (data && data.getAllNotes) && data.getAllNotes.length



    //TODO: как типизировать data, data.getAllNotes?
    return (
        <div className="main">
            <Header/>
            <Folders numOfNotes={numOfNotes}/>
            <NewBooks/>
            <NewNotes/>
            {/*<LatestBooks/>*/}
            {/*<InputNoteCreator refetch={refetch}/>*/}
            {/*{!loading && data.getAllNotes.map((i:any) =>*/}
            {/*    <Note noteContent={i.content}*/}
            {/*          noteDate={i.dateupdate}*/}
            {/*          noteId = {i.id}*/}
            {/*          deleteNoteEvent={deleteNoteEvent}/>)*/}
            {/*}*/}
        </div>
    );
};

export default Main;