import React from 'react';
import "./Aside.sass"
//import MyPageLogo from "./public/images/My Page.svg"
import Progress from "../Progress/Progress"
const Aside = () => {
    return (
        <aside className="aside">
            {/*<img className="aside-image" src={`${process.env.PUBLIC_URL}/images/aside.png`} alt=""/>*/}
            {/*<div className="user-info">*/}
            {/*    <img className="avatar" src={`${process.env.PUBLIC_URL}/images/avatar.png`} alt=""/>*/}
            {/*    <p className="email">vladimirks@gmail.com</p>*/}
            {/*    <Progress max={100} value={45}/>*/}



            {/*</div>*/}


        <p className="logo">Libnote</p>
        <div className="menu">
            <div className="menu-item"> <p className="name-menu-item main-item">Main</p> </div>
            <div className="menu-item"> <p className="name-menu-item book-item">Books</p> </div>
            <div className="menu-item"> <p className="name-menu-item note-item">Notes</p> </div>
            <div className="menu-item"> <p className="name-menu-item settings-item">Settings</p> </div>

        </div>

        </aside>
    );
};

export default Aside;