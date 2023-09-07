import {
  AttributeDefinition,
  AttributeEnumType,
  AttributeLocalizedEnumType,
  ProductType,
} from '@commercetools/platform-sdk';
import { ProductAttributeAPI } from '../../../api/ProductAttributeAPI';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import View, { ViewParams } from '../../View';
import { CssClassesPrice, PriceView } from './price/PriceView';
import './search-view.css';
import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';
import { route } from '../../../router/router';
import { MessageView } from '../../message/MessageView';
import { QueryString, QueryStringNames } from '../query/QueryString';
import { MultiselectCheckboxField } from '../../../util/multiselect_checkbox_field/MultiselectCheckboxField';

const CssClassesSearch = {
  SEARCH_CONTAINER: 'search-container',
  SEARCH_BTN: 'search-button',
  CLEAR_BTN: 'clear-button',
  BUTTON_CONTAINER: 'button-container',
};

export class SearchView extends View {
  private queryList: string[] = [];

  constructor(private queryString: QueryString) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesSearch.SEARCH_CONTAINER],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.addPriceSearch();
    this.addSearchFields();
  }

  private addPriceSearch(): void {
    const price = new PriceView(this.queryString);
    this.viewElementCreator.addInnerElement(price.getHtmlElement());
  }

  private addSearchFields(): void {
    const ProductInfo = new ProductAttributeAPI(new TokenCacheStore());

    ProductInfo.getAttributes()
      .then((response) => {
        const attrList: AttributeDefinition[] = [];
        response.body?.results.forEach((arr: ProductType) => {
          arr.attributes?.forEach((attribute: AttributeDefinition) => {
            if (attribute.isSearchable) {
              attrList.push(attribute);
            }
          });
        });
        attrList.forEach((attrInfo) => {
          switch (attrInfo.name) {
            case QueryStringNames.COLOR:
              this.addColorSearch(attrInfo.type as AttributeLocalizedEnumType);
              break;
            case QueryStringNames.MATERIAL:
              this.addMaterialSearch(attrInfo.type as AttributeLocalizedEnumType);
              break;
            case QueryStringNames.SIZE:
              this.addSizeSearch(attrInfo.type as AttributeEnumType);
              break;
            default:
              break;
          }
        });
        this.addButtons();
      })
      .catch(() => {
        const msg = new MessageView('Server Internal Error', false);
        msg.showWindowMsg();
      });
  }

  private addColorSearch(attrInfo: AttributeLocalizedEnumType): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: ['color-multiselect'],
      attributes: [{ name: 'id', value: 'color_list_check' }],
    };
    const attrList: { key: string; value: string }[] = [];

    attrInfo.values.forEach((val) => {
      attrList.push({ key: val.key, value: val.label.en });
    });
    const colors = new MultiselectCheckboxField('Color', attrList, params, this.queryString.getColor());
    this.viewElementCreator.addInnerElement(colors.create());
  }

  private addMaterialSearch(attrInfo: AttributeLocalizedEnumType): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: ['material-multiselect'],
      attributes: [{ name: 'id', value: 'material_list_check' }],
    };
    const attrList: { key: string; value: string }[] = [];

    attrInfo.values.forEach((val) => {
      attrList.push({ key: val.key, value: val.label.en });
    });
    const material = new MultiselectCheckboxField('Material', attrList, params, this.queryString.getMaterial());
    this.viewElementCreator.addInnerElement(material.create());
  }

  private addSizeSearch(attrInfo: AttributeEnumType): void {
    const params = {
      tag: 'div',
      classNames: ['size-multiselect'],
      attributes: [{ name: 'id', value: 'size_list_check' }],
    };
    const attrList: { key: string; value: string }[] = [];

    attrInfo.values.forEach((val) => {
      attrList.push({ key: val.key, value: val.label });
    });
    const size = new MultiselectCheckboxField('Size', attrList, params, this.queryString.getSize());
    this.viewElementCreator.addInnerElement(size.create());
  }

  private addButtons(): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesSearch.BUTTON_CONTAINER],
    };
    const container = new ElementCreator(params);
    container.addInnerElement(this.addSearchBtn());
    container.addInnerElement(this.addClearBtn());
    this.viewElementCreator.addInnerElement(container);
  }

  private addSearchBtn(): ElementCreator {
    const params: ElementConfig = {
      tag: 'button',
      classNames: [CssClassesSearch.SEARCH_BTN],
      textContent: 'Search',
      attributes: [{ name: 'href', value: '/catalog' }],
      callback: async (event: Event) => {
        this.submitBtnHandler(event as MouseEvent);
      },
    };

    return new ElementCreator(params);
  }

  private addClearBtn(): ElementCreator {
    const params: ElementConfig = {
      tag: 'button',
      classNames: [CssClassesSearch.SEARCH_BTN],
      textContent: 'Clear',
      attributes: [{ name: 'href', value: '/catalog' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    };

    return new ElementCreator(params);
  }

  private async submitBtnHandler(event: MouseEvent): Promise<void> {
    this.removeQuery();
    this.getPriceQuery();
    this.getColorQuery();
    this.getSizeQuery();
    this.getMaterialQuery();
    const btn = document.querySelector(`.${CssClassesSearch.SEARCH_BTN}`);
    let queryStr: string = '';
    if (this.queryList.length > 0) {
      queryStr = `?${this.queryList.join('&')}`;
    }
    const newUrl = `${btn?.getAttribute('href')}${queryStr}`;
    btn?.setAttribute('href', newUrl);
    route(event);
  }

  private removeQuery(): void {
    const search = decodeURIComponent(document.location.search.replace('?', ''));
    if (search.length > 0) {
      this.queryList = search.split('&').filter((val) => {
        return val.includes('search') || val.includes('order');
      });
    }
  }

  private getPriceQuery(): void {
    const priceFrom = document.querySelector(`.${CssClassesPrice.PRICE_FROM}`) as HTMLInputElement;
    const priceTo = document.querySelector(`.${CssClassesPrice.PRICE_TO}`) as HTMLInputElement;

    if (priceFrom.value !== null && priceFrom.value !== '') {
      this.queryList.push(`price_from=${priceFrom.value}`);
    }
    if (priceTo.value !== null && priceTo.value !== '') {
      this.queryList.push(`price_to=${priceTo.value}`);
    }
  }

  private getColorQuery(): void {
    const colorForm: NodeListOf<HTMLInputElement> = document.querySelectorAll(`#color_list_check input`);
    const colors: string[] = [];
    colorForm.forEach((elem) => {
      if (elem.checked) {
        colors.push(elem.id.replace('color_list_check_', ''));
      }
    });
    if (colors.length > 0) {
      this.queryList.push(`color=${colors.join(';')}`);
    }
  }

  private getSizeQuery(): void {
    const sizeForm: NodeListOf<HTMLInputElement> = document.querySelectorAll(`#size_list_check input`);
    const sizes: string[] = [];
    sizeForm.forEach((value) => {
      if (value.checked) {
        sizes.push(value.id.replace('size_list_check_', ''));
      }
    });

    if (sizes.length > 0) {
      this.queryList.push(`size=${sizes.join(';')}`);
    }
  }

  private getMaterialQuery(): void {
    const materialForm: NodeListOf<HTMLInputElement> = document.querySelectorAll(`#material_list_check input`);
    const materials: string[] = [];
    materialForm.forEach((value) => {
      if (value.checked) {
        materials.push(value.id.replace('material_list_check_', ''));
      }
    });
    if (materials.length > 0) {
      this.queryList.push(`material=${materials.join(';')}`);
    }
  }
}
