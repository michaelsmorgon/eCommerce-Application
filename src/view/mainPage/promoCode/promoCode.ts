import { CartDiscount } from '@commercetools/platform-sdk';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import ElementCreator from '../../../util/ElementCreator';
import { Discount } from '../../../api/Discount';

export default class PromoCode {
  private inputContainer: ElementCreator;

  private input: ElementCreator;

  private promoCodeContainer: ElementCreator;

  constructor() {
    this.input = new ElementCreator({
      tag: 'input',
      classNames: ['promo-code-input'],
      attributes: [
        { name: 'type', value: 'text' },
        { name: 'placeholder', value: 'Enter the promo code' },
      ],
    });

    this.promoCodeContainer = new ElementCreator({
      tag: 'div',
      classNames: ['promo-code-container'],
    });

    const promoCodeText = new ElementCreator({
      tag: 'div',
      classNames: ['promo-code-text'],
      textContent: 'Today you are lucky, we have such promo codes for YOU',
    });

    this.inputContainer = new ElementCreator({
      tag: 'div',
      classNames: ['promo-code-input-container'],
    });

    const applyButton = new ElementCreator({
      tag: 'button',
      classNames: ['apply-button'],
      textContent: 'Apply',
    });

    applyButton.getElement().addEventListener('click', this.applyButtonClickHandler.bind(this));
    this.inputContainer.addInnerElement(this.input);
    this.inputContainer.addInnerElement(applyButton);
    this.promoCodeContainer.addInnerElement(promoCodeText);
  }

  create(): ElementCreator {
    const promoCodeWrapper = new ElementCreator({
      tag: 'div',
      classNames: ['promo-code-wrapper'],
    });

    const disc = new Discount(new TokenCacheStore());
    disc.getCodes().then((response) => {
      const promocodes = response.body.results;
      console.log(promocodes);
      this.updatePromoCodesUI(promocodes);
    });

    promoCodeWrapper.addInnerElement(this.promoCodeContainer);
    promoCodeWrapper.addInnerElement(this.inputContainer);
    return promoCodeWrapper;
  }

  private async applyButtonClickHandler(): Promise<void> {
    const promoCode = (this.input.getElement() as HTMLInputElement).value;
    try {
      console.log(promoCode);
    } catch (error) {
      console.error('Error when applying promo code:', error);
    }
  }

  private updatePromoCodesUI(promocodes: CartDiscount[]): void {
    const promoCodesContainer = this.promoCodeContainer.getElement();
    if (!promoCodesContainer) {
      return;
    }

    promocodes.forEach((promo) => {
      const promoElement = document.createElement('div');
      promoElement.textContent = `${promo.name.en}`;

      promoCodesContainer.appendChild(promoElement);
    });
  }
}
