import { ClientResponse, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { BuilderClient } from '../../../api/BuilderClient';
import { TokenCacheStore } from '../../../api/TokenCacheStore';

import { RegInputClasses } from '../../../data/registration-fields';
import ElementCreator from '../../../util/ElementCreator';
import { InputField } from '../../../util/input_field/InputField';
import { Warning } from '../EditPageView/input-field-warning/Warning';
import { WarningMessage } from '../EditPageView/validation-fields/FieldValidator';
import './passwords.css';

export default class PasswordChangeView extends ElementCreator {
  private PATH_MIN_LENGTH = 8;

  private tokenCacheStore: TokenCacheStore;

  private readonly currentPasswordInput: InputField;

  private readonly newPasswordInput: InputField;

  private readonly confirmNewPasswordInput: InputField;

  constructor() {
    const params = {
      tag: 'section',
      classNames: ['main-password-view'],
    };
    super(params);
    this.tokenCacheStore = new TokenCacheStore();

    this.currentPasswordInput = this.createInputField('Current Password', 'user-current-passwords');
    this.newPasswordInput = this.createInputField('New Password', 'user-new-passwords');
    this.confirmNewPasswordInput = this.createInputField('Confirm Password', 'user-new-passwords');

    this.callMethods();
  }

  callMethods(): void {
    this.passwordsConfirmButton();
  }

  private createInputField(labelText: string, classNames: string): InputField {
    const inputContent = {
      tag: 'input',
      classNames: [classNames],
      textContent: labelText,
    };
    const inputField = new InputField(inputContent);
    this.addInnerElement(inputField);

    return inputField;
  }

  passwordsConfirmButton(): void {
    const userContent = {
      tag: 'div',
      classNames: ['user-passwords'],
    };
    const Userdiv = new ElementCreator(userContent);
    this.addInnerElement(Userdiv);

    const Button = {
      tag: 'button',
      classNames: ['user-button'],
      textContent: 'Change Password',
      callback: (): void => {
        const isCurrentPassValid = this.validateCurrentPass();
        const isNewPassValid = this.validatePass();
        const isConfirmPassValid = this.validateConfirmPass();

        if (isCurrentPassValid && isNewPassValid && isConfirmPassValid) {
          this.ChangePassword();
        }
      },
    };
    const UserButton = new ElementCreator(Button);
    Userdiv.addInnerElement(UserButton);
  }

  private validatePass(): boolean {
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    const otherCharacters = /[^a-zA-Z0-9]/g;

    const pass = this.newPasswordInput.getElement().querySelector('input') as HTMLInputElement;

    if (
      pass.value !== '' &&
      pass.value.match(lowerCaseLetters) &&
      pass.value.match(upperCaseLetters) &&
      pass.value.match(numbers) &&
      !pass.value.match(otherCharacters) &&
      pass.value.length >= this.PATH_MIN_LENGTH
    ) {
      Warning.removeWarning(pass, RegInputClasses.REG_PASS);
      return true;
    }
    let warningMsg = '';
    if (pass.value === '') {
      warningMsg = WarningMessage.NOT_EMPTY;
    } else if (pass.value.length < this.PATH_MIN_LENGTH) {
      warningMsg = WarningMessage.PASS_INCORRECT_LENGTH;
    } else {
      warningMsg = WarningMessage.PASS_INCORRECT_REQUIREMENTS;
    }

    Warning.addWarning(pass, RegInputClasses.REG_PASS, warningMsg);

    return false;
  }

  private validateCurrentPass(): boolean {
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    const otherCharacters = /[^a-zA-Z0-9]/g;

    const pass = this.currentPasswordInput.getElement().querySelector('input') as HTMLInputElement;

    if (
      pass.value !== '' &&
      pass.value.match(lowerCaseLetters) &&
      pass.value.match(upperCaseLetters) &&
      pass.value.match(numbers) &&
      !pass.value.match(otherCharacters) &&
      pass.value.length >= this.PATH_MIN_LENGTH
    ) {
      Warning.removeWarning(pass, RegInputClasses.REG_PASS);
      return true;
    }
    let warningMsg = '';
    if (pass.value === '') {
      warningMsg = WarningMessage.NOT_EMPTY;
    } else if (pass.value.length < this.PATH_MIN_LENGTH) {
      warningMsg = WarningMessage.PASS_INCORRECT_LENGTH;
    } else {
      warningMsg = WarningMessage.PASS_INCORRECT_REQUIREMENTS;
    }

    Warning.addWarning(pass, RegInputClasses.REG_PASS, warningMsg);

    return false;
  }

  private validateConfirmPass(): boolean {
    const pass = this.newPasswordInput.getElement().querySelector('input') as HTMLInputElement;
    const confirmPass = this.confirmNewPasswordInput.getElement().querySelector('input') as HTMLInputElement;

    if (confirmPass.value !== '' && confirmPass.value === pass.value) {
      Warning.removeWarning(confirmPass, RegInputClasses.REG_CONFIRM_PASS);
      return true;
    }
    let warningMsg = '';
    if (confirmPass.value === '') {
      warningMsg = WarningMessage.NOT_EMPTY;
    } else {
      warningMsg = WarningMessage.CONFIRM_PASS;
    }
    Warning.addWarning(confirmPass, RegInputClasses.REG_CONFIRM_PASS, warningMsg);
    return false;
  }

  async ChangePassword(): Promise<ClientResponse | null> {
    const pass = this.newPasswordInput.getElement().querySelector('input') as HTMLInputElement;
    const Currentpass = this.currentPasswordInput.getElement().querySelector('input') as HTMLInputElement;

    const projectKey = 'dumians';
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
    const customerId = localStorage.getItem('id');
    if (customerId !== null) {
      const customerResponse = await apiRoot.customers().withId({ ID: customerId }).get().execute();

      const customerPassword = {
        id: customerId,
        version: customerResponse.body.version,
        currentPassword: Currentpass.value,
        newPassword: pass.value,
      };

      try {
        await apiRoot.customers().password().post({ body: customerPassword }).execute();
        console.log('Password changed successfully:');
      } catch (error) {
        console.error('Error changing password:');
        console.error(error);
        return null;
      }
    } else {
      console.error('Customer ID not found in local storage');
      return null;
    }
    return null;
  }
}
