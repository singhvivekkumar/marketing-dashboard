const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

// ─── Storage engine ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set req.uploadFolder in your route BEFORE multer runs
    // e.g. router.post('/', (req,_,next) => { req.uploadFolder='bq'; next(); }, upload.single(...))
    const folder = req.uploadFolder || 'misc';
    const dir = path.join(__dirname, '../../uploads', folder);

    // Create folder if it doesn't exist
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Unique filename: epoch + random hex + original extension
    const ext    = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    cb(null, unique + ext);
  },
});

// ─── File type whitelist ──────────────────────────────────────────────────────
const ALLOWED_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Word (.doc/.docx), JPG, and PNG files are allowed.'), false);
  }
};

// ─── Export configured multer instance ───────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 20) * 1024 * 1024,
  },
});

module.exports = upload;
