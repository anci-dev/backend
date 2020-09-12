const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

function createNewCustomer(data) {
    return stripe.customers.create(data);
}

module.exports = { createNewCustomer };
