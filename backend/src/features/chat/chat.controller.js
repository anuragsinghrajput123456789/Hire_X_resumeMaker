const asyncHandler = require('express-async-handler');
const ChatService = require('./chat.service');

const getUserChats = asyncHandler(async (req, res) => {
  const chats = await ChatService.getUserChats(req.user.id);
  res.json(chats);
});

const createChat = asyncHandler(async (req, res) => {
  const chat = await ChatService.createChat(req.user.id, req.body);
  res.status(201).json(chat);
});

const updateChat = asyncHandler(async (req, res) => {
  const updatedChat = await ChatService.updateChat(req.user.id, req.params.id, req.body);
  res.json(updatedChat);
});

const deleteChat = asyncHandler(async (req, res) => {
  await ChatService.deleteChat(req.user.id, req.params.id);
  res.json({ id: req.params.id });
});

const getChat = asyncHandler(async (req, res) => {
  const chat = await ChatService.getChat(req.user.id, req.params.id);
  res.json(chat);
});

module.exports = {
  getUserChats,
  createChat,
  updateChat,
  deleteChat,
  getChat,
};
