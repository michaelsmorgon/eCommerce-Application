import { Cart, ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import ElementCreator, { ElementConfig, IAttribute } from '../../../util/ElementCreator';
import View, { ViewParams } from '../../View';
import { route } from '../../../router/router';
import { QueryString } from '../query/QueryString';
import './catalog-card.css';
import { LocaleStorage } from '../../../api/LocaleStorage';
import { CartAPI } from '../../../api/CartAPI';
import { TokenCacheStore } from '../../../api/TokenCacheStore';

const CssClassesCard = {
  CATALOG_SECTION_PRODUCT: 'catalog-section__product',
  CATALOG_SECTION_PRODUCT_LINK: 'catalog-section__product-link',
  CATALOG_SECTION_IMAGE_CONTAINER: 'catalog-section__image-container',
  CATALOG_SECTION_IMAGE: 'catalog-section__image',
  CATALOG_SECTION_NAME_CONTAINER: 'catalog-section__name-container',
  CATALOG_SECTION_NAME: 'catalog-section__name',
  CATALOG_SECTION_DESC_CONTAINER: 'catalog-section__desc-container',
  CATALOG_SECTION_DESC: 'catalog-section__desc',
  CATALOG_SECTION_PRICE: 'catalog-section__price',
  PRICE_NEW: 'price__new',
  PRICE_OLD: 'price__old',
  DISCOUNT: 'catalog-section__discount',
  CATALOG_SECTION_CART: 'catalog-section__cart',
  CATALOG_SECTION_IN_CART: 'catalog-section__in-cart',
  CART_HIDE: 'cart-hide',
};

export class CatalogCard extends View {
  constructor(
    private productData: ProductProjection,
    private productKey: string = ''
  ) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesCard.CATALOG_SECTION_PRODUCT],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCard.CATALOG_SECTION_PRODUCT_LINK],
      textContent: '',
      attributes: [
        { name: 'href', value: `/catalog/${this.productKey}` },
        { name: 'id', value: this.productData.id },
      ],
      callback: async (event: Event) => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    };
    const link = new ElementCreator(params);

    const discount = this.getDiscount();
    if (discount !== null) {
      link.addInnerElement(this.addDiscount(discount));
    }
    link.addInnerElement(this.addImage());
    link.addInnerElement(this.addTitle());
    link.addInnerElement(this.addPrice(discount));
    this.viewElementCreator.addInnerElement(link.getElement());
  }

  private addImage(): ElementCreator {
    const attr: IAttribute[] = [];
    if (this.productData.masterVariant.images && this.productData.masterVariant.images?.length > 0) {
      const [imageUrl] = this.productData.masterVariant.images;
      attr.push({ name: 'src', value: imageUrl.url });
    }

    attr.push({ name: 'alt', value: this.productData.name.en });

    const imgContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCard.CATALOG_SECTION_IMAGE_CONTAINER],
    };
    const imgContainer = new ElementCreator(imgContainerParams);

    const imgParams: ElementConfig = {
      tag: 'img',
      classNames: [CssClassesCard.CATALOG_SECTION_IMAGE],
      attributes: attr,
    };
    const image = new ElementCreator(imgParams);
    imgContainer.addInnerElement(image);

    return imgContainer;
  }

  private addTitle(): ElementCreator {
    const queryString = new QueryString(decodeURIComponent(document.location.search.replace('?', '')));
    const searchText = queryString.getSearchText();
    const containerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCard.CATALOG_SECTION_NAME_CONTAINER],
    };
    const container = new ElementCreator(containerParams);

    const nameParams: ElementConfig = {
      tag: 'h3',
      classNames: [CssClassesCard.CATALOG_SECTION_NAME],
      // textContent: this.productData.name.en.replace(searchText, `<span class='select_text'>${searchText}</span>`),
    };
    const name = new ElementCreator(nameParams);
    const nameElem = name.getElement();
    const pattern = new RegExp(searchText, 'gi');
    nameElem.innerHTML = this.productData.name.en.replace(pattern, `<span class='select_text'>${searchText}</span>`);
    container.addInnerElement(name);
    container.addInnerElement(this.addDescription());

    return container;
  }

  private addDescription(): ElementCreator {
    const descParams: ElementConfig = {
      tag: 'p',
      classNames: [CssClassesCard.CATALOG_SECTION_DESC],
      textContent: this.productData.metaDescription?.en,
    };
    const description = new ElementCreator(descParams);

    return description;
  }

  private addPrice(discount: string | null): ElementCreator {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCard.CATALOG_SECTION_PRICE],
    };
    const priceContainer = new ElementCreator(params);

    const prices = [...(this.productData.masterVariant.prices || [])];
    let productPrice = '';
    let priceWithDiscount = '';
    if (prices && prices[0]) {
      const calcPrice = prices[0].value.centAmount / 100;
      productPrice = `${calcPrice.toFixed(2)} ${prices[0].value.currencyCode}`;
      if (discount !== null) {
        priceWithDiscount = `${((calcPrice * (100 - +discount)) / 100).toFixed(2)} ${prices[0].value.currencyCode}`;
      }
    }

    const newPrice = this.addElementPrice(
      CssClassesCard.PRICE_NEW,
      discount !== null ? priceWithDiscount : productPrice
    );
    priceContainer.addInnerElement(newPrice);

    const oldPrice = this.addElementPrice(CssClassesCard.PRICE_OLD, productPrice);
    priceContainer.addInnerElement(oldPrice);

    this.createCartBtn(priceContainer);

    return priceContainer;
  }

  private addElementPrice(className: string, priceValue: string): ElementCreator {
    const priceParams: ElementConfig = {
      tag: 'div',
      classNames: [className],
      textContent: priceValue,
    };
    return new ElementCreator(priceParams);
  }

  private addDiscount(text: string): ElementCreator {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCard.DISCOUNT],
      textContent: `${text}%`,
    };
    const discount = new ElementCreator(params);

    return discount;
  }

  private getDiscount(): string | null {
    const attrs = this.productData.masterVariant.attributes;
    const res = attrs?.find((attr) => attr.name === 'discount');
    if (res?.value.label) {
      return res?.value.label.slice(0, -1);
    }

    return null;
  }

  private createCartBtn(priceContainer: ElementCreator): void {
    const cartResponse = this.isProductInCart();
    if (cartResponse !== null) {
      cartResponse.then((cartInfo) => {
        const res = cartInfo.body.lineItems.find((lineItem) => lineItem.productId === this.productData.id);
        const cartBtn = this.addCartBtn(res !== undefined);
        priceContainer.addInnerElement(cartBtn);
        const inCartBtn = this.addInCartBtn(res === undefined);
        priceContainer.addInnerElement(inCartBtn);
      });
    } else {
      const cartBtn = this.addCartBtn(false);
      priceContainer.addInnerElement(cartBtn);
      const inCartBtn = this.addInCartBtn(true);
      priceContainer.addInnerElement(inCartBtn);
    }
  }

  private addCartBtn(isHide: boolean = false): ElementCreator {
    const classes = [CssClassesCard.CATALOG_SECTION_CART];
    if (isHide) {
      classes.push(CssClassesCard.CART_HIDE);
    }
    const params: ElementConfig = {
      tag: 'button',
      classNames: classes,
      textContent: 'Add to Cart',
      callback: async (event: Event) => {
        event.stopPropagation();
        let productId: string = '';
        if (event.target instanceof Element) {
          const productNode = event.target.parentNode?.parentNode as HTMLDivElement;
          productId = productNode.id;
        }
        this.cartBtnHandler(event, productId);
      },
    };
    return new ElementCreator(params);
  }

  private cartBtnHandler(event: Event, productId: string): void {
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    if (cartId) {
      const cart = new CartAPI(new TokenCacheStore());
      if (customerId) {
        cart.getCartByCustomerId(customerId).then((cartInfo) => {
          this.addProduct(event, cart, cartInfo, productId);
        });
      } else {
        cart.getAnonymousCartById(cartId).then((cartInfo) => {
          this.addProduct(event, cart, cartInfo, productId);
        });
      }
    } else {
      const token = new TokenCacheStore();
      const cart = new CartAPI(token);
      if (customerId) {
        cart.createCustomerCart(customerId).then((cartInfo) => {
          LocaleStorage.saveLocalStorage(LocaleStorage.CART_ID, cartInfo.body.id);
          this.addProduct(event, cart, cartInfo, productId);
        });
      } else {
        cart.createAnonymousCart().then((cartInfo) => {
          LocaleStorage.saveLocalStorage(LocaleStorage.CART_ID, cartInfo.body.id);
          LocaleStorage.saveLocalStorage(LocaleStorage.ANONYMOUS_ID, cartInfo.body.anonymousId);
          this.addProduct(event, cart, cartInfo, productId);
        });
      }
    }
  }

  private addInCartBtn(isHide: boolean = true): ElementCreator {
    const params: ElementConfig = {
      tag: 'button',
      classNames: [CssClassesCard.CATALOG_SECTION_IN_CART, isHide ? CssClassesCard.CART_HIDE : 'test'],
      textContent: 'In Cart',
    };
    return new ElementCreator(params);
  }

  private addProduct(event: Event, cart: CartAPI, cartInfo: ClientResponse, productId: string): void {
    cart
      .addProductToAnonymousCart(cartInfo.body.id, productId, cartInfo.body.version, 1)
      .then(() => {
        const target = event.target as HTMLButtonElement;
        target.classList.add(CssClassesCard.CART_HIDE);

        target.nextElementSibling?.classList.remove(CssClassesCard.CART_HIDE);
      })
      .catch((error) => console.error(error));
  }

  private isProductInCart(): Promise<ClientResponse<Cart>> | null {
    const customerId = LocaleStorage.getValue(LocaleStorage.CUSTOMER_ID);
    const cartId = LocaleStorage.getValue(LocaleStorage.CART_ID);
    if (customerId && cartId) {
      const cart = new CartAPI(new TokenCacheStore());
      return cart.getCartByCustomerId(customerId);
    }
    if (cartId) {
      const cart = new CartAPI(new TokenCacheStore());
      return cart.getAnonymousCartById(cartId);
    }
    return null;
  }
}
