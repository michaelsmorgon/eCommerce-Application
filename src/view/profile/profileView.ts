import { TokenCacheStore } from '../../api/TokenCacheStore';
import ProfileView from './profileView/profile';

export default class ProfileApp {
  private tokenCacheStore: TokenCacheStore;

  constructor() {
    this.tokenCacheStore = new TokenCacheStore();
  }

  static create(): void {
    const app = new ProfileApp();
    const view = new ProfileView(app.tokenCacheStore);
    const main = document.querySelector('.mainView');
    if (!main) {
      return;
    }
    main.innerHTML = '';
    main.appendChild(view.getElement());
  }
}
