// multer from v8
const multer=require('multer');
const { v4: uuidv4}=require('uuid');
// include path for extracting extension of uploaded file
const path=require('path');

// these syntex code is available in multer js in npm website
// code from yt
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './public/images/uploads')
    },
    filename: function(req,file,cb){
        const uniqueFilename = uuidv4();
        cb(null, uniqueFilename + path.extname(file.originalname));//combining uniquefilename and uploaded file's extension(eq- .png/.pdf/..)
    }
});
// code from npm website
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)//it used for creating a unique number by using Math 
//       cb(null, file.fieldname + '-' + uniqueSuffix) //// to combine uplaoded filename with above unique value to generate unqiue filename or just use uuid package as above
//     }
// })

const upload = multer({ storage: storage });
module.exports=upload;
