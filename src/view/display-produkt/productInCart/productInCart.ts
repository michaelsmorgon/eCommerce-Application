export default class ShoppingCartManager {
  handleAddToCartClick(productKey: string): void {
    console.log('Click ADD TO CART');
    console.log(productKey);
  }

  handleRemoveToCartClick(): void {
    console.log('Click Remove from Cart');
  }
}
