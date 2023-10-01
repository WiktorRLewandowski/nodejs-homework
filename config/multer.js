const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: 'tmp',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + '-' + path.extname(file.originalname))
    },
    limits: {
        fileSize: 1048576,
    }
})

// const fileFilter = (req, file, cb) => {
//         if (file.mimetype.substring(0, 'image'.length) === 'image'){
//           cb(null, true);
//         } else { 
//           cb(null, 'Wrong file type');
//         }
// }

const upload = multer({ storage })

module.exports = upload