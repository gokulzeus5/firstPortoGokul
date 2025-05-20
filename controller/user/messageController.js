const sendEmail = require('../../config/email');
const  Message = require('../../model/messageSchema');


exports.submitMessage = async (req, res, next) => {
  try {
    console.log('-------->',req.body);
    const { name, email, subject, message, location } = req.body;

    // Create message in database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      location: location || 'Not provided'
    });

    // Send email notification
    try {
      await sendEmail({
        subject: `New Contact Form Message: ${subject}`,
        message: `
          You have received a new message from your portfolio contact form.
          
          Name: ${name}
          Email: ${email}
          Subject: ${subject}
          Location: ${location || 'Not provided'}
          
          Message:
          ${message}
        `,
        html: `
          <h3>New Contact Form Message</h3>
          <p>You have received a new message from your portfolio contact form.</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Location:</strong> ${location || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });
    } catch (error) {
      console.error('Email notification failed:', error);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Message submission error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (you would add auth middleware in production)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};