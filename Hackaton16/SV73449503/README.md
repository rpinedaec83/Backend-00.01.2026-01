# Reto 1 - Sistema de Pagos Online (Node.js + SQL + OAuth + Stripe/Culqi)

Proyecto base para cumplir el reto universitario:
- Persistencia SQL de productos, compras, pagos y devoluciones.
- Clientes autenticados mediante OAuth.
- Integración de pasarelas Stripe y Culqi.
- API REST para compra y refund.

## 1) Requisitos

- Node.js 18+
- npm 9+

## 2) Instalación

```bash
npm install
cp .env.example .env
```

Para pruebas locales sin credenciales reales:
- `MOCK_PAYMENT_GATEWAYS=true`
- `DISABLE_OAUTH=true` (y usar `/auth/mock`)

## 3) Ejecutar

```bash
npm start
```

Servidor en `http://localhost:3000`.

## 4) Endpoints principales

- `GET /health`
- `POST /auth/mock` (solo pruebas locales)
- `POST /products`
- `GET /products`
- `POST /checkout` (requiere sesión OAuth)
- `POST /payments/:paymentId/refund` (requiere sesión OAuth)
- `GET /me/payments` (requiere sesión OAuth)

## 5) Objetos SQL implementados

- Tablas: `users`, `products`, `purchases`, `purchase_items`, `payments`, `refunds`
- Trigger: `trg_payments_updated_at`
- Vista: `vw_customer_payments`

## 6) Pruebas y validación

```bash
npm test
npm run validate3
```

`validate3` ejecuta la misma suite 3 veces seguidas para demostrar estabilidad.

## 7) Flujo de ejemplo (Postman)

1. `POST /auth/mock`
```json
{ "provider": "google", "subject": "google-1", "email": "alumno@idat.edu.pe" }
```

2. `POST /products`
```json
{ "name": "Curso Node", "description": "Bootcamp", "priceCents": 12000, "currency": "PEN" }
```

3. `POST /checkout`
```json
{ "productId": 1, "quantity": 1, "provider": "stripe", "token": "tok_visa" }
```

4. `POST /payments/1/refund`
```json
{ "amountCents": 12000 }
```

## 8) Sustento académico

Este entregable cumple con:
- Resolución de problema de pagos online persistentes.
- Definición de algoritmo de compra y devolución.
- Uso de Node.js, API REST, OAuth, Stripe y Culqi.
- Uso de objetos de base de datos SQL para consultas y reporte.
