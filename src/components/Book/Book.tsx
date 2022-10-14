import React, {useRef} from 'react'
import "./Book.sass"

type BookType = {
    name: string
    pimp: any
    imageName: string
}



const Book: React.FC<BookType> = (props) => {

    // const refCanvas = useRef(null)
    //
    // if(refCanvas && refCanvas.current){
    //     setRefences()
    // }

    return (
        <div className="book" onClick={() => props.pimp(props.name)}>
            <img src={`/files/1/${props.imageName}`} alt="" className="image"/>
            <p className="book-name">{props.name}</p>
        </div>
    );
};

export default Book;