import ChatRoom from "../models/chatRoomModel.js";

/**
 * Socket.IO chat — room keys, host approvals, in-memory messages, session end.
 * Legacy events: chat:* — also exposes join-room / send-message / leave-room aliases.
 */
const sessionMessages = new Map();

export function registerChatHandlers(io) {
  io.on("connection", (socket) => {
    const currentUserId = String(socket.user._id);
    socket.join(`user:${currentUserId}`);

    const emitToRoom = (key, event, payload) => {
      io.to(`room:${key}`).emit(event, payload);
    };

    const handleJoinRoom = async ({ key }) => {
      const room = await ChatRoom.findOne({ key });
      if (!room || !room.isActive) {
        return socket.emit("chat:error", "Room not found or already ended.");
      }

      const isHost = String(room.host) === currentUserId;
      const isAccepted = room.teamMembers.some(
        (m) => String(m.user) === currentUserId && m.status === "accepted"
      );

      if (!isHost && !isAccepted) {
        return socket.emit("chat:error", "Join request not accepted yet.");
      }

      socket.join(`room:${key}`);
      const history = sessionMessages.get(key) || [];
      socket.emit("chat:history", { key, messages: history });
      socket.emit("receive-message", { type: "history", key, messages: history });
    };

    const handleSendMessage = async ({ key, text }) => {
      if (!text?.trim()) return;

      const room = await ChatRoom.findOne({ key });
      if (!room || !room.isActive) return;

      const isHost = String(room.host) === currentUserId;
      const isAccepted = room.teamMembers.some(
        (m) => String(m.user) === currentUserId && m.status === "accepted"
      );
      if (!isHost && !isAccepted) return;

      const message = {
        sender: {
          _id: socket.user._id,
          name: socket.user.name,
          role: socket.user.role,
        },
        text: text.trim(),
        sentAt: new Date(),
      };

      const roomMessages = sessionMessages.get(key) || [];
      roomMessages.push(message);
      sessionMessages.set(key, roomMessages);

      const out = { key, message };
      emitToRoom(key, "chat:new-message", out);
      emitToRoom(key, "receive-message", { ...out, type: "message" });
    };

    socket.on("chat:request-join", async ({ key }) => {
      const room = await ChatRoom.findOne({ key, isActive: true });
      if (!room) {
        return socket.emit("chat:error", "Room not found or already ended.");
      }

      if (String(room.host) === currentUserId) {
        socket.join(`room:${key}`);
        return socket.emit("chat:join-approved", { key, host: true });
      }

      const member = room.teamMembers.find((m) => String(m.user) === currentUserId);
      if (!member) {
        return socket.emit(
          "chat:error",
          "You are not invited to this room. Ask host to add you first."
        );
      }

      if (member.status === "accepted") {
        socket.join(`room:${key}`);
        return socket.emit("chat:join-approved", { key });
      }
      if (member.status === "rejected") {
        return socket.emit("chat:join-rejected", { key });
      }

      io.to(`user:${String(room.host)}`).emit("chat:join-request", {
        key,
        memberId: currentUserId,
        memberName: socket.user.name,
      });
      socket.emit("chat:join-pending", { key });
    });

    socket.on("chat:respond-request", async ({ key, memberId, approve }) => {
      const room = await ChatRoom.findOne({ key, isActive: true });
      if (!room || String(room.host) !== currentUserId) return;

      const member = room.teamMembers.find((m) => String(m.user) === String(memberId));
      if (!member) return;

      member.status = approve ? "accepted" : "rejected";
      member.respondedAt = new Date();
      await room.save();

      io.to(`user:${String(memberId)}`).emit("chat:join-response", {
        key,
        approved: approve,
      });
    });

    socket.on("chat:join-room", handleJoinRoom);
    socket.on("join-room", handleJoinRoom);

    socket.on("chat:send-message", handleSendMessage);
    socket.on("send-message", handleSendMessage);

    socket.on("chat:end-session", async ({ key }) => {
      const room = await ChatRoom.findOne({ key });
      if (!room || String(room.host) !== currentUserId) return;

      room.isActive = false;
      room.endedAt = new Date();
      await room.save();
      sessionMessages.delete(key);

      emitToRoom(key, "chat:session-ended", { key });
      emitToRoom(key, "receive-message", { type: "session-ended", key });
    });

    const handleLeaveRoom = ({ key }) => {
      if (!key) return;
      socket.leave(`room:${key}`);
      socket.emit("left-room", { key });
    };
    socket.on("chat:leave-room", handleLeaveRoom);
    socket.on("leave-room", handleLeaveRoom);
  });
}
