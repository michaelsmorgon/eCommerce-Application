/* eslint-disable max-lines-per-function */
import { ProductData } from '@commercetools/platform-sdk';
import ElementCreator, { ElementConfig, IAttribute } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';

const CssClassesProduct = {
  PRODUCT_DETAILS: 'product-details',
  PRODUCT_DETAILS_TOP: 'product-details__top',
  PRODUKT_IMG_CONTAINER: 'produkt-img__container',
  PRODUKT_SLIDER_WRAPP: 'produkt-img__slider-wrapper',
  PRODUKT_IMG_SLIDER: 'produkt-img__slider',
  LEFT_BUTTON: 'left-button',
  RIGHT_BUTTON: 'right-button',
  PRODUKT_IMG_WRAPP: 'produkt-img__wrapper',
  PRODUKT_IMG: 'produkt-img',
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
  PRODUCT_INFO_COLOR: 'product__color',
  PRODUCT_INFO_SIZE_OPTIONS: 'product__size-options',
  PRODUCT_INFO_SIZE: 'product__size',
  PRODUCT_INFO_MATERIAL: 'product__material',
  MATERIAL_PRODUKT: 'material-produkt',
  ABOUT_ORDER: 'about-order',
  AVAILABILITY: 'availability',
  DELIVERY: 'delivery',
  PRODUCT_DETAILS_BOTTOM: 'product-details__bottom',
  PRODUKT_DESCRIPTION: 'produkt-description',
  PRODUKT_DESCRIPTION_HEADER: 'produkt-description__header',
  PRODUKT_DESCRIPTION_CONTENT: 'produkt-description__content',
};

