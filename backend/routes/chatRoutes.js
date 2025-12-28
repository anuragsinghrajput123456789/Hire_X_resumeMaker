const express = require('express');
const router = express.Router();
const {
  getUserChats,
  createChat,
  updateChat,
  deleteChat,
  getChat,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserChats).post(protect, createChat);
router.route('/:id').delete(protect, deleteChat).put(protect, updateChat).get(protect, getChat);

module.exports = router;
