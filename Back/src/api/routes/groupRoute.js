module.exports = (server) => {
    const groupController = require("../controllers/groupController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.post("/group/:userId", cors(), groupController.createGroup);

server.get("/groups", cors(), groupController.getAllGroups);

server.route("/groups/:groupId")
.all(cors())
.get(groupController.getGroupById)
.patch(jwtMiddleware.authenticate,groupController.addUsers)
.delete(jwtMiddleware.authenticate, groupController.deleteGroupById);

server.patch("/groups/:groupId/deleteUsers", jwtMiddleware.authenticate, cors(), groupController.deleteUsers)
}