import { rest } from 'msw';
import { uuid } from '../utils/uuid';
import mockProductsData from './mockProductsData.json';
import mockCouponData from './mockCouponData.json';
import {
  CART_ITEMS_PATH_NAME,
  CART_LIST_KEY,
  COUPONS_PATH_NAME,
  PRODUCTS_PATH_NAME,
  USERS_COUPON_PATH_NAME,
} from '../constant';
import LocalStorage from '../utils/LocalStorage';
import type { CartProduct, Coupon } from '../types/product';

const mockProducts = mockProductsData.products;
const mockCoupons = mockCouponData;
const usersCoupon: Coupon[] = [];
const cartList: CartProduct[] = LocalStorage.getItem(CART_LIST_KEY) || [];

const updateLocalStorage = () => {
  LocalStorage.setItem(CART_LIST_KEY, cartList);
};

interface PostAddCartRequestBody {
  productId: number;
}

interface PatchUpdateCartRequestBody {
  quantity: number;
}

interface PostCouponsMe {
  couponId: number;
}

export const productHandler = [
  rest.get(PRODUCTS_PATH_NAME, (req, res, ctx) => {
    return res(ctx.delay(1500), ctx.status(200), ctx.json(mockProducts));
  }),
];

export const cartHandler = [
  rest.get(CART_ITEMS_PATH_NAME, (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(cartList));
  }),
  rest.post<PostAddCartRequestBody>(
    CART_ITEMS_PATH_NAME,
    async (req, res, ctx) => {
      const { productId } = await req.json();
      const product = mockProducts.find((product) => product.id === productId);
      if (!product) {
        return res(ctx.status(500));
      }
      const newCartItem = {
        id: uuid(),
        quantity: 1,
        product,
      };
      cartList.push(newCartItem);
      updateLocalStorage();
      return res(ctx.delay(500), ctx.status(201));
    },
  ),
  rest.patch<PatchUpdateCartRequestBody>(
    `${CART_ITEMS_PATH_NAME}/:cartItemId`,
    async (req, res, ctx) => {
      const { cartItemId } = req.params;
      const { quantity } = await req.json();
      const targetCartItemIndex = cartList.findIndex(
        (cartItem) => cartItem.id === cartItemId,
      );
      cartList[targetCartItemIndex].quantity = quantity;
      updateLocalStorage();
      return res(ctx.status(200));
    },
  ),
  rest.delete(`${CART_ITEMS_PATH_NAME}/:cartItemId`, (req, res, ctx) => {
    const { cartItemId } = req.params;
    const targetCartItemIndex = cartList.findIndex(
      (cartItem) => cartItem.id === cartItemId,
    );
    cartList.splice(targetCartItemIndex, 1);
    updateLocalStorage();
    return res(ctx.delay(500), ctx.status(204));
  }),
];

export const couponHander = [
  rest.get(COUPONS_PATH_NAME, (req, res, ctx) => {
    const couponList = mockCoupons;

    return res(ctx.delay(1000), ctx.status(200), ctx.json(couponList));
  }),

  rest.get(USERS_COUPON_PATH_NAME, (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({ coupons: usersCoupon }),
    );
  }),

  rest.post<PostCouponsMe>(USERS_COUPON_PATH_NAME, async (req, res, ctx) => {
    const { couponId } = await req.json();

    if (usersCoupon.some((coupon) => coupon.id === couponId)) {
      return res(ctx.delay(500), ctx.status(400));
    }

    const targetCoupon = mockCoupons.coupons.find(
      (coupon) => coupon.id === couponId,
    );

    usersCoupon.push(targetCoupon as Coupon);
    return res(ctx.delay(500), ctx.status(200));
  }),
];