export default class ProductDetails extends View {
  constructor(private productData: ProductData) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DETAILS],
    };
    super(params);
    this.viewElementCreator.addInnerElement(this.addTopContainer());
    this.viewElementCreator.addInnerElement(this.addBottomContainer());
  }

  private addImage(): ElementCreator {
    const attr: IAttribute[] = [];
    if (this.productData.masterVariant.images && this.productData.masterVariant.images?.length > 0) {
      const [imageUrl] = this.productData.masterVariant.images;
      attr.push({ name: 'src', value: imageUrl.url });
    }

    attr.push({ name: 'alt', value: this.productData.name.en });

    const imgContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUKT_IMG_CONTAINER],
    };
    const imageContainer = new ElementCreator(imgContainerParams);

    const discount = this.getDiscount();
    if (discount !== null) {
      imageContainer.addInnerElement(this.addDiscount(discount));
    }

    // slider

    const sliderWrappperParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUKT_IMG_WRAPP],
    };

    const sliderImageContainer = new ElementCreator(sliderWrappperParams);

    const leftButton = this.createButton(CssClassesProduct.LEFT_BUTTON);
    const rightButton = this.createButton(CssClassesProduct.RIGHT_BUTTON);

    const sliderImages: ElementCreator[] = [];
    const uniqueImageUrls = new Set();

    this.productData.variants.forEach((variant) => {
      if (variant.images && variant.images?.length > 0) {
        const [imageUrl] = variant.images;
        const imageUrlString = imageUrl.url;

        if (!uniqueImageUrls.has(imageUrlString)) {
          uniqueImageUrls.add(imageUrlString);
          const attrSliderImg = [
            { name: 'src', value: imageUrlString },
            { name: 'alt', value: this.productData.name.en },
          ];
          const variantImage = new ElementCreator({
            tag: 'img',
            classNames: [CssClassesProduct.PRODUKT_IMG_SLIDER],
            attributes: attrSliderImg,
          });
          sliderImages.push(variantImage);
        }
      }
    });

    sliderImages.forEach((image) => {
      sliderImageContainer.addInnerElement(image);
    });

    imageContainer.addInnerElement(leftButton);
    imageContainer.addInnerElement(sliderImageContainer);
    imageContainer.addInnerElement(rightButton);

    return imageContainer;
  }

  private createButton(className: string): HTMLElement {
    const buttonParams: ElementConfig = {
      tag: 'div',
      classNames: [className],
    };
    return new ElementCreator(buttonParams).getElement();
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
    /*  const priceBrandContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_CENTR],
    };
    const priceBrandContainer = new ElementCreator(priceBrandContainerParams);

    const brandImageParams: ElementConfig = {
      tag: 'img',
      classNames: [CssClassesProduct.PRODUCT_INFO_BRAND],
      attributes: [
        { name: 'src', value: '' }, // Replace with actual brand URL
        { name: 'alt', value: 'brand-icon' },
      ],
    };
    const brandImage = new ElementCreator(brandImageParams);
    priceBrandContainer.addInnerElement(brandImage); 
    priceBrandContainer.addInnerElement(priceContainer); */
    productInfoCentr.addInnerElement(priceContainer);

    return productInfoCentr;
  }

  private addProductInfoBottom(): ElementCreator {
    const productInfoBottomParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_BOTTOM],
    };
    const productInfoBottom = new ElementCreator(productInfoBottomParams);

    // color
    const colorsOptionsParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_COLORS_OPTIONS],
    };
    const colorsOptions = new ElementCreator(colorsOptionsParams);
    const colors = [];
    const attrs = this.productData.masterVariant.attributes;
    const colorAttr = attrs?.find((attr) => attr.name === 'color');

    if (colorAttr && colorAttr.value && colorAttr.value.key) {
      const colorMaster = colorAttr.value.label.en;
      colors.push(colorMaster);
    }

    this.productData.variants.forEach((variant) => {
      const attrsVariant = variant.attributes;
      const colorAttrVariant = attrsVariant?.find((attr) => attr.name === 'color');

      if (colorAttrVariant && colorAttrVariant.value && colorAttrVariant.value.key) {
        const colorVariant = colorAttrVariant.value.label.en;
        colors.push(colorVariant);
      }
    });
    const uniqueColorsSet = new Set(colors);
    const uniqueColorsArray = [...uniqueColorsSet];
    const colorOptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_COLOR],
      textContent: uniqueColorsArray.join(', '),
    };
    const colorOption = new ElementCreator(colorOptionParams);
    colorsOptions.addInnerElement(colorOption);
    productInfoBottom.addInnerElement(colorsOptions);

    // size
    const sizeAttr = attrs?.find((attr) => attr.name === 'size');
    const sizes = [];

    if (sizeAttr && sizeAttr.value && sizeAttr.value.label) {
      const sizeMaster = sizeAttr.value.label.en;
      sizes.push(sizeMaster);
    }

    this.productData.variants.forEach((variant) => {
      const attrsVariant = variant.attributes;
      const sizeAttrVariant = attrsVariant?.find((attr) => attr.name === 'size');

      if (sizeAttrVariant && sizeAttrVariant.value && sizeAttrVariant.value.label) {
        const sizeVariant = sizeAttrVariant.value.label.en;
        sizes.push(sizeVariant);
      }
    });

    const uniqueSizesSet = new Set(sizes);
    const uniqueSizesArray = [...uniqueSizesSet];
    const sizeOptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_SIZE],
      textContent: uniqueSizesArray.join(', '),
    };
    const sizeOption = new ElementCreator(sizeOptionParams);
    productInfoBottom.addInnerElement(sizeOption);

    // material
    const materialAttr = attrs?.find((attr) => attr.name === 'material');
    const materials = [];

    if (materialAttr && materialAttr.value && materialAttr.value.label) {
      const materialMaster = materialAttr.value.label.en;
      materials.push(materialMaster);
    }

    this.productData.variants.forEach((variant) => {
      const attrsVariant = variant.attributes;
      const materialAttrVariant = attrsVariant?.find((attr) => attr.name === 'material');

      if (materialAttrVariant && materialAttrVariant.value && materialAttrVariant.value.label) {
        const materialVariant = materialAttrVariant.value.label.en;
        materials.push(materialVariant);
      }
    });

    const uniqueMaterialsSet = new Set(materials);
    const uniqueMaterialsArray = [...uniqueMaterialsSet];
    const materialOptionParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_INFO_MATERIAL],
      textContent: uniqueMaterialsArray.join(', '),
    };
    const materialOption = new ElementCreator(materialOptionParams);
    productInfoBottom.addInnerElement(materialOption);

    // aboutOrder
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
    productInfoBottom.addInnerElement(aboutOrder);

    return productInfoBottom;
  }

  private addTopContainer(): HTMLElement {
    const topContainerParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUCT_DETAILS_TOP],
    };
    const topContainer = new ElementCreator(topContainerParams);
    topContainer.addInnerElement(this.addImage());
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
      classNames: [CssClassesProduct.PRODUKT_DESCRIPTION],
    };
    const produktDescription = new ElementCreator(descriptionParams);

    const descriptionHeaderParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUKT_DESCRIPTION_HEADER],
      textContent: 'Description',
    };
    const descriptionHeader = new ElementCreator(descriptionHeaderParams);

    const descriptionContentParams: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesProduct.PRODUKT_DESCRIPTION_CONTENT],
      textContent: this.productData.metaDescription?.en || '',
    };
    const descriptionContent = new ElementCreator(descriptionContentParams);

    produktDescription.addInnerElement(descriptionHeader);
    produktDescription.addInnerElement(descriptionContent);

    produktDetailBottom.addInnerElement(produktDescription);

    return produktDetailBottom;
  }
}
