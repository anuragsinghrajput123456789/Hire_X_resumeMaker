const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');

// @desc    Get user chats
// @route   GET /api/chats
// @access  Private
const getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(chats);
});

// @desc    Create new chat
// @route   POST /api/chats
// @access  Private
const createChat = asyncHandler(async (req, res) => {
  const { messages, title } = req.body;

  const chat = await Chat.create({
    user: req.user.id,
    title: title || 'New Chat',
    messages: messages || [],
  });

  res.status(201).json(chat);
});

// @desc    Update chat (add message)
// @route   PUT /api/chats/:id
// @access  Private
// @desc    Update chat (add message)
// @route   PUT /api/chats/:id
// @access  Private
const updateChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Check user ownership
  if (chat.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const { message, messages, title } = req.body;

  // Append new message(s) if provided
  if (messages && Array.isArray(messages)) {
      chat.messages.push(...messages);
  } else if (message) {
      chat.messages.push(message);
  }

  // Update title if provided (e.g., after first user message)
  if (title) {
      chat.title = title;
  }

  const updatedChat = await chat.save();
  res.json(updatedChat);
});

// @desc    Delete chat
// @route   DELETE /api/chats/:id
// @access  Private
const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Check user ownership
  if (chat.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await chat.deleteOne();
  res.json({ id: req.params.id });
});

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Private
const getChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id);
  
    if (!chat) {
      res.status(404);
      throw new Error('Chat not found');
    }
  
    if (chat.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
  
    res.json(chat);
  });

module.exports = {
  getUserChats,
  createChat,
  updateChat,
  deleteChat,
  getChat,
};
