const Chat = require('../../../models/Chat');

class ChatService {
  static async getUserChats(userId) {
    return await Chat.find({ user: userId }).sort({ updatedAt: -1 });
  }

  static async createChat(userId, { messages, title }) {
    return await Chat.create({
      user: userId,
      title: title || 'New Chat',
      messages: messages || [],
    });
  }

  static async updateChat(userId, id, { message, messages, title }) {
    const chat = await Chat.findById(id);

    if (!chat) {
      const error = new Error('Chat not found');
      error.statusCode = 404;
      throw error;
    }

    if (chat.user.toString() !== userId.toString()) {
      const error = new Error('User not authorized');
      error.statusCode = 401;
      throw error;
    }

    if (messages && Array.isArray(messages)) {
      chat.messages.push(...messages);
    } else if (message) {
      chat.messages.push(message);
    }

    if (title) {
      chat.title = title;
    }

    return await chat.save();
  }

  static async deleteChat(userId, id) {
    const chat = await Chat.findById(id);

    if (!chat) {
      const error = new Error('Chat not found');
      error.statusCode = 404;
      throw error;
    }

    if (chat.user.toString() !== userId.toString()) {
      const error = new Error('User not authorized');
      error.statusCode = 401;
      throw error;
    }

    await chat.deleteOne();
    return true;
  }

  static async getChat(userId, id) {
    const chat = await Chat.findById(id);

    if (!chat) {
      const error = new Error('Chat not found');
      error.statusCode = 404;
      throw error;
    }

    if (chat.user.toString() !== userId.toString()) {
      const error = new Error('User not authorized');
      error.statusCode = 401;
      throw error;
    }

    return chat;
  }
}

module.exports = ChatService;
