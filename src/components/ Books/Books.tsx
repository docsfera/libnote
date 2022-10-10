import React, {useCallback} from 'react'
import "./Books.sass"
import Header from "../Header/Header";
import {gql, useMutation, useQuery} from "@apollo/client"
import {useDropzone} from 'react-dropzone'
import {useNavigate} from "react-router-dom"

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
        }
    }
`

const Books: React.FC<BooksType> = (props) => {
    const navigate = useNavigate()
    const [mut] = useMutation(GG)
    const {data} = useQuery(GET_ALL_BOOKS, {variables:{userid: "1"}})

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

    return (

        // <div {...getRootProps()}>
        //     <input {...getInputProps()} />
        //     {
        //         isDragActive ?
        //             <p>Drop the files here ...</p> :
        //             <p>Drag 'n' drop some files here, or click to select files</p>
        //     }
        // </div>

        <div>
            <Header/>
            {/* TODO: Как послать дополнительную информацию через form??*/}
            <form encType="multipart/form-data" method="POST" action="/" onChange={(e) => e.preventDefault()} >
                <input type="file" name="file" accept="application/pdf"/>
                <input type="text" name="text" value="1"/>
                <input type="submit" value="upload"/>
            </form>



           <input type="file" multiple required onChange={(e) => onChange(e)} />;


            {data ? data.getAllBooks.map((i:any) => <p onClick={() => pimp(i.name)}>{i.name}</p>) : <p>none</p>}

        </div>
    );
};

export default Books;