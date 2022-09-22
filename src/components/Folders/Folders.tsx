import React from 'react';
import "./Folders.sass"

const Folders = () => {
    return (
        <div className="folders-section">
            <p className="name-section">Папки</p>
            <p className="section-count">Всего 6 папок</p>
            <div className="folders">
                <div className="folder">
                    <div className="folder-info">
                        <div className="folder-count">155</div>
                        <div className="folder-settings">
                            <div className="oval"> </div>
                            <div className="oval"> </div>
                            <div className="oval"> </div>
                        </div>
                    </div>
                    <img src={`${process.env.PUBLIC_URL}/images/folder.svg`} alt="" className="folder-image"/>
                    <p className="folder-name">Неотсортированные</p>

                </div>
                <div className="folder"></div>
                <div className="folder"></div>
                <div className="folder"></div>
            </div>
        </div>
    );
};

export default Folders;