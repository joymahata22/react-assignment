const express = require('express');
const { auth, protect } = require('../middleware/auth');
const sessionController = require('../controller/sessionController');

const router = express.Router();

router.get('/sessions', sessionController.getPublicSessions);

router.get('/my-sessions', protect, sessionController.getUserSessions);
router.get('/my-sessions/:id', protect, sessionController.getSingleSession);
router.post('/my-sessions/save-draft', protect, sessionController.saveDraft);
router.post('/my-sessions/publish', protect, sessionController.publishSession);
router.delete('/my-sessions/:id', protect, sessionController.deleteSession);

module.exports = router;
