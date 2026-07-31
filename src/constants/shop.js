/** Shop payload helpers — Printify products, cart prices in cents. */

const decodeHtml = html =>
  String(html || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

export const stripHtml = html =>
  decodeHtml(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Parse Printify/HTML description into intro + feature/care bullet lists
 * (matches ClayMaster web PDP "Product Features" / "Care Instructions").
 */
export const parseProductDescription = html => {
  const raw = decodeHtml(html || '');
  if (!raw.trim()) {
    return { intro: '', features: [], care: [] };
  }

  const sections = [];
  const headingRe =
    /<(?:h[1-6]|p|strong|b)[^>]*>\s*(Product Features|Care Instructions|Features|Care)\s*:?\s*<\/(?:h[1-6]|p|strong|b)>/gi;
  let lastIndex = 0;
  let match;
  const markers = [];

  while ((match = headingRe.exec(raw))) {
    markers.push({
      title: match[1].trim().toLowerCase(),
      index: match.index,
      end: match.index + match[0].length,
    });
  }

  if (!markers.length) {
    // Fallback: first <p> as intro, consecutive <ul> as features then care
    const introMatch = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const lists = [...raw.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)].map(m =>
      [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(li =>
        stripHtml(li[1]),
      ).filter(Boolean),
    );
    return {
      intro: introMatch ? stripHtml(introMatch[1]) : stripHtml(raw),
      features: lists[0] || [],
      care: lists[1] || [],
    };
  }

  const before = raw.slice(0, markers[0].index);
  const introP = before.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const intro = introP ? stripHtml(introP[1]) : stripHtml(before);

  markers.forEach((marker, i) => {
    const end = markers[i + 1]?.index ?? raw.length;
    const chunk = raw.slice(marker.end, end);
    const items = [...chunk.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(li => stripHtml(li[1]))
      .filter(Boolean);
    sections.push({ title: marker.title, items });
  });

  const features =
    sections.find(s => s.title.includes('feature'))?.items || [];
  const care = sections.find(s => s.title.includes('care'))?.items || [];

  return { intro, features, care };
};

/** Cart/variant prices come in cents (2500 = $25). */
export const centsToDollars = value => (Number(value) || 0) / 100;

export const formatMoney = amount => `$${(Number(amount) || 0).toFixed(2)}`;

const values = option => (Array.isArray(option?.values) ? option.values : []);

export const getColorOption = product =>
  (product?.options || []).find(
    o =>
      o?.type === 'color' ||
      String(o?.name || '').toLowerCase().includes('color'),
  ) || null;

export const getSizeOption = product =>
  (product?.options || []).find(
    o =>
      o?.type === 'size' ||
      String(o?.name || '').toLowerCase().includes('size'),
  ) || null;

export const getEnabledVariants = product =>
  (product?.variants || []).filter(v => v?.is_enabled !== false);

export const isVariantInStock = variant => {
  if (!variant) return false;
  if (variant.is_available === false) return false;
  if (variant.is_enabled === false) return false;
  if (typeof variant.quantity === 'number' && variant.quantity <= 0) {
    return false;
  }
  return true;
};

export const getInStockVariants = product =>
  getEnabledVariants(product).filter(isVariantInStock);

/** Variant whose option-value ids contain every selected id. */
export const findVariant = (product, selectedIds = [], { inStockOnly = false } = {}) => {
  const pool = inStockOnly
    ? getInStockVariants(product)
    : getEnabledVariants(product);
  const wanted = selectedIds.filter(id => id != null);
  if (!wanted.length) return pool[0] || null;
  return (
    pool.find(v => wanted.every(id => (v.options || []).includes(id))) || null
  );
};

/** Size option values that have at least one in-stock variant. */
export const getAvailableSizes = product => {
  const sizeOpt = getSizeOption(product);
  if (!sizeOpt?.values?.length) return [];
  const stocked = getInStockVariants(product);
  return sizeOpt.values.filter(size =>
    stocked.some(v => (v.options || []).includes(size.id)),
  );
};

/** Color option values in stock for a given size id. */
export const getAvailableColorsForSize = (product, sizeId) => {
  const colorOpt = getColorOption(product);
  if (!colorOpt?.values?.length || sizeId == null) return [];
  const stocked = getInStockVariants(product).filter(v =>
    (v.options || []).includes(sizeId),
  );
  return colorOpt.values.filter(color =>
    stocked.some(v => (v.options || []).includes(color.id)),
  );
};

/** Resolve in-stock variant for size + color. */
export const findVariantBySizeColor = (product, sizeId, colorId) => {
  if (sizeId == null || colorId == null) return null;
  return findVariant(product, [sizeId, colorId], { inStockOnly: true });
};

/** Cart line for a variant, if present. */
export const findCartLine = (cartItems, variantId) => {
  if (!variantId || !Array.isArray(cartItems)) return null;
  const id = String(variantId);
  return (
    cartItems.find(item => String(item.variant_id) === id) || null
  );
};

export const imageForVariant = (product, variantId) => {
  const gallery = galleryImagesForVariant(product, variantId);
  return gallery[0] || null;
};

/** Unique image URLs for a variant (or all product images). */
export const galleryImagesForVariant = (product, variantId) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  if (!images.length) return [];

  let matched = variantId
    ? images.filter(img => (img.variant_ids || []).includes(variantId))
    : [];

  if (!matched.length && variantId) {
    // Broader: any image shared with variants that include this variant id
    matched = images.filter(img =>
      (img.variant_ids || []).some(id => id === variantId),
    );
  }

  const pool = matched.length ? matched : images;
  const seen = new Set();
  const urls = [];
  for (const img of pool) {
    const src = img?.src;
    if (src && !seen.has(src)) {
      seen.add(src);
      urls.push(src);
    }
  }
  return urls;
};

/** Grid card summary: default image + lowest enabled variant price. */
export const mapProductCard = product => {
  if (!product?.id) return null;
  const variants = getEnabledVariants(product);
  const prices = variants
    .map(v => Number(v.price))
    .filter(p => !Number.isNaN(p) && p > 0);
  return {
    id: product.id,
    title: (product.title || '').trim(),
    image: imageForVariant(product, null),
    priceFrom: prices.length ? centsToDollars(Math.min(...prices)) : null,
    raw: product,
  };
};

/** Resolve option value titles/ids for a variant (for cart payload). */
export const optionSelectionForVariant = (product, variant) => {
  const result = { size: '', size_id: '', color: '', color_id: '' };
  if (!variant) return result;
  const ids = variant.options || [];

  const sizeValue = values(getSizeOption(product)).find(v => ids.includes(v.id));
  if (sizeValue) {
    result.size = sizeValue.title || '';
    result.size_id = String(sizeValue.id);
  }
  const colorValue = values(getColorOption(product)).find(v =>
    ids.includes(v.id),
  );
  if (colorValue) {
    result.color = colorValue.title || '';
    result.color_id = String(colorValue.id);
  }
  return result;
};

/** POST /api/cart/add body from a product + resolved variant. */
export const buildCartPayload = (product, variant, quantity = 1) => {
  const selection = optionSelectionForVariant(product, variant);
  return {
    product_id: String(product.id),
    variant_id: String(variant.id),
    quantity,
    size: selection.size,
    color: selection.color,
    size_id: selection.size_id,
    color_id: selection.color_id,
    product_title: (product.title || '').trim(),
    variant_price: Number(variant.price) || 0,
    variant_image: imageForVariant(product, variant.id) || '',
  };
};

export const ORDER_STATUS_COLORS = {
  Pending: '#D97706',
  Processing: '#2563EB',
  Shipped: '#7C3AED',
  Delivered: '#16A34A',
  Cancelled: '#DC2626',
};

export const formatOrderDate = value => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};
