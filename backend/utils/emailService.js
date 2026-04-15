const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: `"Huggle Mart" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email could not be sent');
    }
};

// Email templates
const emailTemplates = {
    welcome: (user) => ({
        subject: 'Welcome to Huggle Mart!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to Huggle Mart, ${user.firstName}!</h2>
                <p>Thank you for registering with Huggle Mart. We're excited to have you as part of our community!</p>
                <p>With Huggle Mart, you can:</p>
                <ul>
                    <li>Shop from a wide variety of products</li>
                    <li>Enjoy our unique AI bargaining feature</li>
                    <li>Track your orders in real-time</li>
                    <li>Get exclusive deals and discounts</li>
                </ul>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Happy shopping!</p>
                <br>
                <p>Best regards,<br>The Huggle Mart Team</p>
            </div>
        `
    }),

    orderConfirmation: (order) => ({
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Order Confirmed!</h2>
                <p>Thank you for your order, ${order.user.firstName}!</p>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Total Amount:</strong> ${order.formattedTotalAmount}</p>
                <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'To be confirmed'}</p>
                
                <h3>Order Details:</h3>
                ${order.items.map(item => `
                    <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                        <p><strong>${item.name}</strong></p>
                        <p>Quantity: ${item.quantity} x ${item.price}</p>
                        <p>Size: ${item.selectedSize || 'N/A'}</p>
                        <p>Color: ${item.selectedColor || 'N/A'}</p>
                    </div>
                `).join('')}
                
                <h3>Shipping Address:</h3>
                <p>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                    ${order.shippingAddress.country}
                </p>
                
                <p>You can track your order status on your account dashboard.</p>
                <br>
                <p>Best regards,<br>The Huggle Mart Team</p>
            </div>
        `
    }),

    orderStatusUpdate: (order, newStatus) => ({
        subject: `Order Status Update - ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Order Status Update</h2>
                <p>Hi ${order.user.firstName},</p>
                <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong>${newStatus}</strong></p>
                
                ${newStatus === 'shipped' ? `
                    <h3>Shipping Information:</h3>
                    <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'Will be updated soon'}</p>
                    <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'To be confirmed'}</p>
                ` : ''}
                
                ${newStatus === 'delivered' ? `
                    <p>Your order has been delivered successfully!</p>
                    <p>We hope you enjoy your purchase. Please leave a review on our website to help other customers.</p>
                ` : ''}
                
                <p>You can view your complete order details on your account dashboard.</p>
                <br>
                <p>Best regards,<br>The Huggle Mart Team</p>
            </div>
        `
    }),

    passwordReset: (user, resetToken) => ({
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hi ${user.firstName},</p>
                <p>You requested a password reset for your Huggle Mart account.</p>
                <p>Click the link below to reset your password:</p>
                <p><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                <p>This link will expire in 10 minutes.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <br>
                <p>Best regards,<br>The Huggle Mart Team</p>
            </div>
        `
    })
};

module.exports = {
    sendEmail,
    emailTemplates
};
