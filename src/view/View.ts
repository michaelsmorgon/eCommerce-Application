import ElementCreator, { ElementConfig } from '../util/ElementCreator';

export type ViewParams = {
  tag: string;
  classNames: string[];
};

export default class View {
  protected viewElementCreator: ElementCreator;

  constructor(params: ViewParams = { tag: 'section', classNames: [] }) {
    this.viewElementCreator = this.createView(params);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElementCreator.getElement();
  }

  protected createView(params: ViewParams): ElementCreator {
    const elementParams: ElementConfig = {
      tag: params.tag,
      classNames: params.classNames,
    };
    this.viewElementCreator = new ElementCreator(elementParams);

    return this.viewElementCreator;
  }
}
