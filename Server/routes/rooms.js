"use strict";
const express = require(`express`);
const router = express.Router();

const controller = require('../controllers/room');

router.get(`/`, controller.getAll);

//router.post(`/:roomId`, controller.signForRoom);
router.delete(`/:roomId`, controller.unFollow);

module.exports = router;