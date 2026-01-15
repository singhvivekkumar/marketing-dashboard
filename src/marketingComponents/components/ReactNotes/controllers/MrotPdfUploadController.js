import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"
import db from "../models/index.js";
const MrotPdfUpload = db.MrotPdfUpload;

// Right it acc

export const GetMrotPdfUploadData = (request, response) => {

  console.log("Mrot Pdf view Data from Table");
  MrotPdfUpload.findAll({
    raw: true,
  })
    .then((data) => {


      //console.log("Mrot Pdf view Data", data);
      response.json({ data });
    })
    .catch((err) => {
      console.log(err); //read from CSV

      response.json({ "data": "No data found" });
    })


};

export const CreateMrotPdfUploadData = (req, res) => {
  console.log(" CreateMrotPdfUpload service called for req.body.id");

  if (req.body.UserID != null) {
    const Annodata = {
      UserID: req.body.UserID,
      UserName: req.body.UserName,
      FileName: req.body.FileName,
      FilePath: req.body.FilePath,
      HardDiskFileName: req.body.HardDiskFileName,
      Type: req.body.Type,
      CreatedDate: req.body.CreatedDate,


    };

    // Save Profile in the database
    MrotPdfUpload.create(Annodata)
      .then((data) => {
        res.send(data);
        console.log("Success");
        // res.send(data);
      })
      .catch((err) => {
        console.log("Error while saving");
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the PDF.",
        });
      });
  }
  else {
    res.status(500).send({
      message: "Some error occurred while creating the PDF.",
    });
  }

};


const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {

    // cb(null, Date.now() + '-' + file.originalname)
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // set file size limit to 1000 MB
});

export const UploadPdfFile = (req, res) => {

  console.log(" UploadPdfFile into Harddisk");

  {
    const __dirname = path.resolve();
    let UPLOADS_DIR = path.join(__dirname, "uploads");
    upload.single('video')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("Error 2", err);
        res.status(500).json({ error: err });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log("Error 1", err);
        res.status(500).json({ error: err });
      } else {
        const now = new Date(Date.now());
        const dateString = now.toString();
        // Everything went fine.
        const filename = req.file.filename;
        res.status(200).json({ message: 'File uploaded successfully', filename: filename, time: dateString, path: UPLOADS_DIR });

      }
    });
  }

};

export const GetAllPdfFile = (req, res) => {


  console.log("GetAllPdfFile from HARDDISK")
  const __dirname = path.resolve();
  let UPLOADS_DIR = path.join(__dirname, "uploads");

  // Get a list of all files in the upload directory
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to retrieve videos' });
    }

    // Filter the list of files to only include video files
    let FileName = []
    const videoFiles = files.filter(file => {


      const ext = path.extname(file).toLowerCase();
      return ext === '.pdf';
    });

    // Send the list of video files as a JSON response


    res.json({ videos: videoFiles, path: UPLOADS_DIR });
  });
};

export const PlayPdfFile = (req, res) => {


  console.log("PlaypdfFile", req.body[0]);
  if (req.body[0] === null || req.body[0] != undefined) {

    const videoPath = req.body[0];
    const videoSize = fs.statSync(videoPath).size;
    const videoStream = fs.createReadStream(videoPath);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': videoSize
    });
    videoStream.pipe(res);


  }

};

export const DeletePdfFile = (req, res) => {


  if (req.body[0] === null || req.body[0] != undefined) {

    console.log("req.body from DeletePdfFile", req.body[0])
    const videoPath = req.body[0]; // path to the pdf file
    var HardDiskFileName = videoPath.split("\\").pop();
    console.log("HardDiskFileName", HardDiskFileName)
    fs.unlink(videoPath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete pdf' });
      } else {

        MrotPdfUpload.destroy({
          where: { HardDiskFileName: HardDiskFileName },
        })
          .then((num) => {
            if (num == 1) {
              res.json({ message: `Pdf  deleted successfully` });
            } else {
              res.status(500).json({ error: 'Failed to delete pdf' });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: 'Failed to delete pdf' });
          });


      }
    });

  }

};

export const DownloadPdfFile = (req, res) => {


  if (req.body[0] === null || req.body[0] != undefined) {

    const videoPath = req.body[0]; // path to the video file
    res.sendFile(videoPath);

  }

};

export const PlayPdfFileWithExtraPath=(req, res)=>{

  
  console.log("PlayPdfFileWithExtraPath", req.body[0]);
  if (req.body[0] === null || req.body[0] != undefined) {
    
    // const __dirname = path.resolve();
    // let SEARCH_DIR = path.join(__dirname, "mrotalldata");
    // const videoPath =SEARCH_DIR+"\\"+ req.body[0];

    // const videoSize = fs.statSync(videoPath).size;
    // const videoStream = fs.createReadStream(videoPath);
    // res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    //   'Content-Length': videoSize
    // });
    // videoStream.pipe(res);




    try {
      // Construct the absolute path to the PDF file
      const __dirname = path.resolve();
      let SEARCH_DIR = path.join(__dirname, "mrotalldata");
      const filePath = path.join(SEARCH_DIR, req.body[0]);
      console.log("filePath",filePath)
  
      // Check if the file exists before attempting to read it
      if (fs.existsSync(filePath)) {
          const fileStats = fs.statSync(filePath);
  
          // Ensure that the file is not a directory
          if (fileStats.isFile()) {
              // Create a readable stream for the file
              const fileStream = fs.createReadStream(filePath);
  
              // Set response headers
              res.writeHead(200, {
                  'Content-Type': 'application/pdf',
                  'Content-Length': fileStats.size
              });
  
              // Pipe the file stream to the response object
              fileStream.pipe(res);
          } else {
              // Handle the case where the path points to a directory
              console.error("Error: The specified path is  not Configured.");
              res.status(400).send("The specified path is  not Configured.");
          }
      } else {
          // Handle the case where the file does not exist
          console.error("Error: The specified file does not exist.");
          res.status(404).send("The specified file does not exist.");
      }
  } catch (error) {
      // Handle other errors such as permission issues or unexpected errors
      console.error("Error:", error.message);
      res.status(500).send("Internal server error.");
  }



  }



  
};
