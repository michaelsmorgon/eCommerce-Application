import { ProductProjection } from '@commercetools/platform-sdk';
import ElementCreator, { ElementConfig, IAttribute } from '../../../util/ElementCreator';
import View, { ViewParams } from '../../View';
import { route } from '../../../router/router';
import { QueryString } from '../query/QueryString';
import './catalog-card.css';

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
      attributes: [{ name: 'href', value: `/catalog/${this.productKey}` }],
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
    let newPrice = '';
    if (prices && prices[0]) {
      const calcPrice = prices[0].value.centAmount / 100;
      productPrice = `${calcPrice.toFixed(2)} ${prices[0].value.currencyCode}`;
      if (discount !== null) {
        newPrice = `${((calcPrice * (100 - +discount)) / 100).toFixed(2)} ${prices[0].value.currencyCode}`;
      }
    }

    const priceParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCard.PRICE_NEW],
      textContent: discount !== null ? newPrice : productPrice,
    };
    const price = new ElementCreator(priceParams);
    priceContainer.addInnerElement(price);

    if (discount !== null) {
      const oldPriceParams: ElementConfig = {
        tag: 'div',
        classNames: [CssClassesCard.PRICE_OLD],
        textContent: productPrice,
      };
      const oldPrice = new ElementCreator(oldPriceParams);
      priceContainer.addInnerElement(oldPrice);
    }
    return priceContainer;
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
}
