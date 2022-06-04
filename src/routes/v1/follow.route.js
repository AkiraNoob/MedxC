const router = require('express').Router();
const followController = require('../../controllers/follow.controller');

const auth = require('../../middlewares/auth');

router.post('/unfollow', auth(), followController.unfollow);
router.post('/remove', auth(), followController.remove);
router.post('/cancel', auth(), followController.cancel);

module.exports = router;
