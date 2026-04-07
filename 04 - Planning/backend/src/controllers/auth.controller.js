const bcrypt            = require('bcryptjs');
const jwt               = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Op }            = require('sequelize');
const sequelize         = require('../config/database');
const { DataTypes }     = require('sequelize');

// Inline User model (avoids circular deps at this stage)
const User = require('../models/User.model');

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user by username (case-insensitive)
    const user = await User.findOne({
      where: { username: username.toLowerCase().trim(), is_active: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.',
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.',
      });
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id:        user.id,
        username:  user.username,
        role:      user.role,
        full_name: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id:        user.id,
        username:  user.username,
        full_name: user.full_name,
        email:     user.email,
        role:      user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'full_name', 'email', 'role', 'created_at'],
    });

    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/change-password ──────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash: hash, updated_at: new Date() });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};
