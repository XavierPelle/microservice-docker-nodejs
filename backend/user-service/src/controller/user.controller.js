const express = require('express');
const router = express.Router();
const User = require("../models/User");

const getAll = async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users.' });
    }
  };

const createUser = async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: "server error user has not been created" });
    }
  };

const updateUser = async (req, res) => {
  try {
      const id = req.params.id;
      await User.update(req.body, { where: { id: id } });
      res.status(200).json({ message: "User updated !" });
    } catch (err) {
      res.status(500).json({ message: "server error the user has not been updated !" });
    }
  };

const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
      const user = await User.destroy({ where: { id: id } });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "user not found" });
    }
  };

  module.exports = {
    getAll,
    createUser,
    updateUser,
    deleteUser,
  }