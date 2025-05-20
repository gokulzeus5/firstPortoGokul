
const User = require ('../../model/userSchema');
const loadHome = async (req,res) =>{
    try{
        const user = await User.findOne({email:"gokulzeus837@gmail.com"});
        console.log(user.profileImage,'imgaeeeeeeeeee')
     
        if(!user){
            return res.status(500).json({message:"user not found"});
        }
        res.render('home', { user });
    }catch(err){
        console.log('error while loading home page ',err);
        res.status(500).send("error while loading home page")
    }
}

module.exports ={
    loadHome,
}