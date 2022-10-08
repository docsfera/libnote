import React, {useEffect, useRef} from 'react'
import "./PdfViewer.sass"
//import * as pdfDist from "pdfjs-dist"
const pdfjsLib = require("pdfjs-dist/build/pdf")
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer")

const PdfViewer = () => {
    const containerRef = useRef(null)
    const refPdfViewer = useRef(null)

    useEffect(() => {
        //window.addEventListener('scroll', scrollEvent) // срабатывал event при переходе на main
        if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
            alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
        }

        const container = containerRef.current

        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        const CMAP_URL = "node_modules/pdfjs-dist/cmaps/" //"pdfjs-dist/cmaps/"
        const CMAP_PACKED = true
        let DEFAULT_URL = "somefile5.pdf"
        //let DEFAULT_URL = `http://localhost:3000/somefile5.pdf`
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
            console.log(numPages)

            // pdfDocument.getPage(1).then(function (page) {
            //     console.log(page)
            // })

        });




    }, [containerRef])



    return (
        <div ref={containerRef} id="viewerContainer">
            <div id="pageContainer" className="pdfViewer"></div>
        </div>
    );
};

export default PdfViewer;