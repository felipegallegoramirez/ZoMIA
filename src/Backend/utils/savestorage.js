const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { name} = req.body;
      cb(null, `${__dirname}/../storage/${name}`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
  })


  
  const uploadvideo = multer({ storage: storage })

  module.exports = { uploadvideo };