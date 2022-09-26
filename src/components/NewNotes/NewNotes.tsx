import React from 'react';
import "./NewNotes.sass"

const NewNotes = () => {
    return (
        <div className="notes-section">
            <p className="name-section">Заметки</p>
            <p className="section-count">Всего 216 заметок</p>
            <div className="notes">
                <div className="note">
                    <div className="note-info">
                        <p className="note-name">Note Name</p>
                        <p className="note-book">Старый Шлюпик</p>
                    </div>
                    <p className="note-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat
                        orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor
                        orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc
                        nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat.
                    </p>
                    <p className="note-time">21.06.2020</p>
                </div>
                <div className="note">
                    <div className="note-info">
                        <p className="note-name">Note Name</p>
                        <p className="note-book">Старый Шлюпик</p>
                    </div>
                    <p className="note-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat
                        orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor
                        orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc
                        nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat.
                    </p>
                    <p className="note-time">21.06.2020</p>
                </div>
                <div className="note">
                    <div className="note-info">
                        <p className="note-name">Note Name</p>
                        <p className="note-book"> </p>
                    </div>
                    <p className="note-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat
                        orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor
                        orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc
                        nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat.
                    </p>
                    <p className="note-time">21.06.2020</p>
                </div>

            </div>
        </div>
    );
};

export default NewNotes;