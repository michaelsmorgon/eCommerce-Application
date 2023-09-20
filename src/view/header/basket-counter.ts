import { Cart, ClientResponse } from '@commercetools/platform-sdk';
import { CartAPI } from '../../api/CartAPI';
import { LocaleStorage } from '../../api/LocaleStorage';
import { TokenCacheStore } from '../../api/TokenCacheStore';

export class BasketCounter {
  private container: HTMLElement | null;

  constructor(containerSelector: string) {
    this.container = document.querySelector(containerSelector);
  }

  async getCart(customerId: string): Promise<void> {
    if (customerId) {
      try {
        const cartAPI = new CartAPI(new TokenCacheStore());
        const cart = await cartAPI.getCartByCustomerId(customerId);
        this.updateItemCount(cart);
      } catch (error) {
        console.error('Error:', error);
      }
    } else if (this.container) {
      this.container.style.display = 'none';
    }
  }

  async getAnonymousCart(): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);

    if (cartId) {
      try {
        const cartAPI = new CartAPI(new TokenCacheStore());
        const cart = await cartAPI.getAnonymousCartById(cartId);
        this.updateItemCount(cart);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  private async updateItemCount(products: ClientResponse<Cart>): Promise<void> {
    if (this.container) {
      this.container.innerHTML = '';
      const itemCount = products.body.totalLineItemQuantity;
      const itemCountElement = document.createElement('div');
      itemCountElement.classList.add('shopping-cart-quantity');
      itemCountElement.innerHTML = '';
      itemCountElement.textContent = `${itemCount}`;
      this.container.style.display = 'flex';
      if (!itemCount) {
        this.container.style.display = 'none';
      }

      this.container.appendChild(itemCountElement);
    }
  }

  public deleteCounter(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  public render(): void {
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
    if (customerId) {
      this.getCart(customerId);
    }

    const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
    if (anonymousId) {
      this.getAnonymousCart();
    }
  }
}
