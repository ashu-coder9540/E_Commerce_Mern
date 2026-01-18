const api = require("express").Router();
const userController = require("../controller/user");
const adminController = require("../controller/admin");
const uploads = require("../middleware/multer");
const auth = require("../middleware/auth");

api.get("/", (req, res) => {
  res.send("Hello Backend");
});
api.post("/regdata", userController.regDataController)
api.post("/loginuser", userController.loginDataController)
api.post("/addadminproduct", uploads.single("image"), adminController.addadminproductController)
api.get("/getProduct", adminController.getAllProductsController)
api.delete("/productdelete/:id", adminController.deleteProductController)
api.get("/editvaluedata/:abc", adminController.editValueDataController)
api.put("/updateProduct/:id", adminController.updateProductController)
api.get("/userProducts", userController.userProductsDataController)
api.post("/userquery", userController.userQueryController)
api.get("/userallquery", adminController.userAllQueryController)
api.delete("/deleteQuery/:abc",adminController.deleteQueryController)
api.get("/querysingledata/:abc", adminController.queryDataController)
api.post("/mailreply/:abc", adminController.mailReplyController)
api.post("/cart/save", auth, userController.saveCartController)
api.get("/cart/:userId", auth, userController.fetchCartController);
api.get("/search",userController.searchController)

module.exports = api;