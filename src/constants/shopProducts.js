import { shopCap, shopGlasses } from '../assets/images';

/** ClayMaster-App-UI `Shop.tsx` / `ProductDetail.tsx` product catalog */
export const SHOP_PRODUCTS = [
  {
    id: 1,
    name: 'ClayMaster Cap',
    price: 25,
    image: shopCap,
    desc: 'Premium quality cap with embroidered ClayMaster logo. Adjustable strap, breathable mesh back. Perfect for range days and competitions.',
  },
  {
    id: 2,
    name: 'Shooting Glasses',
    price: 45,
    image: shopGlasses,
    desc: 'High-contrast polycarbonate lenses with UV400 protection. Lightweight frame with anti-slip nose pads for all-day comfort.',
  },
  {
    id: 3,
    name: 'Training Manual',
    price: 35,
    image: shopCap,
    desc: 'Comprehensive 120-page training guide covering stance, mount, lead methods, and competition strategy by Kevin DeMichiel.',
  },
  {
    id: 4,
    name: 'Shell Pouch',
    price: 30,
    image: shopGlasses,
    desc: 'Durable canvas shell pouch with belt clip. Holds 50+ shells. Water-resistant lining. Available in orange and olive.',
  },
];

export const getShopProduct = id =>
  SHOP_PRODUCTS.find(p => p.id === Number(id)) || SHOP_PRODUCTS[0];
