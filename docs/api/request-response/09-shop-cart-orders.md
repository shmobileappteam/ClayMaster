> Part of [API Request & Response](../../API_REQUEST_RESPONSE.md) · Status: [API_IMPLEMENTATION_STATUS.md](../../API_IMPLEMENTATION_STATUS.md)

# 9. Shop / Cart / Orders

> Cart `variant_price` / item `price` often in **cents** (2500 = $25). Order totals may be dollar strings — normalize in UI.

## 9.1 Product listing

`GET /api/shop/products` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Products fetched successfully.",
  "data": [
    {
      "id": "68633730c91862eee20c1c6c",
      "title": "Long Sleeve Performance Tee - ClayMaster Custom Logo1 ",
      "description": "<p>...",
      "tags": ["Unisex", "Men's Clothing", "Sportswear"],
      "options": [
        {
          "name": "Colors",
          "type": "color",
          "values": [
            { "id": 1978, "title": "White", "colors": ["#F9F9F9"] }
          ]
        }
      ]
    }
  ]
}
```

(Full Printify payload also includes variants, images, sizes.)

---

## 9.2 Product detail

`GET /api/shop/products/{id}` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Product fetched successfully.",
  "data": {
    "product": {
      "id": "6806553eb9e9c22de203810e",
      "title": "Short Sleeve Cotton Tee - ClayMaster Custom Logo2",
      "description": "..."
    }
  }
}
```

---

## 9.3 Add to cart

`POST /api/cart/add` · Bearer

**Request**

```json
{
  "product_id": "6806553eb9e9c22de203810e",
  "variant_id": "73975",
  "quantity": 1,
  "size": "M",
  "color": "Granite",
  "size_id": "1547",
  "color_id": "2820",
  "product_title": "Short Sleeve Cotton Tee - ClayMaster Custom Logo2",
  "variant_price": 2500,
  "variant_image": "https://images-api.printify.com/mockup/..."
}
```

**Response `200`**

```json
{
  "status": true,
  "message": "Product added to cart!",
  "data": {
    "id": 1,
    "user_id": 348,
    "product_id": "6806553eb9e9c22de203810e",
    "variant_id": "73975",
    "quantity": 1,
    "title": "Short Sleeve Cotton Tee - ClayMaster Custom Logo2",
    "price": 2500,
    "image": "https://images-api.printify.com/mockup/...",
    "size_id": "1547",
    "size": "M",
    "color_id": "2820",
    "color": "Granite",
    "created_at": "2026-07-15T12:22:02.000000Z",
    "updated_at": "2026-07-15T12:22:02.000000Z"
  }
}
```

---

## 9.4 Cart listing

`GET /api/cart` · Bearer

**Response `200`**

```json
{
  "status": true,
  "data": {
    "items": [
      {
        "id": 1,
        "user_id": 348,
        "product_id": "6806553eb9e9c22de203810e",
        "variant_id": "73975",
        "quantity": 1,
        "title": "Short Sleeve Cotton Tee - ClayMaster Custom Logo2",
        "price": 2500,
        "image": "https://...",
        "size_id": "1547",
        "size": "M",
        "color_id": "2820",
        "color": "Granite",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "subtotal": 25,
    "discount": 25,
    "total": 0
  }
}
```

---

## 9.5 Update cart

`POST /api/cart/update` · Bearer

**Request**

```json
{
  "variant_id": "73975",
  "quantity": 3
}
```

**Response `200`**

```json
{
  "status": true,
  "message": "Cart updated!",
  "data": {
    "id": 3,
    "variant_id": "73975",
    "quantity": 3,
    "price": 5000,
    "size": "M",
    "color": "Granite"
  }
}
```

---

## 9.6 Remove cart item

`DELETE /api/cart/{variant_id}` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Item removed from cart!"
}
```

---

## 9.7 Checkout SetupIntent

`POST /api/checkout/setup-intent` · Bearer

**Request body:** none (backend reads the authenticated user's cart)

**Payment required — `201`**

```json
{
  "status": true,
  "message": "Checkout setup intent created successfully.",
  "data": {
    "subtotal_cents": 10000,
    "discount_cents": 7500,
    "total_cents": 2500,
    "subtotal": 100,
    "discount": 75,
    "total": 25,
    "currency": "USD",
    "payment_required": true,
    "setup_intent_id": "seti_xxxxx",
    "client_secret": "seti_xxxxx_secret_xxxxx",
    "customer_id": "cus_xxxxx"
  }
}
```

Pass `data.client_secret` to Stripe `confirmSetupIntent`, then send `pm_...` to place-order.

**Zero-total credit order**

When merchandise credit covers the subtotal:

```json
{
  "payment_required": false,
  "subtotal": 50,
  "discount": 50,
  "total": 0,
  "setup_intent_id": null,
  "client_secret": null
}
```

Call place-order **without** `payment_method`.

---

## 9.8 Place order

`POST /api/checkout/place-order` · Bearer

**Request**

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@example.com",
  "phone": "32324234",
  "country": "US",
  "state": "SC",
  "address1": "123 Main St",
  "address2": null,
  "zip": "29601",
  "city": "Greenville",
  "companyname": "",
  "payment_method": "pm_xxxxx"
}
```

Omit `payment_method` when setup-intent returned `payment_required: false`.

**Successful response `201`**

```json
{
  "status": true,
  "message": "Order placed successfully!",
  "data": {
    "order_id": 16,
    "order_number": "ORD-XXXXXXXXXXXX",
    "payment_intent_id": "pi_xxxxx",
    "payment_status": "succeeded",
    "subtotal": 100,
    "discount": 75,
    "total": 25,
    "currency": "USD",
    "already_processed": false
  }
}
```

Treat **`data.payment_status: "succeeded"`** as final success when a charge was made. Never send a `seti_..._secret_...` as `payment_method`.

---

## 9.9 Orders list

`GET /api/orders` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Orders fetched successfully.",
  "data": [
    {
      "id": 10,
      "order_number": "ORD-TI7WS8P9TWZHUQSC",
      "order_status": "0",
      "order_status_label": "Pending",
      "subtotal": "95",
      "total": "95",
      "transaction_id": "pi_3TtSdvEE9zClGUlA1FpKnOyo",
      "created_at": "2026-07-15T13:14:32.000000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 2,
    "has_more": false
  }
}
```

---

## 9.10 Order detail

`GET /api/orders/{id}` · Bearer

**Response `200`**

```json
{
  "status": true,
  "message": "Order fetched successfully.",
  "data": {
    "id": 9,
    "order_number": "ORD-TI7W7HPCJHZUERMI",
    "order_status": "0",
    "order_status_label": "Pending",
    "billing": {
      "first_name": "test",
      "last_name": "test",
      "email": "jacksmithjs4557078@gmail.com",
      "contact": "34534535",
      "country": "AR",
      "state": "L",
      "address1": "test",
      "address2": null,
      "zip": "test",
      "city": "test",
      "company_name": "test"
    },
    "subtotal": "0",
    "total": "0",
    "transaction_id": "CREDIT-QFMRN4PO9LBN",
    "created_at": "2026-07-15T13:02:05.000000Z",
    "items": [
      {
        "id": 14,
        "product_id": "6806553eb9e9c22de203810e",
        "variant_id": "73975",
        "name": "Short Sleeve Cotton Tee - ClayMaster Custom Logo2",
        "price": "25",
        "quantity": "1",
        "size": "M",
        "color": "Granite",
        "image": "https://..."
      }
    ]
  }
}
```

---
