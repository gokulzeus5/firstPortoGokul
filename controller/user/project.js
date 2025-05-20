const User = require ('../../model/userSchema');
const Project = require ('../../model/projectShema')
const loadProject = async (req,res) =>{
    try{
        console.log('here coming ');
        const user = await User.findOne({email:"gokulzeus837@gmail.com"});
             console.log(user,'userData-->')
                if(!user){
                    return res.status(500).json({message:"user not found"});
                }

                const projects = await Project.find({ userId: user._id });

                console.log('the pri=ojects ',projects)
        res.render('projects',{user,projects})
    }catch(err){
        console.log('error while loading project page ',err);
        res.status(500).send("error while loading project page")
    }
}

module.exports ={
    loadProject,
}