import {
  CreateLostForm,
  CreateLostFormBulk,
  GetLostForm,
} from "../controllers/LostFormController.js";

export const LostFormRouter = (app) => {
  app.use(function (req, res, next) {
    console.log("req", req.body);
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  console.log("hitted Lost Form Router ");
  app.get("/getLostForms", GetLostForm);

  app.post("/getLostForms", CreateLostForm);
  app.post("/lostFormBulkUpload", CreateLostFormBulk);
  //  app.post(
  //   "/pdfupload",
  //   UploadPdfFile
  //);
};
