import { RegInputClasses } from '../../../data/fields';
import { ICountryInfo, countriesInfo } from '../../../data/country';
import { Warning } from '../input-field-warning/Warning';

export enum WarningMessage {
  EMAIL = 'Enter a valid email address!',
  PASS_EMPTY = 'Fill the password please!',
  PASS_INCORRECT_LENGTH = 'Password length must be at least 8 characters!',
  PASS_INCORRECT_REQUIREMENTS = 'Password should contain a combination of uppercase and lowercase letter and number',
  CONFIRM_PASS = 'Passwords are not the same',
  ONLY_CHARACTERS = 'Must contain at least one character and no special characters or numbers',
  NOT_EMPTY = 'Field should not be empty',
  INCORRECT_AGE = 'Age should be above 13 years',
  POSTAL_CODE = 'Must follow the format for the country',
}

export class FieldValidator {
  private PATH_MIN_LENGTH = 8;

  public validateFields(event: Event): void {
    let isCorrect = true;
    isCorrect = this.validateEmail() && isCorrect;
    isCorrect = this.validatePass() && isCorrect;
    isCorrect = this.validateConfirmPass() && isCorrect;
    isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_FIRST_NAME) && isCorrect;
    isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_LAST_NAME) && isCorrect;
    isCorrect = this.validateDateOfBirth() && isCorrect;
    isCorrect = this.validateStreet() && isCorrect;
    isCorrect = this.validateOnlyCharacters(RegInputClasses.REG_CITY) && isCorrect;
    isCorrect = this.validatePostalCode() && isCorrect;

    if (!isCorrect) {
      event.preventDefault();
    }
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
        warningMsg = WarningMessage.PASS_EMPTY;
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
        warningMsg = WarningMessage.PASS_EMPTY;
      } else {
        warningMsg = WarningMessage.CONFIRM_PASS;
      }
      Warning.addWarning(confirmPass, RegInputClasses.REG_CONFIRM_PASS, warningMsg);

      return false;
    }
    return true;
  }

  private validateOnlyCharacters(className: string): boolean {
    const notLetters = /[^a-zA-Z]/g;
    const name = document.querySelector(`.${className} > input`) as HTMLInputElement;

    if (name.value.match(notLetters) || name.value.length === 0) {
      Warning.addWarning(name, className, WarningMessage.ONLY_CHARACTERS);
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

  private validateStreet(): boolean {
    const street = document.querySelector(`.${RegInputClasses.REG_STREET} > input`) as HTMLInputElement;

    if (street.value.length > 0) {
      Warning.removeWarning(street, RegInputClasses.REG_STREET);
    } else {
      Warning.addWarning(street, RegInputClasses.REG_STREET, WarningMessage.NOT_EMPTY);
      return false;
    }
    return true;
  }

  private validatePostalCode(): boolean {
    const postalCode = document.querySelector(`.${RegInputClasses.REG_POSTAL_CODE} > input`) as HTMLInputElement;
    const country = document.querySelector(`.${RegInputClasses.REG_COUNTRY} > select`) as HTMLInputElement;

    const findCountry = countriesInfo.find(
      (countryInfo: ICountryInfo) => countryInfo.ISO === country.value
    ) as ICountryInfo;

    if (findCountry !== null) {
      if (postalCode.value.match(findCountry.Regex)) {
        Warning.removeWarning(postalCode, RegInputClasses.REG_POSTAL_CODE);
      } else {
        const msg = `${WarningMessage.POSTAL_CODE} - ${findCountry.Format}`;
        Warning.addWarning(postalCode, RegInputClasses.REG_POSTAL_CODE, msg);
        return false;
      }
    }
    return true;
  }
}
