"use strict";
const express = require(`express`);
const router = express.Router();

const controller = require('../controllers/meeting');
const middleware = require(`../middleware/`);

router.get(`/single/:roomId`, middleware.checkUserStatus, controller.getSingleRoomMeetings);

router.post(`/quick/:roomId`, middleware.checkUserStatus, controller.checkCurrentQuick, controller.addQuickMeeting);

router.delete(`/quickCancel/:roomId`, middleware.checkUserStatus, controller.cancelQuickMeeting);
router.delete(`/cancel/:roomId`, middleware.checkUserStatus, controller.cancelMeeting);

router.post(`/regular/:roomId`, middleware.checkUserStatus, controller.checkCurrentQuick, controller.checkCurrent, controller.addMeeting);




module.exports = router;