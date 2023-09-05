export default class ImageSlider {
  private slider: HTMLDivElement;

  private currentIndex: number;

  private slides: HTMLElement[] = [];

  private slideWidth!: number;

  constructor(currentIndex: number) {
    this.slider = document.querySelector('.product-img__wrapper') as HTMLDivElement;
    const slides = document.querySelectorAll('.product-img');
    this.slides = Array.from(slides) as HTMLElement[];
    this.currentIndex = currentIndex;
    this.updateSlideWidth();

    window.addEventListener('resize', () => {
      this.updateSlideWidth();
      this.updateSliderPosition();
    });
  }

  private updateSliderPosition(): void {
    if (this.slider) {
      this.slider.style.transition = 'transform 0.5s ease-in-out';
      this.slider.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
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
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.updateSliderPosition();
      this.updateButtonStates();
    }
  }

  showNextSlide(): void {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.updateSliderPosition();
      this.updateButtonStates();
    }
  }

  init(): void {
    const prevButton = document.querySelector('.left-button');
    const nextButton = document.querySelector('.right-button');

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', () => this.showPrevSlide());
      nextButton.addEventListener('click', () => this.showNextSlide());
      this.updateButtonStates();
    }
  }

  private updateButtonStates(): void {
    const prevButton = document.querySelector('.left-button') as HTMLButtonElement;
    const nextButton = document.querySelector('.right-button') as HTMLButtonElement;

    if (prevButton && nextButton) {
      if (this.currentIndex === 0) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }

      if (this.currentIndex === this.slides.length - 1) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
    }
  }
}
