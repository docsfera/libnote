import React from 'react'
import "./Books.sass"
import Header from "../Header/Header";

const Books = () => {
    return (
        <div>
            <Header/>

            <form encType="multipart/form-data" method="POST" action="/" >
                <input type="file" name="file"/>
                <input type="submit" value="uload"/>
            </form>

                
        </div>
    );
};

export default Books;