"use strict";
const express = require(`express`);
const router = express.Router();

const controller = require('../controllers/admin');
const middleware = require(`../middleware/`);

router.post(`/`, middleware.checkUserStatus, middleware.adminCheck, controller.addRoom);
router.put(`/:id`, middleware.checkUserStatus, middleware.adminCheck, controller.updateRoom);
router.delete(`/:id`, middleware.checkUserStatus, middleware.adminCheck, controller.deleteRoom);
router.get(`/users`, middleware.checkUserStatus, middleware.adminCheck, controller.getAllUsers);
router.get(`/users/:id`, middleware.checkUserStatus, middleware.adminCheck, controller.getSingleUser);
router.delete(`/users/:id`, middleware.checkUserStatus, middleware.adminCheck, controller.deleteUser);

module.exports = router;