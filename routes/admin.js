const express = require("express");
const router = express.Router();
const adminContolers=require('../controllers/adminControllers')
router.get('/',(req,res)=>{
    res.json({message:"hi admin"})
})

router.post('/login',adminContolers.login)
router.get('/application',adminContolers.getApplication)
router.get('/pending',adminContolers.getPendingApplications)
router.get('/getApprovedList',adminContolers.getApprovedApplications)

router.get('/newApplication',adminContolers.getNewApplication)
router.post('/updatePending',adminContolers.updateStatus)
router.post('/updateSlot',adminContolers.updateSlot)

router.post('/CompanyDetailes',adminContolers.CompanyDetailes)
router.post('/bookSlot',adminContolers.applySlot)
router.post('/add-Slot',adminContolers.addSlot)

router.post('/viewDetails',adminContolers.getSlotData)

router.get('/getSlot',adminContolers.getSlot)







module.exports = router;