import { Cart, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import ElementCreator from '../../../util/ElementCreator';
import './BasketContent.css';

import { CartAPI } from '../../../api/CartAPI';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import { LocaleStorage } from '../../../api/LocaleStorage';
import { route } from '../../../router/router';
import { InputField } from '../../../util/input_field/InputField';

export default class BasketContent extends ElementCreator {
  private tokenCacheStore: TokenCacheStore;

  constructor(tokenCacheStore: TokenCacheStore) {
    const params = {
      tag: 'section',
      classNames: ['main-basket-view'],
    };
    super(params);
    this.tokenCacheStore = tokenCacheStore;
    this.callMethods();
  }

  async callMethods(): Promise<void> {
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
    const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
    this.basketView();
    if (customerId) {
      this.getCart(customerId);
    } else if (anonymousId) {
      this.getAnonymousCart();
    }
  }

  basketView(): void {
    const BasketView = {
      tag: 'div',
      classNames: ['cart-container'],
    };
    const Basketdiv = new ElementCreator(BasketView);
    this.addInnerElement(Basketdiv);
    const BasketHeader = {
      tag: 'div',
      classNames: ['header-cart'],
    };
    const BasketHead = new ElementCreator(BasketHeader);
    Basketdiv.addInnerElement(BasketHead);
    const BasketHeadind = {
      tag: 'h3',
      classNames: ['heading'],
      textContent: 'Shopping Cart',
    };
    const BasketTitle = new ElementCreator(BasketHeadind);
    BasketHead.addInnerElement(BasketTitle);
    const BasketAction = {
      tag: 'h3',
      classNames: ['action'],
      textContent: 'Remove all',
      callback: (): void => {
        this.deleteCart();
      },
    };
    const BasketRemoveItems = new ElementCreator(BasketAction);
    BasketHead.addInnerElement(BasketRemoveItems);
    document.addEventListener('DOMContentLoaded', () => {
      const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
      const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
      if (!customerId && !anonymousId) {
        this.emptyCart();
      }
    });
  }

  async getCart(customerId: string): Promise<void> {
    try {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const cart = await cartAPI.getCartByCustomerId(customerId);
      console.log(cart);
      this.cartItems(cart);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getAnonymousCart(): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    if (cartId) {
      try {
        const cartAPI = new CartAPI(new TokenCacheStore());
        const cart = await cartAPI.getAnonymousCartById(cartId);
        console.log(cart);
        this.cartItems(cart);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  cartItems(products: ClientResponse<Cart>): void {
    const Basketdiv = document.querySelector('.cart-container') as HTMLElement;
    const LineItems = products.body.lineItems;
    if (LineItems.length === 0) {
      this.emptyCart();
    } else {
      LineItems.forEach((product) => {
        const Productdiv = this.createProductDiv(product);
        Basketdiv.appendChild(Productdiv);
      });

      this.cartFotter(products);
    }
  }

  emptyCart(): void {
    const Basketdiv = document.querySelector('.cart-container') as HTMLElement;
    Basketdiv.innerHTML = '';
    const emptyCartConfig = {
      tag: 'div',
      classNames: ['cart-empty'],
      textContent: 'Your Cart is Empty',
    };
    const emptyCartButton = {
      tag: 'button',
      classNames: ['cart-empty-Button'],
      textContent: 'Catalog page',
      attributes: [{ name: 'href', value: '/catalog' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        LocaleStorage.clearLocalStorage(LocaleStorage.TOKEN);
        route(mouseEvent);
      },
    };

    const Productdiv = new ElementCreator(emptyCartConfig).getElement();
    const Productbutton = new ElementCreator(emptyCartButton).getElement();
    Basketdiv.appendChild(Productdiv);
    Productdiv.appendChild(Productbutton);
  }

  private createProductDiv(product: LineItem): HTMLElement {
    const ProductView = {
      tag: 'div',
      classNames: ['cart-product'],
      attributes: [{ name: 'id', value: `${product.name.en}` }],
    };

    const Productdiv = new ElementCreator(ProductView).getElement();
    Productdiv.appendChild(this.createProductImage(product));
    Productdiv.appendChild(this.createProductTitle(product));
    Productdiv.appendChild(this.createProductCounter(product));
    Productdiv.appendChild(this.createProductPrice(product));

    return Productdiv;
  }

  private createProductImage(product: LineItem): HTMLElement {
    const productImage = product.variant.images && product.variant.images.length > 0 ? product.variant.images[0] : null;

    const ProductPhoto = {
      tag: 'img',
      classNames: ['cart-img'],
      attributes: [{ name: 'src', value: `${productImage?.url}` }],
    };

    return new ElementCreator(ProductPhoto).getElement();
  }

  private createProductTitle(product: LineItem): HTMLElement {
    const ProductTitleparams = {
      tag: 'div',
      classNames: ['product-title'],
      textContent: product.name.en,
    };

    return new ElementCreator(ProductTitleparams).getElement();
  }

  private createProductCounter(product: LineItem): HTMLElement {
    const CounterView = {
      tag: 'div',
      classNames: ['cart-counter'],
    };

    const ProductCounter = new ElementCreator(CounterView).getElement();
    ProductCounter.appendChild(this.createProductCounterButtons(product));
    ProductCounter.appendChild(this.createProductCounterNumber(product));

    return ProductCounter;
  }

  private createProductCounterButtons(product: LineItem): HTMLElement {
    const BtnView = {
      tag: 'div',
      classNames: ['cart-counter-container'],
    };

    const ProductBtnView = new ElementCreator(BtnView).getElement();
    ProductBtnView.appendChild(
      this.createCounterButton('icono-caretUp', (): void => {
        this.UpbuttonCount(product);
      })
    );
    ProductBtnView.appendChild(
      this.createCounterButton('icono-caretDown', (): void => {
        this.DownbuttonCount(product);
      })
    );

    return ProductBtnView;
  }

  private createCounterButton(className: string, callback: () => void): HTMLElement {
    const BtnView = {
      tag: 'div',
      classNames: [className],
      callback,
    };

    return new ElementCreator(BtnView).getElement();
  }

  private createProductCounterNumber(product: LineItem): HTMLElement {
    const CounterNumberView = {
      tag: 'div',
      classNames: ['cart-count'],
      textContent: `${product.quantity}`,
    };

    return new ElementCreator(CounterNumberView).getElement();
  }

  private createProductPrice(product: LineItem): HTMLElement {
    const PriceView = {
      tag: 'div',
      classNames: ['cart-price-container'],
    };

    const ProductPriceContainer = new ElementCreator(PriceView).getElement();
    ProductPriceContainer.appendChild(this.createPriceAmount(product));
    ProductPriceContainer.appendChild(this.createRemoveProductButton(product));

    return ProductPriceContainer;
  }

  private createPriceAmount(product: LineItem): HTMLElement {
    const PriceAmountView = {
      tag: 'div',
      classNames: ['cart-price'],
    };

    const UnitPiece = {
      tag: 'div',
      classNames: ['unit-price'],
      textContent: `$${(product.price.value.centAmount / 100).toFixed(2)}`,
    };

    const EverythingPrice = {
      tag: 'div',
      classNames: ['everything-price'],
      textContent: `$${(product.totalPrice.centAmount / 100).toFixed(2)}`,
    };

    const priceAmount = new ElementCreator(PriceAmountView).getElement();

    priceAmount.appendChild(new ElementCreator(UnitPiece).getElement());
    priceAmount.appendChild(new ElementCreator(EverythingPrice).getElement());

    return priceAmount;
  }

  private createRemoveProductButton(product: LineItem): HTMLElement {
    const RemoveProductView = {
      tag: 'div',
      classNames: ['cart-product-remove'],
      textContent: 'Remove',
      callback: (): void => {
        this.deleteProduct(product);
      },
    };

    return new ElementCreator(RemoveProductView).getElement();
  }

  cartFotter(products: ClientResponse<Cart>): void {
    const Basketdiv = document.querySelector('.cart-container') as HTMLElement;
    const ProductView = {
      tag: 'div',
      classNames: ['cart-footer'],
    };
    const Productdiv = new ElementCreator(ProductView).getElement();
    Basketdiv.appendChild(Productdiv);
    const ProductPromo = {
      tag: 'input',
      classNames: ['cart-Promo'],
      placeholderText: 'Apply Promo Code',
    };
    const ProductdivPromo = new InputField(ProductPromo).getElement();
    Productdiv.appendChild(ProductdivPromo);
    const ProductPromoButton = {
      tag: 'button',
      classNames: ['cart-Promo-button'],
      placeholderText: 'Apply Promo Code',
      textContent: 'Apply',
      callback: (): void => {
        this.checkPromo();
      },
    };
    const ProductdivPromoButton = new ElementCreator(ProductPromoButton).getElement();
    Productdiv.appendChild(ProductdivPromoButton);
    const ProductTotalPriceView = {
      tag: 'div',
      classNames: ['cart-total-price'],
      textContent: `Total Price: ${(products.body.totalPrice.centAmount / 100).toFixed(2)} USD`,
    };
    const ProductsTotalPrice = new ElementCreator(ProductTotalPriceView).getElement();
    Productdiv.appendChild(ProductsTotalPrice);
    const ProductPromoTotalPriceView = {
      tag: 'div',
      classNames: ['cart-total-price'],
    };
    const ProductsPromoTotalPrice = new ElementCreator(ProductPromoTotalPriceView).getElement();
    Productdiv.appendChild(ProductsPromoTotalPrice);
    const ProductOrderButtonView = {
      tag: 'button',
      classNames: ['cart-footer-button'],
      textContent: 'Checkout',
    };
    const ProductOrder = new ElementCreator(ProductOrderButtonView).getElement();
    Productdiv.appendChild(ProductOrder);
  }

  async deleteProduct(products: LineItem): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);

    if (customerId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getCartByCustomerId(customerId);
      await this.deleteThis(products, carts, cartAPI);
    } else if (anonymousId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getAnonymousCartById(cartId);
      await this.deleteThis(products, carts, cartAPI);
    }
  }

  async deleteThis(products: LineItem, carts: ClientResponse<Cart>, cartAPI: CartAPI): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    const RemoveProduct = document.getElementById(products.name.en);
    try {
      if (RemoveProduct && cartId) {
        const cart = await cartAPI.removeProduct(cartId, products.id, carts.body.version);
        RemoveProduct.remove();
        this.totalPriceCalc(cart);
        if (cart.body.lineItems.length === 0) {
          this.emptyCart();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  UpbuttonCount(product: LineItem): void {
    const CurrentProduct = document.getElementById(product.name.en);
    const CurrentValue = CurrentProduct?.getElementsByClassName('cart-count')[0];
    if (CurrentValue) {
      const currentValue = parseInt(CurrentValue.textContent || '0', 10);
      CurrentValue.textContent = (currentValue + 1).toString();
      this.ChangeQuantyty(currentValue + 1, product);
    }
  }

  DownbuttonCount(product: LineItem): void {
    const CurrentProduct = document.getElementById(product.name.en);
    const CurrentValue = CurrentProduct?.getElementsByClassName('cart-count')[0];

    if (CurrentValue) {
      const currentValue = parseInt(CurrentValue.textContent || '0', 10);
      if (currentValue > 1) {
        CurrentValue.textContent = (currentValue - 1).toString();
        this.ChangeQuantyty(currentValue - 1, product);
      }
    }
  }

  async ChangeQuantyty(currentValue: number, products: LineItem): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);

    if (customerId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getCartByCustomerId(customerId);
      this.ChangeQuantytyAPI(currentValue, products, carts, cartAPI, cartId);
    } else if (anonymousId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getAnonymousCartById(cartId);
      await this.ChangeQuantytyAPI(currentValue, products, carts, cartAPI, cartId);
    }
  }

  async ChangeQuantytyAPI(
    currentValue: number,
    products: LineItem,
    carts: ClientResponse<Cart>,
    cartAPI: CartAPI,
    cartId: string
  ): Promise<void> {
    // const ChangeProduct = document.getElementById(products.name.en);
    try {
      const cart = await cartAPI.changeQuantityProduct(cartId, products.id, carts.body.version, currentValue);
      const CurrentChangeMoney = cart.body.lineItems.find((lineItem: LineItem) => lineItem.id === products.id);
      const CurrentProduct = document.getElementById(products.name.en);
      const PriceElement = CurrentProduct?.getElementsByClassName('everything-price')[0] as HTMLElement;
      if (PriceElement) {
        PriceElement.textContent = `$${(CurrentChangeMoney.totalPrice.centAmount / 100).toFixed(2)}`;
      }
      this.totalPriceCalc(cart);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async deleteCart(): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);

    if (customerId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getCartByCustomerId(customerId);
      this.deleteThisCart(cartId, carts, cartAPI);
    } else if (anonymousId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getAnonymousCartById(cartId);
      this.deleteThisCart(cartId, carts, cartAPI);
    }
  }

  async deleteThisCart(cartId: string, carts: ClientResponse<Cart>, cartAPI: CartAPI): Promise<void> {
    try {
      await cartAPI.DeleteCartApi(cartId, carts.body.version);
      LocaleStorage.clearLocalStorage(LocaleStorage.ANONYMOUS_ID);
      LocaleStorage.clearLocalStorage(LocaleStorage.CART_ID);
      LocaleStorage.clearLocalStorage(LocaleStorage.CUSTOMER_ID);
      this.emptyCart();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  totalPriceCalc(cart: ClientResponse<Cart>) {
    const TotalPrice = document.getElementsByClassName('cart-total-price')[0] as HTMLElement;
    if (TotalPrice) {
      TotalPrice.textContent = `Total Price: $${(cart.body.totalPrice.centAmount / 100).toFixed(2)} USD`;
    }
  }

  async checkPromo(): Promise<void> {
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    const anonymousId = LocaleStorage.getValue(LocaleStorage.ANONYMOUS_ID);
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);

    if (customerId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getCartByCustomerId(customerId);
      this.addPromoToCart(cartId, carts);
    } else if (anonymousId && cartId) {
      const cartAPI = new CartAPI(new TokenCacheStore());
      const carts = await cartAPI.getAnonymousCartById(cartId);
      this.addPromoToCart(cartId, carts);
    }
  }

  async addPromoToCart(cartId: string, carts: ClientResponse<Cart>): Promise<void> {
    const InputPromo = document.querySelector('.cart-Promo>input') as HTMLInputElement;
    console.log(InputPromo.value);
    const cartAPI = new CartAPI(new TokenCacheStore());

    try {
      const cart = await cartAPI.addDiscountCodeToCart(cartId, InputPromo.value, carts.body.version);
      this.totalPriceCalc(cart);
      InputPromo.style.border = '1px solid #d012ff';
    } catch (error) {
      InputPromo.style.border = '1px solid red';
      console.error('Error:', error);
    }
  }
}
