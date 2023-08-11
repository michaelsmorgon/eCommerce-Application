import ElementCreator, { ElementConfig, ICallbackFunc } from '../ElementCreator';

enum InputFieldCSSClasses {
  CONTAINER = 'input-field__container',
}

export class InputField extends ElementCreator {
  private inputElement: HTMLInputElement = document.createElement('input');

  private labelElement: HTMLLabelElement = document.createElement('label');

  public create(params: ElementConfig): void {
    this.element = document.createElement('div');

    this.element.classList.add(InputFieldCSSClasses.CONTAINER);
    params.classNames.forEach((className: string): void => {
      this.element.classList.add(className);
    });

    this.setCallback(params.callback);
    this.setTextContent(params.textContent);
    this.inputElement = document.createElement('input');
    this.labelElement = document.createElement('label');

    this.element.append(this.labelElement, this.inputElement);
  }

  public setValue(value: string): void {
    this.inputElement.value = value;
  }

  public setTextContent(value: string = ''): void {
    this.labelElement.textContent = value;
  }

  public setPlaceholder(placeholderText: string): void {
    this.inputElement.placeholder = placeholderText;
  }

  protected setCallback(callback: ICallbackFunc | null = null): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('keyup', (event: Event): void => callback(event));
    }
  }
}
