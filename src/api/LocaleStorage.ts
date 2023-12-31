export class LocaleStorage {
  static TOKEN = 'token';

  static CUSTOMER_ID = 'customer_id';

  static CART_ID = 'cart_id';

  static ANONYMOUS_ID = 'anonymous_id';

  public static saveLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value);

    const storageEvent = new Event('storage');
    window.dispatchEvent(storageEvent);
  }

  public static clearLocalStorage(name: string): void {
    localStorage.removeItem(name);

    const storageEvent = new Event('storage');
    window.dispatchEvent(storageEvent);
  }

  public static getValue(name: string): string | undefined {
    const value = localStorage.getItem(name);
    return value !== null ? value : undefined;
  }
}
