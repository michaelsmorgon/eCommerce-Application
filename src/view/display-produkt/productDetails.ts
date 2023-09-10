import { ProductData } from '@commercetools/platform-sdk';
import ElementCreator, { ElementConfig, IAttribute } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';
import ImageSlider from './product-slider';
import ShoppingCartManager from './productInCart/productInCart';

const CssClassesProduct = {
  PRODUCT_DETAILS: 'product-details',
  PRODUCT_DETAILS_TOP: 'product-details__top',
  PRODUCT_IMG_CONTAINER: 'product-img__container',
  PRODUCT_SLIDER_WRAPP: 'product-img__slider-wrapper',
  LEFT_BUTTON: 'left-button',
  RIGHT_BUTTON: 'right-button',
  PRODUCT_IMG_WRAPP: 'product-img__wrapper',
  PRODUCT_IMG: 'product-img',
  DISCOUNT: 'sale-procent',
  PRODUCT_INFO_CONTAINER: 'product-info__container',
  PRODUCT_INFO_TOP: 'product-info__top',
  PRODUCT_INFO_NAME: 'product__name',
  PRODUCT_INFO_CENTR: 'product-info__centr',
  PRODUCT_INFO_PRICE: 'product__price',
  PRICE_REGULAR: 'price-regular',
  PRICE_SALE: 'price-sale',
  PRODUCT_INFO_BRAND: 'product__brand',
  PRODUCT_INFO_BOTTOM: 'product-info__bottom',
  PRODUCT_INFO_COLORS_OPTIONS: 'product__colors-options',
  PRODUCT_INFO_ATTRIBUTE: 'product__attribute',
  MATERIAL_PRODUKT: 'material-produkt',
  ABOUT_ORDER: 'about-order',
  AVAILABILITY: 'availability',
  DELIVERY: 'delivery',
  PRODUCT_DETAILS_BOTTOM: 'product-details__bottom',
  PRODUCT_DESCRIPTION: 'product-description',
  PRODUCT_DESCRIPTION_HEADER: 'product-description__header',
  PRODUCT_DESCRIPTION_CONTENT: 'product-description__content',
  DOTS: 'slider-dots',
};

export default class ProductDetails extends View {
  private addCartButton: HTMLElement | null = null;

  private removeCartButton: HTMLElement | null = null;

