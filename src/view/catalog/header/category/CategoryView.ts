import { Category, CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';
import View, { ViewParams } from '../../../View';
import { QueryString } from '../../query/QueryString';
import ElementCreator, { ElementConfig } from '../../../../util/ElementCreator';
import { route } from '../../../../router/router';
import { ProductAPI } from '../../../../api/ProductAPI';
import { TokenCacheStore } from '../../../../api/TokenCacheStore';
import './category-view.css';

const CssClasses = {
  CATEGORY_CONTAINER: 'category-container',
  TOP_CATEGORY: 'top-category',
  MAIN_CATEGORY: 'main-category',
  MAIN_LEVEL_CATEGORY: 'main-level-category',
  CHILD_LEVEL_CATEGORY: 'child-level-category',
  START_ANCHOR: 'start-anchor',
};

export interface ICategoriesInfo {
  name: string;
  id: string;
  key?: string;
  child?: ICategoriesInfo[];
}

export class CategoryView extends View {
  constructor(private queryString: QueryString) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.CATEGORY_CONTAINER],
    };
    super(params);
    this.create();
  }

  public create(): void {
    const conf: ElementConfig = { tag: 'ul', classNames: [CssClasses.TOP_CATEGORY] };
    const startCategory = new ElementCreator(conf);
    const startLi = this.getLiElement();
    const anchorParamConfig: ElementConfig = {
      tag: 'a',
      classNames: [CssClasses.START_ANCHOR],
      textContent: '--  Select Category  --',
    };
    startLi.addInnerElement(new ElementCreator(anchorParamConfig));

    const paramConfig: ElementConfig = {
      tag: 'ul',
      classNames: [CssClasses.MAIN_CATEGORY],
    };
    const mainCategory = new ElementCreator(paramConfig);
    const products = new ProductAPI(new TokenCacheStore());
    products
      .getProductCategories()
      .then((response) => {
        const categoriesInfo = this.getCategoriesList(response);
        categoriesInfo.forEach((mainCat: ICategoriesInfo) => {
          const categoryLiElem = this.getLiElement();
          categoryLiElem.addInnerElement(this.getAnchorElement(mainCat));
          mainCategory.addInnerElement(categoryLiElem);
          if (mainCat.child) {
            mainCat.child.forEach((nodeCat: ICategoriesInfo) => {
              const nodeCategoryLiElem = this.getLiElement();
              nodeCategoryLiElem.addInnerElement(this.getAnchorElement(nodeCat, true));
              mainCategory.addInnerElement(nodeCategoryLiElem);
            });
          }
        });
        startLi.addInnerElement(mainCategory);
        startCategory.addInnerElement(startLi);
        this.viewElementCreator.addInnerElement(startCategory);
      })
      .catch(() => {});
  }

  private getCategoriesList(response: ClientResponse<CategoryPagedQueryResponse>): ICategoriesInfo[] {
    const categoriesInfo: ICategoriesInfo[] = [];
    response.body.results.forEach((info: Category) => {
      if (!info.parent) {
        categoriesInfo.push({
          id: info.id,
          name: info.name.en,
          key: info.key,
          child: [],
        });
      } else {
        categoriesInfo.forEach((category, ind) => {
          if (category.id === info.parent?.id) {
            categoriesInfo[ind].child?.push({
              id: info.id,
              name: info.name.en,
              key: info.key,
            });
          }
        });
      }
    });
    return categoriesInfo;
  }

  private getLiElement(): ElementCreator {
    const listParamConfig: ElementConfig = {
      tag: 'li',
      classNames: [],
    };
    return new ElementCreator(listParamConfig);
  }

  private getAnchorElement(category: ICategoriesInfo, isChild: boolean = false): ElementCreator {
    const anchorParamConfig: ElementConfig = {
      tag: 'a',
      classNames: [isChild ? CssClasses.CHILD_LEVEL_CATEGORY : CssClasses.MAIN_LEVEL_CATEGORY],
      textContent: isChild ? `|___${category.name}` : category.name,
      attributes: [
        { name: 'id', value: category.id },
        { name: 'href', value: `/category/${category.id}` },
      ],
      callback: (event: Event): void => {
        route(event as MouseEvent);
      },
    };
    return new ElementCreator(anchorParamConfig);
  }
}
