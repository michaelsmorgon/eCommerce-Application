export class LocaleStorage {
  static TOKEN = 'token';

  public static saveLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  public static clearLocalStorage(name: string): void {
    localStorage.removeItem(name);
  }
}