  constructor(
    private productData: ProductData,
    private produktKey: string
  ) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DETAILS],
    };
    super(params);
    this.viewElementCreator.addInnerElement(this.addTopContainer());
    this.viewElementCreator.addInnerElement(this.addBottomContainer());
  }

  private attr: IAttribute[] = [];

  private createImageContainer(): ElementCreator {
    if (this.productData.masterVariant.images && this.productData.masterVariant.images?.length > 0) {
      const [imageUrl] = this.productData.masterVariant.images;
      this.attr.push({ name: 'src', value: imageUrl.url });
    }

    this.attr.push({ name: 'alt', value: this.productData.name.en });

    const imgContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_IMG_CONTAINER],
    };
    const imageContainer = new ElementCreator(imgContainerParams);

    return imageContainer;
  }

  private createImageWrapper(): ElementCreator {
    const imgWrapperParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_IMG_WRAPP],
    };
    return new ElementCreator(imgWrapperParams);
  }

  private createImageElement(): ElementCreator {
    const imgParams: ElementConfig = {
      tag: 'img',
      classNames: [CssClassesProduct.PRODUCT_IMG],
      attributes: this.attr,
    };
    return new ElementCreator(imgParams);
  }

  private createVariantImage(imageUrl: string): ElementCreator {
    const attrSliderImg = [
      { name: 'src', value: imageUrl },
      { name: 'alt', value: this.productData.name.en },
    ];
    return new ElementCreator({
      tag: 'img',
      classNames: [CssClassesProduct.PRODUCT_IMG],
      attributes: attrSliderImg,
    });
  }

  private createSliderImages(): ElementCreator[] {
    const sliderImages: ElementCreator[] = [];
    const uniqueImageUrls = new Set();

    this.productData.variants.forEach((variant) => {
      if (variant.images && variant.images?.length > 0) {
        const [imageUrl] = variant.images;
        const imageUrlString = imageUrl.url;

        if (!uniqueImageUrls.has(imageUrlString)) {
          uniqueImageUrls.add(imageUrlString);
          const variantImage = this.createVariantImage(imageUrlString);
          sliderImages.push(variantImage);
        }
      }
    });

    return sliderImages;
  }

  private createImageSlider(): ElementCreator {
    const imageContainer = this.createImageContainer();

    const discount = this.getDiscount();
    if (discount !== null) {
      imageContainer.addInnerElement(this.addDiscount(discount));
    }

    const imageWrapper = this.createImageWrapper();
    imageWrapper.addInnerElement(this.createImageElement());

    const leftButton = this.createButton(CssClassesProduct.LEFT_BUTTON);
    const rightButton = this.createButton(CssClassesProduct.RIGHT_BUTTON);

    const sliderImages = this.createSliderImages();

    const sliderWrappperParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_SLIDER_WRAPP],
    };
    const sliderImageContainer = new ElementCreator(sliderWrappperParams);

    const dotsParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.DOTS],
    };
    const dotsContainer = new ElementCreator(dotsParams);

    sliderImages.forEach((image) => {
      imageWrapper.addInnerElement(image);
    });

    imageContainer.addInnerElement(leftButton);
    imageContainer.addInnerElement(sliderImageContainer);
    sliderImageContainer.addInnerElement(imageWrapper);
    sliderImageContainer.addInnerElement(dotsContainer);
    imageContainer.addInnerElement(rightButton);

    return imageContainer;
  }

  private createButton(className: string, callback?: () => void): HTMLElement {
    const buttonParams: ElementConfig = {
      tag: 'div',
      classNames: [className],
    };

    const buttonElement = new ElementCreator(buttonParams).getElement();

    if (callback) {
      buttonElement.addEventListener('click', callback);
    }

    return buttonElement;
  }

  private createPriceElement(discount: string | null): ElementCreator {
    const priceContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_PRICE],
    };
    const priceContainer = new ElementCreator(priceContainerParams);

    const prices = [...(this.productData.masterVariant?.prices || [])];
    let productPrice = '';
    let newPrice = '';
    if (prices && prices[0]) {
      const calcPrice = prices[0].value.centAmount / 100;
      productPrice = `${calcPrice.toFixed(2)} ${prices[0].value.currencyCode}`;
      if (discount !== null) {
        newPrice = `${((calcPrice * (100 - +discount)) / 100).toFixed(2)} ${prices[0].value.currencyCode}`;
      }
    }

    const priceParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRICE_SALE],
      textContent: discount !== null ? newPrice : productPrice,
    };
    const price = new ElementCreator(priceParams);
    priceContainer.addInnerElement(price);

    if (discount !== null) {
      const oldPriceParams: ElementConfig = {
        tag: 'div',
        classNames: [CssClassesProduct.PRICE_REGULAR],
        textContent: productPrice,
      };
      const oldPrice = new ElementCreator(oldPriceParams);
      priceContainer.addInnerElement(oldPrice);
    }
    return priceContainer;
  }

  private addDiscount(text: string): ElementCreator {
    const discountParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.DISCOUNT],
      textContent: `${text}%`,
    };
    return new ElementCreator(discountParams);
  }

  private getDiscount(): string | null {
    const attrs = this.productData.masterVariant?.attributes || [];
    const res = attrs.find((attr) => attr.name === 'discount');
    if (res?.value.label) {
      return res?.value.label.slice(0, -1);
    }

    return null;
  }

  private addProductInfoContainer(): ElementCreator {
    const productInfoContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_CONTAINER],
    };
    const productInfoContainer = new ElementCreator(productInfoContainerParams);

    productInfoContainer.addInnerElement(this.addProductInfoTop());

    productInfoContainer.addInnerElement(this.addProductInfoCentr());

    productInfoContainer.addInnerElement(this.addProductInfoBottom());

    return productInfoContainer;
  }

  private addProductInfoTop(): ElementCreator {
    const productInfoTopParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_TOP],
    };
    const productInfoTop = new ElementCreator(productInfoTopParams);

    productInfoTop.addInnerElement(this.addProductName());

    return productInfoTop;
  }

  private addProductInfoCentr(): ElementCreator {
    const productInfoCentrParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_CENTR],
    };
    const productInfoCentr = new ElementCreator(productInfoCentrParams);
    const priceContainer = this.createPriceElement(this.getDiscount());

    productInfoCentr.addInnerElement(priceContainer);

    return productInfoCentr;
  }

  private createColorOption(): ElementCreator {
    const colors = new Set<string>();
    const attrs = this.productData.masterVariant.attributes;
    const colorAttr = attrs?.find((attr) => attr.name === 'color');

    if (colorAttr && colorAttr.value && colorAttr.value.label.en) {
      colors.add(colorAttr.value.label.en);

      this.productData.variants.forEach((variant) => {
        const attrsVariant = variant.attributes;
        const colorAttrVariant = attrsVariant?.find((attr) => attr.name === 'color');

        if (colorAttrVariant && colorAttrVariant.value && colorAttrVariant.value.label.en) {
          colors.add(colorAttrVariant.value.label.en);
        }
      });

      const colorOptionContainer = new ElementCreator({
        tag: 'div',
        classNames: [CssClassesProduct.PRODUCT_INFO_ATTRIBUTE],
        textContent: `Color: `,
      });
      colors.forEach((color) => {
        const sizeElement = new ElementCreator({
          tag: 'div',
          classNames: ['color-option'],
          textContent: `${color}`,
        });
        colorOptionContainer.addInnerElement(sizeElement);
      });
      return colorOptionContainer;
    }
    const defaultOptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_ATTRIBUTE],
    };

    return new ElementCreator(defaultOptionParams);
  }

  private createSizeOption(): ElementCreator {
    const sizes = new Set<string>();
    const attrs = this.productData.masterVariant.attributes;
    const sizeAttr = attrs?.find((attr) => attr.name === 'size');

    if (sizeAttr && sizeAttr.value && sizeAttr.value.label) {
      sizes.add(sizeAttr.value.label);

      this.productData.variants.forEach((variant) => {
        const attrsVariant = variant.attributes;
        const sizeAttrVariant = attrsVariant?.find((attr) => attr.name === 'size');
        if (sizeAttrVariant && sizeAttrVariant.value && sizeAttrVariant.value.label) {
          sizes.add(sizeAttrVariant.value.label);
        }
      });
      const sizeOptionContainer = new ElementCreator({
        tag: 'div',
        classNames: [CssClassesProduct.PRODUCT_INFO_ATTRIBUTE],
        textContent: `Size: `,
      });
      sizes.forEach((size) => {
        const sizeElement = new ElementCreator({
          tag: 'div',
          classNames: ['size-option'],
          textContent: `${size}`,
        });
        sizeOptionContainer.addInnerElement(sizeElement);
      });
      return sizeOptionContainer;
    }
    const defaultOptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_ATTRIBUTE],
    };
    return new ElementCreator(defaultOptionParams);
  }

  private createMaterialOption(): ElementCreator {
    const materials = new Set<string>();
    const attrs = this.productData.masterVariant.attributes;
    const materialAttr = attrs?.find((attr) => attr.name === 'material');
    if (materialAttr && materialAttr.value && materialAttr.value.label.en) {
      materials.add(materialAttr.value.label.en);
      this.productData.variants.forEach((variant) => {
        const attrsVariant = variant.attributes;
        const materialAttrVariant = attrsVariant?.find((attr) => attr.name === 'material');
        if (materialAttrVariant && materialAttrVariant.value && materialAttrVariant.value.label.en) {
          materials.add(materialAttrVariant.value.label.en);
        }
      });
      const materialOptionContainer = new ElementCreator({
        tag: 'div',
        classNames: [CssClassesProduct.PRODUCT_INFO_ATTRIBUTE],
        textContent: `Material: `,
      });
      materials.forEach((material) => {
        const sizeElement = new ElementCreator({
          tag: 'div',
          classNames: ['material-option'],
          textContent: `${material}`,
        });
        materialOptionContainer.addInnerElement(sizeElement);
      });
      return materialOptionContainer;
    }
    const defaultOptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_ATTRIBUTE],
    };
    return new ElementCreator(defaultOptionParams);
  }

  private createAboutOrder(): ElementCreator {
    const aboutOrderParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.ABOUT_ORDER],
    };
    const aboutOrder = new ElementCreator(aboutOrderParams);

    const availabilityParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.AVAILABILITY],
      textContent: 'In stock. Delivery tomorrow',
    };
    const availability = new ElementCreator(availabilityParams);

    const shippingCost = 30;
    const shippingMessage = `Free shipping from: ${shippingCost}$`;

    const deliveryParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.DELIVERY],
      textContent: shippingMessage,
    };
    const delivery = new ElementCreator(deliveryParams);

    aboutOrder.addInnerElement(availability);
    aboutOrder.addInnerElement(delivery);

    return aboutOrder;
  }

  private createCartButton(isAddToCart: boolean): ElementCreator {
    const buttonParams: ElementConfig = {
      tag: 'button',
      classNames: isAddToCart ? ['add-cart'] : ['remove-cart'],
      textContent: isAddToCart ? 'Add to Cart' : 'Remove from Cart',
    };

    const button = new ElementCreator(buttonParams);
    const shoppingCartManager = new ShoppingCartManager();

    button.getElement().addEventListener('click', () => {
      if (isAddToCart) {
        shoppingCartManager.handleAddToCartClick(this.produktKey);
        if (this.addCartButton) {
          this.addCartButton.style.display = 'none';
        }
        if (this.removeCartButton) {
          this.removeCartButton.style.display = 'block';
        }
      } else {
        shoppingCartManager.handleRemoveToCartClick();
        if (this.addCartButton) {
          this.addCartButton.style.display = 'block';
        }
        if (this.removeCartButton) {
          this.removeCartButton.style.display = 'none';
        }
      }
    });

    if (isAddToCart) {
      this.addCartButton = button.getElement();
    } else {
      this.removeCartButton = button.getElement();
    }

    return button;
  }

  private addProductInfoBottom(): ElementCreator {
    const productInfoBottomParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_BOTTOM],
    };
    const productInfoBottom = new ElementCreator(productInfoBottomParams);

    productInfoBottom.addInnerElement(this.createColorOption());
    productInfoBottom.addInnerElement(this.createSizeOption());
    productInfoBottom.addInnerElement(this.createMaterialOption());
    productInfoBottom.addInnerElement(this.createAboutOrder());

    const addCartButton = this.createCartButton(true);
    const removeCartButton = this.createCartButton(false);
    productInfoBottom.addInnerElement(addCartButton);
    productInfoBottom.addInnerElement(removeCartButton);

    return productInfoBottom;
  }

  private addTopContainer(): HTMLElement {
    const topContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DETAILS_TOP],
    };
    const topContainer = new ElementCreator(topContainerParams);
    topContainer.addInnerElement(this.createImageSlider());
    topContainer.addInnerElement(this.addProductInfoContainer());
    return topContainer.getElement();
  }

  private addProductName(): ElementCreator {
    const productNameParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_NAME],
      textContent: this.productData.name.en,
    };
    const productName = new ElementCreator(productNameParams);
    return productName;
  }

  private addBottomContainer(): ElementCreator {
    const bottomParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DETAILS_BOTTOM],
    };
    const produktDetailBottom = new ElementCreator(bottomParams);

    const descriptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DESCRIPTION],
    };
    const produktDescription = new ElementCreator(descriptionParams);

    const descriptionHeaderParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DESCRIPTION_HEADER],
      textContent: 'Description',
    };
    const descriptionHeader = new ElementCreator(descriptionHeaderParams);

    const descriptionContentParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DESCRIPTION_CONTENT],
      textContent: this.productData.metaDescription?.en || '',
    };
    const descriptionContent = new ElementCreator(descriptionContentParams);

    produktDescription.addInnerElement(descriptionHeader);
    produktDescription.addInnerElement(descriptionContent);

    produktDetailBottom.addInnerElement(produktDescription);

    return produktDetailBottom;
  }

  public initializeImageSlider(): void {
    const imageSlider = new ImageSlider(0);
    imageSlider.init();
  }
}
