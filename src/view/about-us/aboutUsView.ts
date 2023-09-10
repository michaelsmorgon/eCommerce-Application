import View, { ViewParams } from '../View';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';

export default class AboutUsView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: ['about-section'],
    };
    super(params);

    this.addContent();
  }

  private addContent(): void {
    const infoCentrParams: ElementConfig = {
      tag: 'div',
      classNames: ['ifo-centr'],
      textContent: 'Hello World',
    };
    const infoCentr = new ElementCreator(infoCentrParams);
    this.viewElementCreator.addInnerElement(infoCentr);
  }
}
