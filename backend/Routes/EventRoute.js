const {Event,AllEvent} =require('../Controllers/EventController');
const router =require('express').Router();

router.post('/create', Event);
router.get('/home', AllEvent);


module.exports=router;