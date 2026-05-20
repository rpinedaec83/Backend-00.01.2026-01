const test = require('node:test');
const assert = require('node:assert/strict');

const { createDb, initSchema } = require('../src/db');
const { createPaymentService } = require('../src/services/payments');
const {
  findOrCreateUser,
  createProduct,
  checkout,
  refundPayment,
  listUserPayments,
} = require('../src/usecases');

async function setup() {
  const db = createDb(':memory:');
  await initSchema(db);
  const paymentService = createPaymentService({ mockGateways: true });
  return { db, paymentService };
}

test('rechaza checkout sin autenticar', async () => {
  const { db, paymentService } = await setup();
  const product = await createProduct(db, {
    name: 'Curso Node',
    description: 'Online',
    priceCents: 12000,
    currency: 'PEN',
  });

  await assert.rejects(
    checkout({
      db,
      paymentService,
      user: null,
      productId: product.id,
      quantity: 1,
      provider: 'stripe',
      token: 'tok_visa',
    }),
    /OAuth/,
  );

  await db.close();
});

test('crea compra y pago persistente para usuario OAuth', async () => {
  const { db, paymentService } = await setup();

  const user = await findOrCreateUser(db, {
    provider: 'google',
    subject: 'google-123',
    email: 'alumno@idat.edu.pe',
    name: 'Alumno',
  });

  const product = await createProduct(db, {
    name: 'Laptop',
    description: 'Producto',
    priceCents: 250000,
    currency: 'PEN',
  });

  const result = await checkout({
    db,
    paymentService,
    user,
    productId: product.id,
    quantity: 2,
    provider: 'stripe',
    token: 'tok_visa',
  });

  assert.equal(result.payment.amount_cents, 500000);
  assert.equal(result.payment.status, 'succeeded');

  const report = await listUserPayments(db, user.id);
  assert.equal(report.length, 1);
  assert.equal(report[0].refunded_cents, 0);

  await db.close();
});

test('registra devolución y actualiza estado de pago', async () => {
  const { db, paymentService } = await setup();

  const user = await findOrCreateUser(db, {
    provider: 'google',
    subject: 'user-refund',
    email: 'refund@idat.edu.pe',
    name: 'Refund User',
  });

  const product = await createProduct(db, {
    name: 'Mouse',
    priceCents: 10000,
    currency: 'PEN',
  });

  const purchase = await checkout({
    db,
    paymentService,
    user,
    productId: product.id,
    quantity: 1,
    provider: 'culqi',
    token: 'src_test',
  });

  const refund = await refundPayment({
    db,
    paymentService,
    user,
    paymentId: purchase.payment.id,
    amountCents: 10000,
  });

  assert.equal(refund.paymentStatus, 'refunded');

  const report = await listUserPayments(db, user.id);
  assert.equal(report[0].refunded_cents, 10000);

  await db.close();
});
