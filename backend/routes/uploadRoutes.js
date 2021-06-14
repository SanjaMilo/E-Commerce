import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// config
// initialize storage engine 
// cb stands for call back
// null -> because there is no error
// for the extension (jpg, png) we are going to get the extension of the actual file and we are going to use the path module of Node.js. Path has a method on it, .extname that gets the extension of a filename
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
  });

function checkFileType(file, cb) {
    // create an expression with the file types we want
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // this test will give us a true or false
    const mimetype = filetypes.test(file.mimetype);
    
    if(extname && mimetype) {
        return cb(null, true) 
    } else {
        cb('Images only!')
    }
};

// pass in a middleware to our route
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
    }
});


// create the route for the end point 
// this uploadRoutes.js file will be connected to /api/upload 
// as a second argument we are passing middleware upload.single for a single upload image, and call it 'image' 
router.post('/', upload.single('image'), (req, res) => {
   res.send(`/${req.file.path}`);  // we are going to send back from this route, the path
});


export default router;
