import { RegInputClasses } from '../../../data/registration-fields';
import { ICountryInfo, countriesInfo } from '../../../data/country';
import { Warning } from '../input-field-warning/Warning';

export enum WarningMessage {
  EMAIL = 'Enter a valid email address!',
  PASS_INCORRECT_LENGTH = 'Length must be at least 8 characters!',
  PASS_INCORRECT_REQUIREMENTS = 'Should contain uppercase and lowercase letter and number',
  CONFIRM_PASS = 'Passwords are not the same',
  NO_NUMBERS = 'Should not contains numbers',
  NO_SPECIAL_CHARACTERS = 'Should not contains special characters',
  NOT_EMPTY = 'Field should not be empty',
  INCORRECT_AGE = 'Age should be above 13 years',
  COUNTRY_MANDATORY = 'Select country',
  POSTAL_CODE = 'Must follow the format for the country',
}

export class FieldValidator {
  private PATH_MIN_LENGTH = 8;

  public validateFields(): boolean {
    let isCorrect = true;
    isCorrect = this.validateEmail() && isCorrect;
    isCorrect = this.validatePass() && isCorrect;
    isCorrect = this.validateConfirmPass() && isCorrect;
    isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_FIRST_NAME) && isCorrect;
    isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_LAST_NAME) && isCorrect;
    isCorrect = this.validateDateOfBirth() && isCorrect;

    const billingInclude = document.querySelector('#billing-include') as HTMLInputElement;
    if (billingInclude.checked) {
      isCorrect = this.validateCountry() && isCorrect;
      isCorrect = this.validatePostalCode() && isCorrect;
      isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_CITY) && isCorrect;
      isCorrect = this.validateStreet() && isCorrect;
    }
    const shippingInclude = document.querySelector('#shipping-include') as HTMLInputElement;
    if (shippingInclude.checked) {
      isCorrect = this.validateCountry(false) && isCorrect;
      isCorrect = this.validatePostalCode(false) && isCorrect;
      isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_CITY_SHIPPING) && isCorrect;
      isCorrect = this.validateStreet(false) && isCorrect;
    }

    return isCorrect;
  }

  private validateEmail(): boolean {
    const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const email = document.querySelector(`.${RegInputClasses.REG_EMAIL} > input`) as HTMLInputElement;

    if (email.value.match(regEmail)) {
      Warning.removeWarning(email, RegInputClasses.REG_EMAIL);
    } else {
      Warning.addWarning(email, RegInputClasses.REG_EMAIL, WarningMessage.EMAIL);
      return false;
    }
    return true;
  }

  private validatePass(): boolean {
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    const pass = document.querySelector(`.${RegInputClasses.REG_PASS} > input`) as HTMLInputElement;

    if (
      pass.value !== '' &&
      pass.value.match(lowerCaseLetters) &&
      pass.value.match(upperCaseLetters) &&
      pass.value.match(numbers) &&
      pass.value.length >= this.PATH_MIN_LENGTH
    ) {
      Warning.removeWarning(pass, RegInputClasses.REG_PASS);
    } else {
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
    return true;
  }

  private validateConfirmPass(): boolean {
    const pass = document.querySelector(`.${RegInputClasses.REG_PASS} > input`) as HTMLInputElement;
    const confirmPass = document.querySelector(`.${RegInputClasses.REG_CONFIRM_PASS} > input`) as HTMLInputElement;
    if (confirmPass.value !== '' && confirmPass.value === pass.value) {
      Warning.removeWarning(confirmPass, RegInputClasses.REG_CONFIRM_PASS);
    } else {
      let warningMsg = '';
      if (confirmPass.value === '') {
        warningMsg = WarningMessage.NOT_EMPTY;
      } else {
        warningMsg = WarningMessage.CONFIRM_PASS;
      }
      Warning.addWarning(confirmPass, RegInputClasses.REG_CONFIRM_PASS, warningMsg);

      return false;
    }
    return true;
  }

  private validateOnlyCharacters(className: string): boolean {
    const hasNumbers = /[0-9]/g;
    const notLetters = /[^a-zA-Z0-9]/g;
    const name = document.querySelector(`.${className} > input`) as HTMLInputElement;

    if (name.value.length === 0) {
      Warning.addWarning(name, className, WarningMessage.NOT_EMPTY);
      return false;
    }
    if (name.value.match(hasNumbers)) {
      Warning.addWarning(name, className, WarningMessage.NO_NUMBERS);
      return false;
    }
    if (name.value.match(notLetters)) {
      Warning.addWarning(name, className, WarningMessage.NO_SPECIAL_CHARACTERS);
      return false;
    }
    Warning.removeWarning(name, className);

    return true;
  }

  private validateDateOfBirth(): boolean {
    const dateOfBirth = document.querySelector(`.${RegInputClasses.REG_DATE_OF_BIRTH} > input`) as HTMLInputElement;

    const enteredDate = new Date(dateOfBirth.value);
    const checkDate = new Date();
    enteredDate.setFullYear(enteredDate.getFullYear() + 13);

    if (checkDate.getTime() >= enteredDate.getTime()) {
      Warning.removeWarning(dateOfBirth, RegInputClasses.REG_DATE_OF_BIRTH);
    } else {
      Warning.addWarning(dateOfBirth, RegInputClasses.REG_DATE_OF_BIRTH, WarningMessage.INCORRECT_AGE);
      return false;
    }
    return true;
  }

  private validateStreet(isBilling: boolean = true): boolean {
    let elementClass = RegInputClasses.REG_STREET;
    if (!isBilling) {
      elementClass = RegInputClasses.REG_STREET_SHIPPING;
    }
    const street = document.querySelector(`.${elementClass} > input`) as HTMLInputElement;

    if (street.value.length > 0) {
      Warning.removeWarning(street, elementClass);
    } else {
      Warning.addWarning(street, elementClass, WarningMessage.NOT_EMPTY);
      return false;
    }
    return true;
  }

  private validateCountry(isBilling: boolean = true): boolean {
    let elementClass = RegInputClasses.REG_COUNTRY;
    if (!isBilling) {
      elementClass = RegInputClasses.REG_COUNTRY_SHIPPING;
    }
    const country = document.querySelector(`.${elementClass} > select`) as HTMLInputElement;
    if (country.value !== '-1') {
      Warning.removeWarning(country, elementClass);
    } else {
      Warning.addWarning(country, elementClass, WarningMessage.COUNTRY_MANDATORY);
      return false;
    }
    return true;
  }

  private validatePostalCode(isBilling: boolean = true): boolean {
    let elementClass = RegInputClasses.REG_COUNTRY;
    if (!isBilling) {
      elementClass = RegInputClasses.REG_COUNTRY_SHIPPING;
    }
    let elementClassPostalCode = RegInputClasses.REG_POSTAL_CODE;
    if (!isBilling) {
      elementClassPostalCode = RegInputClasses.REG_POSTAL_CODE_SHIPPING;
    }
    const postalCode = document.querySelector(`.${elementClassPostalCode} > input`) as HTMLInputElement;
    const country = document.querySelector(`.${elementClass} > select`) as HTMLInputElement;

    if (country.value === '-1') {
      Warning.removeWarning(postalCode, elementClassPostalCode);
      return true;
    }
    const findCountry = countriesInfo.find(
      (countryInfo: ICountryInfo) => countryInfo.ISO === country.value
    ) as ICountryInfo;

    if (findCountry !== null) {
      if (postalCode.value.match(findCountry.Regex)) {
        Warning.removeWarning(postalCode, elementClassPostalCode);
      } else {
        const msg = `${WarningMessage.POSTAL_CODE} - ${findCountry.Format}`;
        Warning.addWarning(postalCode, elementClassPostalCode, msg);
        return false;
      }
    }
    return true;
  }
}
