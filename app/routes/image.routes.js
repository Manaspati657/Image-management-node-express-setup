const authJwt = require("../middleware/authJwt");
const imageController = require('../controllers/image.controller');
const upload =require("../helper/file-upload");
module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
      app.post("/api/image/upload",[authJwt.verifyToken,upload], imageController.upload);
      app.post("/api/image/getAll",imageController.getAll);
      app.post("/api/image/remove",[authJwt.verifyToken],imageController.remove);
      app.post("/api/user/images",[authJwt.verifyToken],imageController.userImages);

};