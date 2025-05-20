const dotenv = require('dotenv');
dotenv.config();
const User = require('../../model/userSchema');

const getLogin = async (req,res) => {
    try{
        console.log('is coming here ?')
        res.render('login')
    }catch(err){
        console.log('error while loading login page',err);
        res.status(500).send('error while loging page',err);
    }
}
const postLogin = async (req, res) => {
  try {
    console.log('--->', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

   
    if (password !== process.env.PASSWORD) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    console.log("Session saved:", req.session.user);

    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(" Error during logout:", err);
        return res.status(500).json({ error: "Logout failed. Please try again." });
      }
    
      res.clearCookie('connect.sid');
      res.redirect('/login'); 
    });
  } catch (err) {
    console.error(" Error during logout:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports ={
    getLogin,
    postLogin,
    logout,
}