const multer = require("multer");

const stroageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "/uploads");
	},
	filename: (req, file, cb) => {
		const suffix = Date.now();
		cb(null, suffix + "$" + file.originalname);
	},
});

const uploads = multer({storage: stroageEngine});

module.exports = uploads;
