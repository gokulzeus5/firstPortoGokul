const User = require('../../model/userSchema');
const Project = require ('../../model/projectShema');
const Experience  = require('../../model/experience')
const Message = require('../../model/messageSchema')
const loadDashBoard = async (req,res) => {
    try{
       const userData = await User.findOne({email:"gokulzeus837@gmail.com"});
                   console.log(userData,'userData-->')
                      if(!userData){
                          return res.status(500).json({message:"user not found"});
                      }

                      const totalRequests = await Message.countDocuments();
                      const projects = await Project.find({ userId: userData._id })
                      if(!projects){
                        return res.status(500).json({message:"No project added yet"})
                      }


    // Prepare analytics data
    const analytics = {
      projectsCompleted: userData.stats.projectsCompleted || 0,
      happyClients: userData.stats.happyClients || 0,
      yearsExperience: userData.stats.yearsExperience || 0,
      awardsReceived: userData.stats.awardsReceived || 0,
      contactRequests: totalRequests,
    };

        res.render('adminside',{userData,analytics,projects});
    }catch(error){
        console.log('error while loading dashboard',error);
        res.status(500).send('error while loading dashboard',error)
    }
}
const getProfile = async (req, res) => {
    try {
        const userData = await User.findOne({ email: "gokulzeus837@gmail.com" }); 
        
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            name: userData.name,
            professionalTitle: userData.professionalTitle,
            email: userData.email,
            bio: userData.bio,
            socialLinks: userData.socialLinks || {},
            stats: userData.stats || {},
            availableForFreelance: userData.availableForFreelance || false,
            skills: userData.skills || []
        });
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Failed to get profile." });
    }
}
const postProfile = async (req,res) =>{
    try{
        console.log('--------->',req.body,req.file);
        const profileData = JSON.parse(req.body.profileData);
       

        if (req.file) {
            profileData.profileImage = `/uploads/${req.file.filename}`;
          }

        const userData = await User.updateOne(
      { email: profileData.email.trim().toLowerCase() },
      { $set: profileData },
      { upsert: true }
    );
    console.log("User data updated:", userData);
    res.status(200).json({ message: "Profile updated successfully." });
    }catch(error){
     console.error(" Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile." });
    }
}
const addProject = async (req, res) => {
    try {
 
      if (!req.body.title || !req.body.category || !req.body.shortDescription || !req.body.description) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
      if (!req.files || !req.files.featuredImage) {
        return res.status(400).json({ 
          success: false, 
          message: 'Featured image is required' 
        });
      }
      console.log('userId: req.user._id,',req.session.user._id);
      const projectData = {
        userId: req.session.user._id,
        title: req.body.title,
        category: req.body.category,
        client: req.body.client || '',
        projectDate: req.body.projectDate || null,
        shortDescription: req.body.shortDescription,
        description: req.body.description,
        featuredImage: req.files.featuredImage[0].filename,
        additionalImages: req.files.additionalImages ? 
          req.files.additionalImages.map(file => file.filename) : 
          [],
        technologies: req.body.technologies || [],
        projectUrl: req.body.projectUrl || '',
        githubUrl: req.body.githubUrl || '',
        featured: req.body.featured === 'on' ? true : false,
        order: parseInt(req.body.order) || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const project = await Project.create(projectData);
      const userId = await User.findOne({email:"gokulzeus837@gmail.com"});
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          { $inc: { 'stats.projectsCompleted': 1 } },
          { new: true }
        );
      }
      return res.status(201).json({
        success: true,
        message: 'Project added successfully',
        project: {
          id: project._id,
          title: project.title
        }
      });
      
    } catch (error) {
      console.error('Error adding project:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to add project',
        error: error.message
      });
    }
  };
  const addExperience = async (req,res) =>{
    try{
      console.log('bodyyy------>',req.body);
      const experienceData = req.body;

      const newExperience = await Experience.create({
        userId: req.session.user._id,
        position:experienceData.position,
        company : experienceData.company,
        location : experienceData.location,
        description : experienceData.description,
        description: experienceData.description,
        startDate : experienceData.startDate,
        current : experienceData.current,
        order : experienceData.order,
        skills : experienceData.skills,
        endDate : experienceData.endDate


      });
      console.log('the new experince---->',newExperience)

      res.status(200).json({success:true,message:"Experience added successfully", data:newExperience})
    }catch(error){
      console.log("Error while add experince ",error);
      res.status(500).json({
        message: 'Something went wrong',
        error: error.message
      })
    }
  };

  
  
module.exports ={
    loadDashBoard,
    postProfile,
    getProfile,
    addProject,
    addExperience,
}