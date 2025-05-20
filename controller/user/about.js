const User = require('../../model/userSchema');
const Experience = require('../../model/experience')
const loadAbout = async (req, res) => {
    try {
      const user = await User.findOne({ email: 'gokulzeus837@gmail.com' });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const experiences = await Experience.find({ userId: user._id }).sort({ order: -1 });
      console.log('Experiences:', experiences);
      res.render('about', { user, experiences });
    } catch (err) {
      console.error('Error while loading about page:', err);
      res.status(500).send('Error while loading about page');
    }
  };

module.exports ={
    loadAbout,
}