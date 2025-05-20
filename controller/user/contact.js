
const User = require('../../model/userSchema')

const loadContact = async (req,res) =>{
    try{

   const user = await User.findOne({email:"gokulzeus837@gmail.com"});
     if(!user){
            return res.status(500).json({message:"user not found"});
        }
  
  res.render('contact', { user });
    }catch(err){
        console.log('error while loading contact page ',err);
        res.status(500).send("error while loading contact age")
    }
}



module.exports ={
    loadContact,
}