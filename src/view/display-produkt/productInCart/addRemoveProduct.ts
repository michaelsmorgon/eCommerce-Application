import { Cart, ClientResponse } from '@commercetools/platform-sdk';
import { CartAPI } from '../../../api/CartAPI';
import { LocaleStorage } from '../../../api/LocaleStorage';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import { ProductAPI } from '../../../api/ProductAPI';

export default class ShoppingCartManager {
  private productKey: string;

  private productId: string | undefined;

  constructor(productKey: string) {
    this.productKey = productKey;
  }

  public create(): void {
    const tokenCacheStore = new TokenCacheStore();
    const products = new ProductAPI(tokenCacheStore);

    products.getProductByKey(this.productKey).then((product) => {
      if (product) {
        const productId = product.body.id;
        this.productId = productId;
        console.log(`create: ${product.body.id}`);
      }
    });
  }

  handleAddToCartClick(): void {
    if (this.productId !== undefined) {
      console.log(`click: ${this.productId}`);
      const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
      const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
      if (cartId) {
        this.addProductToCart(customerId, cartId, this.productId);
      } else {
        const cart = new CartAPI(new TokenCacheStore());
        if (customerId) {
          cart.createCustomerCart(customerId).then((cartInfo) => {
            LocaleStorage.saveLocalStorage(LocaleStorage.CART_ID, cartInfo.body.id);
            this.addProduct(cart, cartInfo, this.productId || '');
          });
        } else {
          cart.createAnonymousCart().then((cartInfo) => {
            LocaleStorage.saveLocalStorage(LocaleStorage.CART_ID, cartInfo.body.id);
            LocaleStorage.saveLocalStorage(LocaleStorage.ANONYMOUS_ID, cartInfo.body.anonymousId);
            this.addProduct(cart, cartInfo, this.productId || '');
          });
        }
      }
    } else {
      console.error('productId is undefined');
    }
  }

  private async addProductToCart(customerId: string | undefined, cartId: string, productId: string): Promise<void> {
    const cart = new CartAPI(new TokenCacheStore());
    try {
      let cartInfo: ClientResponse<Cart>;

      if (customerId) {
        cartInfo = await cart.getCartByCustomerId(customerId);
      } else {
        cartInfo = await cart.getAnonymousCartById(cartId);
      }

      this.addProduct(cart, cartInfo, productId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  private async addProduct(cart: CartAPI, cartInfo: ClientResponse<Cart>, productId: string): Promise<void> {
    await cart.addProductToAnonymousCart(cartInfo.body.id, productId, cartInfo.body.version, 1);
  }

  handleRemoveFromCartClick(): void {
    if (this.productId !== undefined) {
      const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
      const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);

      if (cartId) {
        this.removeProductFromCart(customerId, cartId, this.productId);
      } else {
        console.error('Cart ID is not available.');
      }
    } else {
      console.error('Product ID is undefined.');
    }
  }

  private async removeProductFromCart(
    customerId: string | undefined,
    cartId: string,
    productId: string
  ): Promise<void> {
    const cart = new CartAPI(new TokenCacheStore());

    try {
      let cartInfo: ClientResponse<Cart>;

      if (customerId) {
        cartInfo = await cart.getCartByCustomerId(customerId);
      } else {
        cartInfo = await cart.getAnonymousCartById(cartId);
      }

      if (cartInfo && cartInfo.body.lineItems.length > 0) {
        const lineItem = cartInfo.body.lineItems.find((item) => item.productId === productId);

        if (lineItem) {
          await cart.removeProduct(cartInfo.body.id, lineItem.id, cartInfo.body.version);
          console.log('Product removed from cart.');
        } else {
          console.error('Product not found in cart.');
        }
      } else {
        console.error('Cart is empty.');
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  }
}
