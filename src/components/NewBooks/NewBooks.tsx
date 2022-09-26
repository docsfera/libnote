import React, {useEffect, useRef, useState} from 'react';
import "./NewBooks.sass"

const NewBooks = () => {
    let [position, setPosition] = useState(0)
    let imageCount = 9
    const gg = useRef(null)
    const minBtn = useRef(null)
    const plusBtn = useRef(null)
    const imageSection = useRef(null)
    const imageWidth = 155

    //const [minIsDisabled, setMinIsDisabled] = useState(true)
    //const [plusIsDisabled, setPlusIsDisabled] = useState(false);

    const min = () => {
        let newPosition = position - imageWidth
        checkBtns(newPosition)
        setPosition(newPosition)
        console.log(newPosition)
        //@ts-ignore
        gg.current.style = `transition: 0.5s; transform:translateX(-${newPosition}px)`
    }

    const plus = () => {
        let newPosition = position + imageWidth
        checkBtns(newPosition)
        setPosition(newPosition)
        //@ts-ignore
        gg.current.style = `transition: 0.5s; transform: translateX(-${newPosition}px)`
    }

    const checkBtns = (position: number) => {
        //@ts-ignore
        console.log(imageSection.current.offsetWidth);
        //@ts-ignore
        (position === 0) ? minBtn.current.style.display = "none" : minBtn.current.style.display = "block";
        //@ts-ignore
        console.log(imageSection.current.offsetWidth, imageWidth * imageCount)
        //@ts-ignore
        if(imageSection.current.offsetWidth > imageWidth * imageCount){

            //@ts-ignore
            plusBtn.current.style.display = "none"
        }else{
            //@ts-ignore
            (position >= (imageCount - 6) * imageWidth) ?  plusBtn.current.style.display = "none" : plusBtn.current.style.display = "block"
        }

    }
    useEffect(() => checkBtns(0),
        //@ts-ignore
        [])

    return (
        <div className="folders-section" ref={imageSection}>
            <p className="name-section">Книги</p>
            <p className="section-count">Всего 8 книг</p>
            <div className="folders">
                <button  className="min" onClick={min} ref={minBtn}/*disabled={minIsDisabled}*/> </button>
                <div className="folders-container">

                    <div ref={gg} className="itemser">

                        <img src="/images/book1.png" alt="" className="image"/>
                        <img src="/images/book2.png" alt="" className="image"/>
                        <img src="/images/book3.png" alt="" className="image"/>
                        <img src="/images/book4.png" alt="" className="image"/>
                        <img src="/images/book5.png" alt="" className="image"/>
                        <img src="/images/book6.png" alt="" className="image"/>
                        <img src="/images/book7.png" alt="" className="image"/>
                        <img src="/images/book4.png" alt="" className="image"/>
                        <img src="/images/book5.png" alt="" className="image"/>

                        

                    </div>

                </div>
                <button className="plus" onClick={plus} ref={plusBtn}/*disabled={plusIsDisabled}*/> </button>
            </div>
        </div>
    );

};

export default NewBooks;