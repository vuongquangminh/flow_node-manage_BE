const { prisma } = require("../config/db");

const chatSocket = (io, socket) => {
  socket.on("sent-message", async (data) => {
    try {
      const createMessage = await prisma.chat.create({
        data: {
          name_sent: data.name_sent,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          name_receiver: data.name_receiver,
          message: data.message,
        },
      });
      io.emit("conversation-updated", createMessage);
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", { message: "Có lỗi xảy ra khi cập nhật dữ liệu flow" });
    }
  });

  socket.on("add-friend", async (data) => {
    const userId = socket.user.id;

    const existing = await prisma.friend.findFirst({
      where: {
        OR: [
          { id_user_1: userId, id_user_2: data.id },
          { id_user_1: data.id, id_user_2: userId },
        ],
      },
    });
    if (existing) return;

    const targetAccount = await prisma.account.findUnique({ where: { id: data.id } });
    if (!targetAccount) return;

    const newRecord = await prisma.friend.create({
      data: {
        id_user_1: userId,
        email_user_1: socket.user.email,
        name_user_1: socket.user.name,
        id_user_2: targetAccount.id,
        email_user_2: targetAccount.email,
        name_user_2: targetAccount.name,
      },
    });
    io.emit("update-friend", newRecord);
  });
};

module.exports = { chatSocket };
