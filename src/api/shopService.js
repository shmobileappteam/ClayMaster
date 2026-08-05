import { ENDPOINTS } from './endpoints';
import api from './api';

const asList = body => {
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
};

/** GET /api/shop/products — data[] (Printify products) */
export const getShopProducts = async () => {
  const response = await api.get(ENDPOINTS.GET_SHOP_PRODUCTS);
  const body = response.data;
  return { items: asList(body), status: body?.status, message: body?.message };
};

/** GET /api/shop/products/{id} — data.product */
export const getShopProduct = async id => {
  const response = await api.get(ENDPOINTS.GET_SHOP_PRODUCT(id));
  const body = response.data;
  return body?.data?.product ?? body?.data ?? null;
};

/**
 * POST /api/cart/add
 * Body: { product_id, variant_id, quantity, size, color, size_id, color_id,
 *         product_title, variant_price (cents), variant_image }
 */
export const addToCart = async payload => {
  const response = await api.post(ENDPOINTS.ADD_TO_CART, payload);
  return response.data;
};

/**
 * GET /api/cart
 * data: { items[] (price in cents), subtotal, discount, total (dollars) }
 */
export const getCart = async () => {
  const response = await api.get(ENDPOINTS.GET_CART);
  const body = response.data;
  const data = body?.data && !Array.isArray(body.data) ? body.data : {};
  return {
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: Number(data.subtotal) || 0,
    discount: Number(data.discount) || 0,
    total: Number(data.total) || 0,
    status: body?.status,
  };
};

/** POST /api/cart/update — { variant_id, quantity } */
export const updateCartItem = async ({ variant_id, quantity }) => {
  const response = await api.post(ENDPOINTS.UPDATE_CART, {
    variant_id,
    quantity,
  });
  return response.data;
};

/** DELETE /api/cart/{variant_id} */
export const removeCartItem = async variantId => {
  const response = await api.delete(ENDPOINTS.REMOVE_CART_ITEM(variantId));
  return response.data;
};

/**
 * POST /api/checkout/setup-intent
 * Backend reads the authenticated user's cart.
 * Payment required: data.client_secret + payment_required: true
 * Zero-total credit: payment_required: false, client_secret: null
 */
export const createCheckoutSetupIntent = async () => {
  const response = await api.post(ENDPOINTS.CHECKOUT_SETUP_INTENT);
  const body = response.data;
  const data = body?.data && !Array.isArray(body.data) ? body.data : body;
  return {
    status: body?.status,
    message: body?.message,
    payment_required: data?.payment_required !== false,
    client_secret: data?.client_secret ?? null,
    setup_intent_id: data?.setup_intent_id ?? null,
    customer_id: data?.customer_id ?? null,
    subtotal: Number(data?.subtotal) || 0,
    discount: Number(data?.discount) || 0,
    total: Number(data?.total) || 0,
    currency: data?.currency || 'USD',
  };
};

/**
 * POST /api/checkout/place-order
 * Body: billing fields + payment_method (pm_...) when payment is required.
 * Omit payment_method when checkout setup-intent returned payment_required: false.
 * Success: status true/"success" and data.payment_status === 'succeeded' (when charged).
 */
export const placeOrder = async payload => {
  const response = await api.post(ENDPOINTS.PLACE_ORDER, payload);
  return response.data;
};

/** GET /api/orders — data[] + pagination */
export const getOrders = async (params = {}) => {
  const response = await api.get(ENDPOINTS.GET_ORDERS, {
    params: { page: params.page ?? 1, per_page: params.per_page ?? 20 },
  });
  const body = response.data;
  return {
    items: asList(body),
    pagination: body?.pagination ?? null,
    status: body?.status,
  };
};

/** GET /api/orders/{id} — data with billing + items */
export const getOrder = async id => {
  const response = await api.get(ENDPOINTS.GET_ORDER(id));
  const body = response.data;
  return body?.data && !Array.isArray(body.data) ? body.data : null;
};
