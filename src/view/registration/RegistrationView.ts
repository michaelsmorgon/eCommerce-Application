import { fields } from '../../data/fields';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import { InputField } from '../../util/input_field/InputField';
import { SelectField } from '../../util/select_field/SelectField';
import View, { ViewParams } from '../View';
import { FieldValidator } from './validation-fields/FieldValidator';
import './registration-view.css';

const CssClassesForm = {
  REGISTRATION_CONTAINER: 'registration_container',
};

const CssClassesBtn = {
  REGISTRATION_BTN: 'registration-btn',
};

export class RegistrationView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'form',
      classNames: [CssClassesForm.REGISTRATION_CONTAINER],
    };
    super(params);
    const form = this.viewElementCreator.getElement();
    form.id = 'reg-form';
    this.configureView();
    this.addSubmitBtn();
  }

  private configureView(): void {
    fields.forEach((inputParams: ElementConfig) => {
      if (inputParams.tag === 'select') {
        const creatorInput = new SelectField(inputParams);
        this.viewElementCreator.addInnerElement(creatorInput);
      } else {
        const creatorInput = new InputField(inputParams);
        this.viewElementCreator.addInnerElement(creatorInput);
      }
    });
  }

  private addSubmitBtn(): void {
    const params: ElementConfig = {
      tag: 'button',
      classNames: [CssClassesBtn.REGISTRATION_BTN],
      textContent: 'Continue',
      attributes: [{ name: 'type', value: 'submit' }],
      callback: this.submitBtnHandler.bind(this),
    };
    const submitBtn = new ElementCreator(params);
    const submitBtnElement = submitBtn.getElement();
    this.viewElementCreator.addInnerElement(submitBtnElement);
  }

  private submitBtnHandler(event: Event): void {
    const fieldChecker = new FieldValidator();

    fieldChecker.validateFields(event);
  }
}
