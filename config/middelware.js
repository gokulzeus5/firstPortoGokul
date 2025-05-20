const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Dynamic storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;

    if (file.fieldname === 'profileImage') {
      uploadDir = path.join(__dirname, '../public/uploads');
    } else {
      uploadDir = path.join(__dirname, '../public/uploads/projects');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Upload config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Exports
const uploadProfile = upload.single('profileImage');

const uploadProjects = upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]);

module.exports = { uploadProfile, uploadProjects };
