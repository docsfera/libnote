import React, {useCallback, useEffect, useRef, useState} from 'react'
import "./Books.sass"
import Header from "../Header/Header";
import {gql, useMutation, useQuery} from "@apollo/client"
import {useDropzone} from 'react-dropzone'
import {useNavigate} from "react-router-dom"
import Book from "../Book/Book";
import html2canvas from "html2canvas"
//@ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

const pdfjsLib = require("pdfjs-dist/build/pdf")
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer")

type BooksType = {
    user: any
}

const GG = gql`
    mutation downloadBook($file: Upload!){
        downloadBook(file: $file){
            id
        }
    } 
`
const GET_ALL_BOOKS = gql`
    query getAllBooks($userid: ID){
        getAllBooks(userid: $userid){
            id
            name
            image
        }
    }
`

const SAVE_BASE_64 = gql`
    mutation($base64: String, $bookId: ID){
        saveBase64(base64: $base64, bookId: $bookId) {
            id
            
        }
    }

`


const Books: React.FC<BooksType> = (props) => {
    const navigate = useNavigate()
    const [mut] = useMutation(GG)
    //const [refences, setRefences] = useState([])
    const {data, refetch} = useQuery(GET_ALL_BOOKS, {variables:{userid: "1"}, pollInterval: 500})
    const [saveBase64] = useMutation(SAVE_BASE_64)

    const refCanvas = useRef(null)

    useEffect(() => {
        if(data && data.getAllBooks) {
            console.log(data.getAllBooks)
            data.getAllBooks.map((i: any, index: any) => {
                if (!i.image) {
                    let bookUrl = `http://localhost:3000/files/1/${i.name}`

                    setCanvas(refCanvas, bookUrl, i.id)
                }
            })
        }
    }, [data, refCanvas])

    const setCanvas = (refCanvas: any, bookUrl: string, bookId: string) => {
        //console.log('here', bookId)
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        let loadingTask = pdfjsLib.getDocument(bookUrl)

        loadingTask.promise.then((pdfDocument: any) => {
            //console.log('here1')
            pdfDocument.getPage(1).then((page: any) => {
                //console.log('here2')
                let scale = 555
                let viewport = page.getViewport(scale)
                let canvas = refCanvas.current
                if (canvas) {
                    //console.log('here3')
                    let context = canvas.getContext('2d');
                    // context.scale(1, -1);
                    // context.translate(0, -canvas.height);
                    //contexts.push(context)

                    viewport.height = canvas.height
                    viewport.width = canvas.width

                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    }

                    let renderTask = page.render(renderContext);
                    renderTask.promise.then(async () => {
                        //console.log('Page rendered')
                        let base64image = canvas.toDataURL("image/png")
                        await saveBase64({variables: {base64: base64image, bookId: bookId} })
                        // html2canvas(document.getElementById("pageContainer")).then((canvas) => {
                        //     let base64image = canvas.toDataURL("image/png")
                        // })
                    })
                }
            })
        })
    }

    const onDrop =  useCallback(async acceptedFiles =>  {
        let file = acceptedFiles[0]
        console.log(file)
        await mut({variables: {file} })
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    // @ts-ignore

    function onChange(e) {
        const file = e.target.files[0]
        mut({variables: {file} })
    }

    const pimp = (name: string) => {
        navigate('../pdf-viewer/1', {state: {name}})
    }

    const uploadFile = (file: any) => {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('userId', "1")
        console.log(file)
        fetch('/', {
            method: 'POST',
            body: formData
        })
            .then((e) => console.log('then'))
            .catch((e) => console.log('catch', e))
    }

    const changeUploadFile = (e: any) => {
        e.preventDefault()
        if(e.dataTransfer){
            if(e.dataTransfer.files[0].type === "application/pdf"){
                uploadFile(e.dataTransfer.files[0])
            }else{
                (dropArea && dropArea.current) && dropArea.current.classList.add('error')
            }
        }else{
            uploadFile(e.target.files[0])
        }
    }

    const dropArea = useRef<HTMLDivElement>(null)

    const go = () => (dropArea && dropArea.current) && dropArea.current.classList.add('highlight')
    const gone = () => (dropArea && dropArea.current) && dropArea.current.classList.remove('highlight')

    return (
        <div>
            <Header/>
            <div className="books">
                {data && data.getAllBooks.map((i:any) => <Book name={i.name} pimp={pimp} imageName={i.image}/>)}
                <div id="drop-area"
                     ref={dropArea}
                     onDragEnter={go}
                     onDragOver={go}
                     onDragLeave={gone}
                     onDrop={(e) => {gone(); changeUploadFile(e)}}>

                    <input type="file" id="fileElem" accept="application/pdf" onChange={(e) => changeUploadFile(e)}/>
                </div>
            </div>

            <canvas ref={refCanvas} width="570" height="760" className="canvas"></canvas>

        </div>
    );
};

export default Books