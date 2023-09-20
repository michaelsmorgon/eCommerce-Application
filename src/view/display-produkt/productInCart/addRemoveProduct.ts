import { Cart, ClientResponse } from '@commercetools/platform-sdk';
import { CartAPI } from '../../../api/CartAPI';
import { LocaleStorage } from '../../../api/LocaleStorage';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import { ProductAPI } from '../../../api/ProductAPI';
import { BasketCounter } from '../../header/basket-counter';

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
      }
    });
  }

  private showWaitingIndicator(): void {
    const waitingIndicator = document.querySelector('.indicator');
    if (waitingIndicator) {
      waitingIndicator.classList.add('show-waiting');
    }
  }

  private hideWaitingIndicator(): void {
    const waitingIndicator = document.querySelector('.indicator');
    if (waitingIndicator) {
      waitingIndicator.classList.remove('show-waiting');
    }
  }

  async handleAddToCartClick(): Promise<void> {
    if (this.productId !== undefined) {
      const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
      const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);

      this.showWaitingIndicator();

      try {
        if (cartId) {
          await this.addProductToCart(customerId, cartId, this.productId);
        } else {
          const cart = new CartAPI(new TokenCacheStore());

          if (customerId) {
            const cartInfo = await cart.createCustomerCart(customerId);
            LocaleStorage.saveLocalStorage(LocaleStorage.CART_ID, cartInfo.body.id);
            await this.addProduct(cart, cartInfo, this.productId || '');
          } else {
            const cartInfo = await cart.createAnonymousCart();
            LocaleStorage.saveLocalStorage(LocaleStorage.CART_ID, cartInfo.body.id);
            LocaleStorage.saveLocalStorage(LocaleStorage.ANONYMOUS_ID, cartInfo.body.anonymousId);
            await this.addProduct(cart, cartInfo, this.productId || '');
          }
        }
        this.updateBasketCounter();
      } catch (error) {
        console.error('Error adding product to cart:', error);
      } finally {
        this.hideWaitingIndicator();
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

      const basketCounter = new BasketCounter('.basket-counter-container');
      basketCounter.render();
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  private async addProduct(cart: CartAPI, cartInfo: ClientResponse<Cart>, productId: string): Promise<void> {
    await cart.addProductToAnonymousCart(cartInfo.body.id, productId, cartInfo.body.version, 1);
  }

  async handleRemoveFromCartClick(): Promise<void> {
    if (this.productId !== undefined) {
      const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
      const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);

      this.showWaitingIndicator();

      try {
        if (cartId) {
          await this.removeProductFromCart(customerId, cartId, this.productId);
        } else {
          console.error('Cart ID is not available.');
        }
        this.updateBasketCounter();
      } catch (error) {
        console.error('Error removing product from cart:', error);
      } finally {
        this.hideWaitingIndicator();
      }
    } else {
      console.error('Product ID is undefined.');
    }
  }

  private async updateBasketCounter(): Promise<void> {
    const basketCounter = new BasketCounter('.basket-counter-container');
    basketCounter.render();
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

          this.updateBasketCounter();
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
