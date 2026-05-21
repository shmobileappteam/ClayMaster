/** Helpers for shop / cart UI (local images + numeric prices from Redux cart) */

export const parseUnitPrice = price => {
  if (typeof price === 'number' && !Number.isNaN(price)) return price;
  return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
};

export const parseItemPrice = item => parseUnitPrice(item?.price);

export const formatPrice = amount => `$${Number(amount).toFixed(2)}`;

export const resolveProductImage = image => {
  if (image == null) return null;
  if (typeof image === 'number') return image;
  if (typeof image === 'string') {
    if (image.startsWith('http') || image.startsWith('file')) return { uri: image };
    return { uri: image };
  }
  return image;
};
