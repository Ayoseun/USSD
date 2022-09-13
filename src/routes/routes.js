const express=require('express');
const router=express.Router();
const controller=require('../controllers/ussd/ussd')
const homeController=require('../controllers/home')




 router.post('/',controller.ussdStarter);

 router.get('/', homeController.home)



module.exports=router;