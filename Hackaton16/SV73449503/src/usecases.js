async function findOrCreateUser(db, { provider, subject, email, name }) {
  const existing = await db.get(
    'SELECT * FROM users WHERE oauth_provider = ? AND oauth_subject = ?',
    [provider, subject],
  );
  if (existing) {
    return existing;
  }

  const result = await db.run(
    'INSERT INTO users(oauth_provider, oauth_subject, email, name) VALUES(?, ?, ?, ?)',
    [provider, subject, email || null, name || null],
  );

  return db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
}

async function createProduct(db, { name, description = null, priceCents, currency = 'PEN' }) {
  if (!name || !Number.isInteger(priceCents) || priceCents < 0) {
    const err = new Error('Producto inválido');
    err.status = 400;
    throw err;
  }

  const result = await db.run(
    'INSERT INTO products(name, description, price_cents, currency) VALUES(?, ?, ?, ?)',
    [name, description, priceCents, currency],
  );

  return db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
}

async function listProducts(db) {
  return db.all('SELECT * FROM products WHERE active = 1 ORDER BY id DESC');
}

async function checkout({ db, paymentService, user, productId, quantity = 1, provider, token = 'tok_test', currency }) {
  if (!user?.id) {
    const err = new Error('Debes iniciar sesión con OAuth para continuar');
    err.status = 401;
    throw err;
  }

  if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
    const err = new Error('Datos de compra inválidos');
    err.status = 400;
    throw err;
  }

  const product = await db.get('SELECT * FROM products WHERE id = ? AND active = 1', [productId]);
  if (!product) {
    const err = new Error('Producto no encontrado');
    err.status = 404;
    throw err;
  }

  const txCurrency = currency || product.currency;
  const totalCents = product.price_cents * quantity;

  const purchaseResult = await db.run(
    'INSERT INTO purchases(user_id, total_cents, currency, status) VALUES(?, ?, ?, ?)',
    [user.id, totalCents, txCurrency, 'created'],
  );
  const purchaseId = purchaseResult.lastID;

  await db.run(
    'INSERT INTO purchase_items(purchase_id, product_id, quantity, unit_price_cents, subtotal_cents) VALUES(?, ?, ?, ?, ?)',
    [purchaseId, productId, quantity, product.price_cents, totalCents],
  );

  let pay;
  try {
    pay = await paymentService.processPayment({
      provider,
      amountCents: totalCents,
      currency: txCurrency,
      token,
      metadata: { purchaseId: String(purchaseId), email: user.email || undefined },
    });
  } catch (err) {
    await db.run('UPDATE purchases SET status = ? WHERE id = ?', ['failed', purchaseId]);
    throw err;
  }

  const paymentResult = await db.run(
    `INSERT INTO payments(
      purchase_id, user_id, provider, amount_cents, currency, provider_payment_id, status, raw_response
    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      purchaseId,
      user.id,
      provider,
      totalCents,
      txCurrency,
      pay.id,
      pay.status,
      JSON.stringify(pay.raw),
    ],
  );

  await db.run('UPDATE purchases SET status = ? WHERE id = ?', ['paid', purchaseId]);

  const payment = await db.get('SELECT * FROM payments WHERE id = ?', [paymentResult.lastID]);
  return { purchaseId, payment };
}

async function refundPayment({ db, paymentService, user, paymentId, amountCents }) {
  if (!user?.id) {
    const err = new Error('Debes iniciar sesión con OAuth para continuar');
    err.status = 401;
    throw err;
  }

  const payment = await db.get('SELECT * FROM payments WHERE id = ? AND user_id = ?', [paymentId, user.id]);
  if (!payment) {
    const err = new Error('Pago no encontrado para este usuario');
    err.status = 404;
    throw err;
  }

  const refundRow = await db.get(
    'SELECT COALESCE(SUM(amount_cents), 0) AS refunded FROM refunds WHERE payment_id = ?',
    [paymentId],
  );

  const remaining = payment.amount_cents - refundRow.refunded;
  const refundAmount = Number.isInteger(amountCents) ? amountCents : remaining;

  if (!Number.isInteger(refundAmount) || refundAmount <= 0 || refundAmount > remaining) {
    const err = new Error('Monto de devolución inválido');
    err.status = 400;
    throw err;
  }

  const refund = await paymentService.processRefund({
    provider: payment.provider,
    providerPaymentId: payment.provider_payment_id,
    amountCents: refundAmount,
    currency: payment.currency,
  });

  const refundResult = await db.run(
    `INSERT INTO refunds(
      payment_id, user_id, amount_cents, provider_refund_id, status, raw_response
    ) VALUES(?, ?, ?, ?, ?, ?)`,
    [paymentId, user.id, refundAmount, refund.id, refund.status, JSON.stringify(refund.raw)],
  );

  const newRemaining = remaining - refundAmount;
  const newStatus = newRemaining === 0 ? 'refunded' : 'partially_refunded';
  await db.run('UPDATE payments SET status = ? WHERE id = ?', [newStatus, paymentId]);

  const refundSaved = await db.get('SELECT * FROM refunds WHERE id = ?', [refundResult.lastID]);
  return { refund: refundSaved, paymentStatus: newStatus };
}

async function listUserPayments(db, userId) {
  return db.all('SELECT * FROM vw_customer_payments WHERE user_id = ? ORDER BY payment_id DESC', [userId]);
}

module.exports = {
  findOrCreateUser,
  createProduct,
  listProducts,
  checkout,
  refundPayment,
  listUserPayments,
};
