import React, {useEffect, useRef} from 'react'
import "./PdfViewer.sass"
import {useLocation, useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
//import * as pdfDist from "pdfjs-dist"
const pdfjsLib = require("pdfjs-dist/build/pdf")
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer")


const GET_BOOK_BY_ID = gql`
    query getBookById($id: ID){
        getBookById(id: $id){
            id
         
        }
    }
`


const PdfViewer = () => {
    const {id} = useParams()
    const { state } = useLocation() //TODO: any
    const containerRef = useRef(null)
    const refPdfViewer = useRef(null)
    //const {data} = useQuery(GET_BOOK_BY_ID, {variables: {id}} )

    useEffect(() => {
        //window.addEventListener('scroll', scrollEvent) // срабатывал event при переходе на main
        if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
            alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
        }

        const container = containerRef.current

        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        const CMAP_URL = "node_modules/pdfjs-dist/cmaps/" //"pdfjs-dist/cmaps/"
        const CMAP_PACKED = true
        //let DEFAULT_URL = "../../files/somefile5.pdf"
        //console.log((data && data.getBookById) && `http://localhost:3000/files/${id}/${data.getBookById.name}`)
        let DEFAULT_URL = `http://localhost:3000/files/${id}/${state.name}`
        const SEARCH_FOR = ""; // try 'Mozilla'
        const eventBus = new pdfjsViewer.EventBus()

        // (Optionally) enable hyperlinks within PDF files.
        const pdfLinkService = new pdfjsViewer.PDFLinkService({
            eventBus: eventBus,
        });

// (Optionally) enable find controller.
        const pdfFindController = new pdfjsViewer.PDFFindController({
            eventBus: eventBus,
            linkService: pdfLinkService,
        });

        const pdfViewer = new pdfjsViewer.PDFViewer({
            //@ts-ignore
            container: container,
            eventBus: eventBus,
            linkService: pdfLinkService,
            findController: pdfFindController,
        });


        pdfLinkService.setViewer(pdfViewer);
// @ts-ignore
        refPdfViewer.current = pdfViewer

        eventBus.on("pagesinit", function () {
            // We can use pdfViewer now, e.g. let's change default scale.
            pdfViewer.currentScaleValue = "auto"; //

            // We can try searching for things.
            if (SEARCH_FOR) {
                //@ts-ignore
                pdfFindController.executeCommand("find", { query: SEARCH_FOR });
            }
        });

// Loading document.
        const loadingTask = pdfjsLib.getDocument({
            url: DEFAULT_URL,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        });
        loadingTask.promise.then(function (pdfDocument) {
            // Document loaded, specifying document for the viewer and
            // the (optional) linkService.
            pdfViewer.setDocument(pdfDocument)

            pdfLinkService.setDocument(pdfDocument, null)

            let numPages = pdfDocument.numPages // кол-во страниц

            pdfDocument.getPage(1).then(function (page) {
                console.log(page)

            })

        });






    }, [containerRef])



    return (
        <div ref={containerRef} id="viewerContainer">
            <div id="pageContainer" className="pdfViewer"></div>
        </div>
    );
};

export default PdfViewer;