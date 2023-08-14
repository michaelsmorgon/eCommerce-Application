import { CustomerDraft, BaseAddress } from '@commercetools/platform-sdk';
import { RegInputClasses, fields } from '../../data/fields';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import { InputField } from '../../util/input_field/InputField';
import { SelectField } from '../../util/select_field/SelectField';
import View, { ViewParams } from '../View';
import { FieldValidator } from './validation-fields/FieldValidator';
import './registration-view.css';
import { Customer } from '../../api/Customer';

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
      callback: async (event: Event) => this.submitBtnHandler(event),
    };
    const submitBtn = new ElementCreator(params);
    const submitBtnElement = submitBtn.getElement();
    this.viewElementCreator.addInnerElement(submitBtnElement);
  }

  private async submitBtnHandler(event: Event): Promise<void> {
    event.preventDefault();
    const fieldChecker = new FieldValidator();

    const isValid = fieldChecker.validateFields();
    if (isValid) {
      const baseAddress: BaseAddress = {
        streetName: this.getFieldValue(RegInputClasses.REG_STREET),
        city: this.getFieldValue(RegInputClasses.REG_CITY),
        postalCode: this.getFieldValue(RegInputClasses.REG_POSTAL_CODE),
        country: this.getFieldValue(RegInputClasses.REG_COUNTRY),
      };
      const params: CustomerDraft = {
        email: this.getFieldValue(RegInputClasses.REG_EMAIL),
        password: this.getFieldValue(RegInputClasses.REG_PASS),
        firstName: this.getFieldValue(RegInputClasses.REG_FIRST_NAME),
        lastName: this.getFieldValue(RegInputClasses.REG_LAST_NAME),
        dateOfBirth: this.getFieldValue(RegInputClasses.REG_DATE_OF_BIRTH),
        addresses: [baseAddress],
      };
      const customer = new Customer();
      customer
        .createCustomer(params)
        .then((response) => {
          console.log(response);
          // todo need to redirect user to main page (routes)
        })
        .catch(console.error);
    }
  }

  private getFieldValue(className: string): string {
    let element = document.querySelector(`.${className} > input`) as HTMLInputElement;
    if (className === RegInputClasses.REG_COUNTRY) {
      element = document.querySelector(`.${className} > select`) as HTMLInputElement;
    }
    return element.value ? element.value : '';
  }
}
