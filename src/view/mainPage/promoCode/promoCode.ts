import { CartDiscount } from '@commercetools/platform-sdk';
import { TokenCacheStore } from '../../../api/TokenCacheStore';
import ElementCreator from '../../../util/ElementCreator';
import { Discount } from '../../../api/Discount';

export default class PromoCode {
  private promoCodeText: ElementCreator;

  private promoCodeContainer: ElementCreator;

  constructor() {
    this.promoCodeText = new ElementCreator({
      tag: 'div',
      classNames: ['promo-code-text'],
      textContent: 'Today you are lucky, we have such promo codes for YOU',
    });
    this.promoCodeContainer = new ElementCreator({
      tag: 'div',
      classNames: ['promo-code-container'],
    });
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

    promoCodeWrapper.addInnerElement(this.promoCodeText);
    promoCodeWrapper.addInnerElement(this.promoCodeContainer);
    return promoCodeWrapper;
  }

  private updatePromoCodesUI(promocodes: CartDiscount[]): void {
    const promoCodesContainer = this.promoCodeContainer.getElement();
    if (!promoCodesContainer) {
      return;
    }

    promocodes.forEach((promo) => {
      const promoElement = document.createElement('div');
      promoElement.classList.add('your-code');
      promoElement.textContent = `${promo.key}`;

      promoCodesContainer.appendChild(promoElement);
    });
  }
}
