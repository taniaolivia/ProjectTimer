module.exports = (server) => {
    const groupController = require("../controllers/groupController");
    const cors = require('cors');

server.post("/group/:userId", cors(), groupController.createGroup);

server.get("/groups", cors(), groupController.getAllGroups);

server.route("/groups/:groupId")
.all(cors())
.get(groupController.getGroupById)
.patch(groupController.addUser)
.delete(groupController.deleteGroupById);

}