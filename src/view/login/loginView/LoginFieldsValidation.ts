export class LoginFieldValidator {
  private PATH_MIN_LENGTH = 8;

  public validateEmail(email: string): boolean {
    const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(regEmail)) {
      return true;
    }

    return false;
  }

  public validatePass(password: string): boolean {
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    if (
      !password.match(lowerCaseLetters) ||
      !password.match(upperCaseLetters) ||
      !password.match(numbers) ||
      password.length < this.PATH_MIN_LENGTH
    ) {
      return false;
    }

    return true;
  }
}
