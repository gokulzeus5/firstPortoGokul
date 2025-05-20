const guestMiddleware = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    next();
  } catch (error) {
    console.log('Guest middleware error:', error);
    res.status(500).send('Internal Server Error');
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
    guestMiddleware,
    authMiddleware,

};