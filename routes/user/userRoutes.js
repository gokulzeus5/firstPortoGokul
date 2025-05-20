const express = require ('express');
const router = express.Router();
const homeController = require('../../controller/user/home');
const aboutController = require ('../../controller/user/about');
const projectController = require ('../../controller/user/project');
const contactController = require ('../../controller/user/contact');
const loginController = require ('../../controller/admin/login');
const dashboardController = require ('../../controller/admin/dashboard');
const { uploadProfile, uploadProjects } = require('../../config/middelware');
const middleware = require ('../../config/authMiddeleware.js')
const { submitMessage, getMessages } = require('../../controller/user/messageController.js');
const {
    showMessages,
    deleteMessage,
    replyToMessage,
    getMessageById
} = require('../../controller/admin/adminMessage');




//load pages
router.get('/',homeController.loadHome);
router.get('/loadAbout',aboutController.loadAbout)
router.get('/loadProject',projectController.loadProject);
router.get('/loadContact',contactController.loadContact);
router.post('/send-email', submitMessage);
router.get('/messages', getMessages);

//login
router.get('/login',middleware.guestMiddleware,loginController.getLogin);
router.post('/login',loginController.postLogin);

//DASHBOARD
router.get("/dashboard",middleware.authMiddleware,dashboardController.loadDashBoard);
router.get('/profile',dashboardController.getProfile);
router.post('/profile', uploadProfile, dashboardController.postProfile);
router.post('/addProjects', uploadProjects, dashboardController.addProject);
router.post('/experience',dashboardController.addExperience);
router.get('/messages', showMessages);
router.get('/messages/:id', getMessageById);
router.delete('/messages/:id', deleteMessage);
router.post('/messages/reply', replyToMessage);
router.get('/logout',loginController.logout);


module.exports = router;