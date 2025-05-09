const Account = require("../models/Account");
const Chat = require("../models/Chat");
const Friend = require("../models/Friend");

const chatSocket = (io, socket) => {
  socket.on("sent-message", async (data) => {
    try {
      const createMessage = await Chat.create({
        name_sent: data.name_sent,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        name_receiver: data.name_receiver,
        message: data.message,
      });

      io.emit("conversation-updated", createMessage);
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", {
        message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
      });
    }
  });

  socket.on("add-friend", async (data) => {
    const query = await Friend.findOne({
      $or: [
        {
          id_user_1: String(socket.user._id),
          id_user_2: data.id,
        },
        {
          id_user_1: data.id,
          id_user_2: String(socket.user._id),
        },
      ],
    });
    if (query) {
      return;
    }

    const checkExit = await Account.findOne({
      _id: data.id,
    });
    if (checkExit) {
      const new_record = await Friend.create({
        id_user_1: socket.user._id,
        email_user_1: socket.user.email,
        name_user_1: socket.user.name,
        id_user_2: checkExit._id,
        email_user_2: checkExit.email,
        name_user_2: checkExit.name,
      });
      io.emit("update-friend", new_record);
    } else {
      return;
    }
  });

};
module.exports = { chatSocket };
