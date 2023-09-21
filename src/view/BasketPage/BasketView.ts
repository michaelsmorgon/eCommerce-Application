import { TokenCacheStore } from '../../api/TokenCacheStore';
import BasketContent from './BasketContent.ts/BasketContent';

export default class BasketView {
  private tokenCacheStore: TokenCacheStore;

  constructor() {
    this.tokenCacheStore = new TokenCacheStore();
  }

  static create(): void {
    const app = new BasketView();
    const view = new BasketContent(app.tokenCacheStore);
    const main = document.querySelector('.mainView');
    if (!main) {
      return;
    }
    main.innerHTML = '';
    main.appendChild(view.getElement());
  }
}
