const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

/**
 * Generates JWT authentication token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Service handling User Authentication operations
 */
class AuthService {
  static async registerUser({ name, email, password }) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password) {
      const error = new Error('Please add all fields');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      const error = new Error('An account with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    if (user) {
      return {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        token: generateToken(user._id),
      };
    } else {
      const error = new Error('Invalid user data');
      error.statusCode = 400;
      throw error;
    }
  }

  static async loginUser({ email, password }) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      const error = new Error('Please add email and password');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        token: generateToken(user._id),
      };
    } else {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
  }

  static async getMe(user) {
    return user;
  }
}

module.exports = AuthService;
