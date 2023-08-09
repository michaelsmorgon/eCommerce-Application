export interface ICallbackFunc {
  (event: Event): void;
}

export type ElementConfig = {
  tag: string;
  classNames: string[];
  textContent: string;
  callback: ICallbackFunc;
};

export default class ElementCreator {
  protected element: HTMLElement;

  constructor(params: ElementConfig) {
    this.element = document.createElement(params.tag);
    this.create(params);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElement(element: HTMLElement | ElementCreator): void {
    if (element instanceof ElementCreator) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  protected create(params: ElementConfig): void {
    this.setClasses(params.classNames);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
  }

  protected setClasses(classes: string[] = []): void {
    classes.forEach((className) => this.element.classList.add(className));
  }

  protected setTextContent(text: string = ''): void {
    this.element.textContent = text;
  }

  protected setCallback(callback: ICallbackFunc): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event: Event): void => callback(event));
    }
  }
}
