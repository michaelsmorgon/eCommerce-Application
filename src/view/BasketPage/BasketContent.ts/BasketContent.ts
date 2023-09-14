import { LineItem } from '@commercetools/platform-sdk';
import ElementCreator from '../../../util/ElementCreator';
import './BasketContent.css';

import { CartAPI } from '../../../api/CartAPI';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import { LocaleStorage } from '../../../api/LocaleStorage';

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
    this.basketView();
    this.getCart();
  }

  basketView(): void {
    const BasketView = {
      tag: 'div',
      classNames: ['Cart-Container'],
    };
    const Basketdiv = new ElementCreator(BasketView);
    this.addInnerElement(Basketdiv);

    const BasketHeader = {
      tag: 'div',
      classNames: ['Header'],
    };
    const BasketHead = new ElementCreator(BasketHeader);
    Basketdiv.addInnerElement(BasketHead);

    const BasketHeadind = {
      tag: 'h3',
      classNames: ['Heading'],
      textContent: 'Shopping Cart',
    };
    const BasketTitle = new ElementCreator(BasketHeadind);
    BasketHead.addInnerElement(BasketTitle);

    const BasketAction = {
      tag: 'h3',
      classNames: ['Action'],
      textContent: 'Remove all',
    };
    const BasketRemoveItems = new ElementCreator(BasketAction);
    BasketHead.addInnerElement(BasketRemoveItems);
  }

  async getCart(): Promise<void> {
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
    console.log(customerId);
    if (customerId) {
      try {
        const cartAPI = new CartAPI(new TokenCacheStore());
        const cart = await cartAPI.getCartByCustomerId(customerId);

        const CartProducts = cart.body.lineItems;
        this.cartItems(CartProducts);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Customer ID is undefined.');
    }
  }

  cartItems(products: LineItem[]): void {
    const Basketdiv = document.querySelector('.Cart-Container') as HTMLElement;
    console.log(products);

    products.forEach((product) => {
      const Productdiv = this.createProductDiv(product);
      Basketdiv.appendChild(Productdiv);
    });

    this.cartFotter(products);
  }

  private createProductDiv(product: LineItem): HTMLElement {
    const ProductView = {
      tag: 'div',
      classNames: ['Cart-product'],
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
      classNames: ['Cart-img'],
      attributes: [{ name: 'src', value: `${productImage?.url}` }],
    };

    return new ElementCreator(ProductPhoto).getElement();
  }

  private createProductTitle(product: LineItem): HTMLElement {
    const ProductTitleparams = {
      tag: 'h1',
      classNames: ['ProductTitle'],
      textContent: product.name.en,
    };

    return new ElementCreator(ProductTitleparams).getElement();
  }

  private createProductCounter(product: LineItem): HTMLElement {
    const CounterView = {
      tag: 'div',
      classNames: ['Cart-counter'],
    };

    const ProductCounter = new ElementCreator(CounterView).getElement();
    ProductCounter.appendChild(this.createProductCounterButtons());
    ProductCounter.appendChild(this.createProductCounterNumber(product));

    return ProductCounter;
  }

  private createProductCounterButtons(): HTMLElement {
    const BtnView = {
      tag: 'div',
      classNames: ['Cart-counter-container'],
    };

    const ProductBtnView = new ElementCreator(BtnView).getElement();
    ProductBtnView.appendChild(this.createCounterButton('icono-caretUp'));
    ProductBtnView.appendChild(this.createCounterButton('icono-caretDown'));

    return ProductBtnView;
  }

  private createCounterButton(className: string): HTMLElement {
    const BtnView = {
      tag: 'div',
      classNames: [className],
    };

    return new ElementCreator(BtnView).getElement();
  }

  private createProductCounterNumber(product: LineItem): HTMLElement {
    const CounterNumberView = {
      tag: 'div',
      classNames: ['Cart-count'],
      textContent: `${product.quantity}`,
    };

    return new ElementCreator(CounterNumberView).getElement();
  }

  private createProductPrice(product: LineItem): HTMLElement {
    const PriceView = {
      tag: 'div',
      classNames: ['Cart-Price-container'],
    };

    const ProductPriceContainer = new ElementCreator(PriceView).getElement();
    ProductPriceContainer.appendChild(this.createPriceAmount(product));
    ProductPriceContainer.appendChild(this.createRemoveProductButton());

    return ProductPriceContainer;
  }

  private createPriceAmount(product: LineItem): HTMLElement {
    const PriceAmountView = {
      tag: 'div',
      classNames: ['Cart-Price'],
      textContent: `$${product.totalPrice.centAmount / 100}-$${
        (product.totalPrice.centAmount * product.quantity) / 100
      }`,
    };

    return new ElementCreator(PriceAmountView).getElement();
  }

  private createRemoveProductButton(): HTMLElement {
    const RemoveProductView = {
      tag: 'div',
      classNames: ['Cart-Product-remove'],
      textContent: 'Remove',
    };

    return new ElementCreator(RemoveProductView).getElement();
  }

  cartFotter(products: LineItem[]): void {
    const Basketdiv = document.querySelector('.Cart-Container') as HTMLElement;
    console.log(products);
    const ProductView = {
      tag: 'div',
      classNames: ['Cart-footer'],
    };
    const Productdiv = new ElementCreator(ProductView).getElement();
    Basketdiv.appendChild(Productdiv);

    const totalPriceCentAmount = products.reduce((total, product) => {
      return total + product.price.value.centAmount * product.quantity;
    }, 0);

    const ProductTotalPriceView = {
      tag: 'div',
      classNames: ['Cart-TotalPrice'],
      textContent: `Total Price: ${totalPriceCentAmount / 100} USD`,
    };
    const ProductsTotalPrice = new ElementCreator(ProductTotalPriceView).getElement();
    Productdiv.appendChild(ProductsTotalPrice);

    const ProductOrderButtonView = {
      tag: 'button',
      classNames: ['Cart-footer-button'],
      textContent: 'Checkout',
    };
    const ProductOrder = new ElementCreator(ProductOrderButtonView).getElement();
    Productdiv.appendChild(ProductOrder);
  }
}
