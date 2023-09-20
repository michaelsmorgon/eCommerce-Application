import AboutUsView from './aboutUsView';

export default class AboutUsApp {
  static create(): void {
    let view: AboutUsView | null = null;
    view = new AboutUsView();

    const main = document.querySelector('.mainView');
    if (!main) {
      console.error('Main element not found');
      return;
    }

    main.innerHTML = '';

    if (view) {
      main.appendChild(view.getHtmlElement());
    }
  }
}
