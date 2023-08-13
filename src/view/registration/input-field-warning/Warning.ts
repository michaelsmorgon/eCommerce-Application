import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';

export class Warning {
  public static REG_INPUT_INVALID = 'input-invalid';

  public static REG_INPUT_WARNING = 'input-warning';

  public static addWarning(element: HTMLInputElement, parentElementClass: string, textWarning: string): void {
    this.addInputInvalid(element);
    this.removeWarningElement(parentElementClass);
    this.addWarningElement(element, textWarning);
  }

  public static removeWarning(element: HTMLInputElement, parentElementClass: string): void {
    this.removeInputInvalid(element);
    this.removeWarningElement(parentElementClass);
  }

  public static addInputInvalid(element: HTMLInputElement): void {
    if (!element.classList.contains(Warning.REG_INPUT_INVALID)) {
      element.classList.add(Warning.REG_INPUT_INVALID);
    }
  }

  public static removeInputInvalid(element: HTMLInputElement): void {
    element.classList.remove(Warning.REG_INPUT_INVALID);
  }

  public static addWarningElement(parentElement: HTMLInputElement, textWarning: string): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [this.REG_INPUT_WARNING],
      textContent: textWarning,
    };

    const warning = new ElementCreator(params);
    parentElement.insertAdjacentHTML('afterend', warning.getElement().outerHTML);
  }

  public static removeWarningElement(parentElementClass: string): void {
    const parentElement = document.querySelector(`.${parentElementClass}`);
    const warningElem = document.querySelector(
      `.${parentElementClass} > .${this.REG_INPUT_WARNING}`
    ) as HTMLInputElement;
    if (parentElement && warningElem) {
      parentElement.removeChild(warningElem);
    }
  }
}
