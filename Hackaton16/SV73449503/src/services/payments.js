const Stripe = require('stripe');

function createPaymentService(config = {}) {
  const {
    stripeSecretKey,
    culqiSecretKey,
    mockGateways = false,
  } = config;

  const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

  function assertProvider(provider) {
    if (!['stripe', 'culqi'].includes(provider)) {
      const err = new Error('Proveedor de pago no soportado');
      err.status = 400;
      throw err;
    }
  }

  async function processPayment({ provider, amountCents, currency, token, metadata = {} }) {
    assertProvider(provider);

    if (mockGateways) {
      return {
        id: `${provider}_pay_${Date.now()}`,
        status: 'succeeded',
        raw: { mocked: true, token, metadata },
      };
    }

    if (provider === 'stripe') {
      if (!stripe) {
        throw new Error('Falta STRIPE_SECRET_KEY');
      }

      const intent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: currency.toLowerCase(),
        payment_method_data: {
          type: 'card',
          card: { token },
        },
        confirm: true,
        metadata,
      });

      return {
        id: intent.id,
        status: intent.status,
        raw: intent,
      };
    }

    if (!culqiSecretKey) {
      throw new Error('Falta CULQI_SECRET_KEY');
    }

    const response = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${culqiSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountCents,
        currency_code: currency,
        email: metadata.email || 'demo@example.com',
        source_id: token,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      const err = new Error(body?.merchant_message || 'Error en Culqi');
      err.status = 400;
      throw err;
    }

    return {
      id: body.id,
      status: body.outcome?.type || 'succeeded',
      raw: body,
    };
  }

  async function processRefund({ provider, providerPaymentId, amountCents, currency, reason = 'requested_by_customer' }) {
    assertProvider(provider);

    if (mockGateways) {
      return {
        id: `${provider}_refund_${Date.now()}`,
        status: 'succeeded',
        raw: { mocked: true, providerPaymentId, amountCents, currency, reason },
      };
    }

    if (provider === 'stripe') {
      if (!stripe) {
        throw new Error('Falta STRIPE_SECRET_KEY');
      }

      const refund = await stripe.refunds.create({
        payment_intent: providerPaymentId,
        amount: amountCents,
        reason,
      });

      return {
        id: refund.id,
        status: refund.status,
        raw: refund,
      };
    }

    if (!culqiSecretKey) {
      throw new Error('Falta CULQI_SECRET_KEY');
    }

    const response = await fetch('https://api.culqi.com/v2/refunds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${culqiSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        charge_id: providerPaymentId,
        amount: amountCents,
        reason,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      const err = new Error(body?.merchant_message || 'Error en devolución Culqi');
      err.status = 400;
      throw err;
    }

    return {
      id: body.id,
      status: body.reason || 'succeeded',
      raw: body,
    };
  }

  return {
    processPayment,
    processRefund,
  };
}

module.exports = { createPaymentService };
