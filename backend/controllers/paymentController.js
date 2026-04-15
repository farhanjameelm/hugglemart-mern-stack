const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'inr' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            payment_method_types: ['card'],
            metadata: {
                userId: req.user.id
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment intent',
            error: error.message
        });
    }
};

// @desc    Confirm payment
// @route   POST /api/payment/confirm
// @access  Private
const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID is required'
            });
        }

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not successful',
                status: paymentIntent.status
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully',
            paymentIntent
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming payment',
            error: error.message
        });
    }
};

// @desc    Get payment methods
// @route   GET /api/payment/methods
// @access  Private
const getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: req.user.stripeCustomerId, // You'd store this in user model
            type: 'card',
        });

        res.status(200).json({
            success: true,
            paymentMethods: paymentMethods.data
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment methods',
            error: error.message
        });
    }
};

// @desc    Create refund
// @route   POST /api/payment/refund
// @access  Private/Admin
const createRefund = async (req, res) => {
    try {
        const { paymentIntentId, amount, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID is required'
            });
        }

        const refundParams = {
            payment_intent: paymentIntentId,
            reason: reason || 'requested_by_customer'
        };

        if (amount && amount > 0) {
            refundParams.amount = Math.round(amount * 100); // Convert to paise
        }

        const refund = await stripe.refunds.create(refundParams);

        res.status(200).json({
            success: true,
            message: 'Refund created successfully',
            refund
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating refund',
            error: error.message
        });
    }
};

// @desc    Webhook handler for Stripe
// @route   POST /api/payment/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!', paymentIntent);
                // Update order status, send confirmation email, etc.
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('PaymentIntent failed!', failedPayment);
                // Handle failed payment
                break;

            case 'payment_intent.canceled':
                console.log('PaymentIntent was canceled!');
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook handler error',
            error: error.message
        });
    }
};

// @desc    Process COD (Cash on Delivery)
// @route   POST /api/payment/cod
// @access  Private
const processCOD = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        // For COD, we just return success
        // Order creation and status updates are handled in order controller
        res.status(200).json({
            success: true,
            message: 'COD order processed successfully',
            paymentMethod: 'cod'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing COD order',
            error: error.message
        });
    }
};

// @desc    Get payment status
// @route   GET /api/payment/status/:paymentIntentId
// @access  Private
const getPaymentStatus = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID is required'
            });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.status(200).json({
            success: true,
            status: paymentIntent.status,
            paymentIntent
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status',
            error: error.message
        });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
    getPaymentMethods,
    createRefund,
    stripeWebhook,
    processCOD,
    getPaymentStatus
};
