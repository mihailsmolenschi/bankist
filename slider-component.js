// --- Slider Component
const slides = document.querySelectorAll(".slide");
const btnSlideRight = document.querySelector(".slider__btn--right");
const btnSlideLeft = document.querySelector(".slider__btn--left");
let currentSlide = 0;
const maxSlides = slides.length;

const goToSlide = (curSlide) => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
  });
};
goToSlide(0); // init all slides, set in positions

const nextSlide = () => {
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
};

const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlides - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
};

btnSlideRight.addEventListener("click", nextSlide);
btnSlideLeft.addEventListener("click", prevSlide);
