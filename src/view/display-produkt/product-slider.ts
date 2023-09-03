export default class ImageSlider {
  private slider: HTMLDivElement;

  private currentIndex: number;

  private slides: HTMLElement[] = [];

  private slideWidth!: number;

  constructor(currentIndex: number) {
    this.slider = document.querySelector('.product-img__wrapper') as HTMLDivElement;
    const slides = document.querySelectorAll('.product-img');
    this.slides = Array.from(slides) as HTMLElement[];
    this.init();
    this.currentIndex = currentIndex;
    this.updateSlideWidth();

    window.addEventListener('resize', () => {
      this.updateSlideWidth();
      this.updateSliderPosition();
    });
  }

  private updateSliderPosition(): void {
    const slider = document.querySelector('.product-img__wrapper') as HTMLDivElement;
    if (slider) {
      slider.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
    }
  }

  private updateSlideWidth(): void {
    if (this.slides.length > 0) {
      this.slideWidth = this.slider.clientWidth;
    } else {
      this.slideWidth = 0;
    }
  }

  showPrevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this.updateSliderPosition();
    } else {
      this.currentIndex = this.slides.length - 1;
      this.updateSliderPosition();
    }
  }

  showNextSlide(): void {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex += 1;
      this.updateSliderPosition();
    } else {
      this.currentIndex = 0;
      this.updateSliderPosition();
    }
  }

  init(): void {
    const prevButton = document.querySelector('.left-button');
    const nextButton = document.querySelector('.right-button');

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', this.showPrevSlide.bind(this));
      nextButton.addEventListener('click', this.showNextSlide.bind(this));
    }
  }
}
