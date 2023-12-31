import View, { ViewParams } from '../../View';
import { QueryString } from '../query/QueryString';
import { OrderView } from './order/OrderView';
import './catalog-header-view.css';
import { SearchProductView } from './search/SearchProductView';
import { CategoryView } from './category/CategoryView';

const CssClasses = {
  CATALOG_SECTION_HEADER: 'catalog-section__header',
};
export class CatalogHeaderView extends View {
  constructor(private queryString: QueryString) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.CATALOG_SECTION_HEADER],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.addOrder();
    this.addSearchField();
    this.addCategoryField();
  }

  private addOrder(): void {
    const orderView = new OrderView(this.queryString);
    this.viewElementCreator.addInnerElement(orderView.getHtmlElement());
  }

  private addSearchField(): void {
    const orderView = new SearchProductView(this.queryString);
    this.viewElementCreator.addInnerElement(orderView.getHtmlElement());
  }

  private addCategoryField(): void {
    const categoryView = new CategoryView(this.queryString);
    this.viewElementCreator.addInnerElement(categoryView.getHtmlElement());
  }
}
