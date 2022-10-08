import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Aside from "./components/Aside/Aside"
import Main from "./components/Main/Main"
import Books from "./components/ Books/Books";
import Notes from "./components/Notes/Notes";
import NoteCreator from "./components/NoteCreator/NoteCreator";
import FolderNotes from "./components/FolderNotes/FolderNotes";
import PdfViewer from "./components/PdfViewer/PdfViewer";


function App() {
  return (
    <div className="App">
      <Aside/>
        <Routes>
            <Route path='/' element={<Main />}/>
            <Route path='/books' element={<Books />}/>
            <Route path='/notes' element={<Notes />}/>
            <Route path='/pdf-viewer' element={<PdfViewer />}/>
            <Route path='/note-creator' element={<NoteCreator />}/>
            <Route path='/note-creator/:id' element={<NoteCreator />}/>
            <Route path='/folder-notes/:id' element={<FolderNotes />}/>

        </Routes>

    </div>
  );
}

export default App;
