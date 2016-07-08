"use strict";
const express = require(`express`);
const router = express.Router();

const controller = require('../controllers/auth');
const validation = require('../controllers/validation');
const middleware = require('../middleware/');

router.post(`/check`,validation.checkEmail,middleware.checkUserEmail);
router.post(`/sign`, validation.sign, controller.sign);
router.post(`/login`, validation.login, controller.login);

module.exports = router;