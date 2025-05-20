const Message = require('../../model/messageSchema');
const sendEmail = require('../../config/email');



exports.showMessages = async (req, res, next) => {
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
exports.getMessageById = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        // Mark message as read
        if (!message.read) {
            message.read = true;
            await message.save();
        }
        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.replyToMessage = async (req, res, next) => {
    try {
        const { messageId, email, subject, message } = req.body;

        // Verify message exists
        const originalMessage = await Message.findById(messageId);
        if (!originalMessage) {
            return res.status(404).json({
                success: false,
                error: 'Original message not found'
            });
        }

        // Send reply email
        const emailSent = await sendEmail({
            subject: subject,
            message: message,
            html: `
                <h3>${subject}</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><strong>Original Message:</strong></p>
                <p><strong>From:</strong> ${originalMessage.name} (${originalMessage.email})</p>
                <p><strong>Subject:</strong> ${originalMessage.subject}</p>
                <p>${originalMessage.message.replace(/\n/g, '<br>')}</p>
            `,
            to: email
        });

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                error: 'Failed to send reply'
            });
        }

        // Mark message as read
        originalMessage.read = true;
        await originalMessage.save();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Reply error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.submitMessage = async (req, res, next) => {
    try {
        console.log('-------->', req.body);
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