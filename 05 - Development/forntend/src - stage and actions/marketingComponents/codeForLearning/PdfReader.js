import { useState, useEffect } from "react";
import { Button, DialogContent, Dialog } from "@mui/material";
import axios from "axios";

export function ListofCorrections(props) {
    const { serverIp, documentsData} = props;
  const [Dopen, SetDopen] = useState(false);
  const [dialogdata, setdialogData] = useState([]);
  const [pdfInfoPathC, SetpdfInfoPathC] = useState([]);

  
  var DOC_ENDPOINT = "/getannotation";
  // var FetchandPostUrl = "http://192.168.0.20:8081" + DOC_ENDPOINT
  var FetchAndUrl = "http://127.0.0.1:8081" + DOC_ENDPOINT;

  useEffect(() => {
    axios
      .get(FetchAndUrl)
      .then((response) => {
        if (response.data !== undefined) {
            setdialogData(response.data.data);
        }
        console.log("document data : ", response.data)
      })
      .catch((err) => {
        console.log("No name of pdf", err)
      });
  }, []);

  function pdfFileOpen(e) {
    const selectedOption = dialogdata.filter((item) => {
      // console.log(item.Periodicity )  ///peridicocity
      return parseInt(item.id) === parseInt(e.target.id);
    });

    // console.log("selectedOptionselectedOption", selectedOption)

    SetpdfInfoPathC(selectedOption);

    SetDopen(true);
  }


  function closeHandle() {
    SetDopen(false);
  }

  return (
    <Dialog open={Dopen} fullScreen>
      {pdfInfoPathC[0] !== undefined && (
        <DialogContent>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#536e99",
              justifyContent: "space-between",
              display: "flex",
              paddingBottom: "1rem",
            }}
          >
            <div></div>
            <div>
              <h4 style={{ color: "white", textAlign: "center" }}>
                {pdfInfoPathC[0].PdfName}
              </h4>
            </div>
            <div style={{ textAlign: "right", color: "white" }}>
              <Button
                onClick={closeHandle}
                style={{ backgroundColor: "gray", color: "black" }}
              >
                X
              </Button>
            </div>
          </div>
          <br></br>
          <CustomPdfReaderfromServer
            HardDiskFileName={pdfInfoPathC[0].PdfPath}
            ServerIp={ServerIp}
          ></CustomPdfReaderfromServer>
        </DialogContent>
      )}
    </Dialog>
  );
}

// To display supportdata in pdf format
export function CustomPdfReaderfromServer(props) {
  const [url, setUrl] = useState("");
  // console.log("props.SingleFileData", props.SingleFileData[0].id)
  //const videopathpath=useState(props.path + "/"+ props.file);
  var API = "/pdf";
  var FetchPdfURL = props.ServerIp + API;

  //var FetchPdfURL = "http://127.0.0.1:5142" + API

  useEffect(() => {
    const fetchData = () => {
      let pathUpdated = [];
      pathUpdated.push(props.HardDiskFileName);
      //console.log("videopathpath",videopathpath,pathUpdated)

      fetch(FetchPdfURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pathUpdated),
      })
        .then((response) => {
          if (!response.ok) {
            //throw new Error("Network response was not ok");
            console.error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          setUrl(URL.createObjectURL(blob));
        })
        .catch((error) => {
          console.error("Error fetching pdf:", error);
        });
    };

    const timerId = setTimeout(fetchData, 100); // Delay execution by 500ms

    return () => clearTimeout(timerId); // Cleanup function
  }, [props.HardDiskFileName]);

  return (
    <>
      {/* <h2></h2> */}

      <hr></hr>

      <div>
        {url && (
          <object
            data={url}
            type="application/pdf"
            width="100%"
            height="1000px" // Adjust the height as needed
          ></object>
        )}
      </div>
    </>
  );
}
