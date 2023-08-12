import { fields } from '../../data/fields';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import { InputField } from '../../util/input_field/InputField';
import View, { ViewParams } from '../View';
import './registration-view.css';

const CssClassesForm = {
  REGISTRATION_FROM: 'registration-form',
};

const CssClassesBtn = {
  FORM_BTN: 'form-btn',
};

export class RegistrationView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'form',
      classNames: [CssClassesForm.REGISTRATION_FROM],
    };
    super(params);
    this.configureView();
    this.addSubmitBtn();
  }

  private configureView(): void {
    fields.forEach((inputParams: ElementConfig) => {
      const creatorInput = new InputField(inputParams);
      this.viewElementCreator.addInnerElement(creatorInput);
    });
  }

  private addSubmitBtn(): void {
    const params: ElementConfig = {
      tag: 'button',
      classNames: [CssClassesBtn.FORM_BTN],
      textContent: 'Continue',
      attributes: [{ name: 'type', value: 'submit' }],
    };
    const submitBtn = new ElementCreator(params);
    this.viewElementCreator.addInnerElement(submitBtn);
  }
}
