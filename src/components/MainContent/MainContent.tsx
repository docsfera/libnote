import React from 'react';
import './Content.sass'
import MainNote from "../MainNote/MainNote";

const Content = () => {
    return (
        <div className='content'>
            <div className="books">
                <img src="./images/book1.png" alt="book1"/>
                <img src="./images/book2.png" alt="book2"/>
                <img src="./images/book3.png" alt="book3"/>
                <img src="./images/book4.png" alt="book4"/>
            </div>
            <input className="" type="text" placeholder="Create note"/>
            <MainNote date="21.06.2020" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat."/>
            <MainNote date="21.06.2020" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat."/>
            <MainNote date="21.06.2020" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat."/>
            <MainNote date="21.06.2020" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum volutpat orci turpis urna. Et vestibulum, posuere tortor lacinia sit. Sagittis porttitor orci auctor in at tincidunt arcu egestas. Fusce arcu sodales lacinia eu auctor nunc nam id. Diam sit sed volutpat massa. Egestas ornare vel volutpat."/>
        </div>

    );
};

export default Content;