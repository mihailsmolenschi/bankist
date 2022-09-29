"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const sectionOne = document.querySelector("#section--1");
const scrollTo = document.querySelector(".btn--scroll-to");

const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window

const openModal = function (event) {
  event.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((element) => {
  for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/////////////////////////////////////////////////////////
// // --- EVENT DELEGATION, implementing page navigation
/////////////////////////////////////////////////////////
// // - Select all nav elements
// // - adds event listeners to all the links of the nav section, not that efficient, better with event delegation
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', e => {
//     e.preventDefault();
//     console.log(`>> 'link' was clicked!`);

//     // get the element href attribute?
//     const sectionID = el.getAttribute('href');
//     console.log(sectionID);

//     // implement smooth scrolling
//     document.querySelector(sectionID).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// // NOTE: what if there are 1000 eventListeners like this added to the page, a more effective way is to use Event Delegation, which means:
// 1. Select parent element of the elements we want to add more event listeners
document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Matching strategy
    if (event.target.classList.contains("nav__link")) {
      // The code below scrolls smooth to a section on a webpage
      // 1. gets the id string from the href, which is the id of the section
      // 2. selects the section with the id id string from the href
      // 3. scrolls smoothly to the section
      document
        .querySelector(event.target.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    }
  });

// NOTE: event delegation is much more efficient and more usefull because if we want to add events to element like buttons that does not yet exist on the page we can do it by assigning an event listener to do some work when it will apper on the page

//////////////////////////////////////////////////
//// --- Building a Tabbed Component
//////////////////////////////////////////////////

// add event listeners to tab
tabsContainer.addEventListener("click", function (e) {
  // The read-only target property of the Event interface is a reference to the object onto which the event was dispatched. It is different from Event.currentTarget when the event handler is called during the bubbling or capturing phase of the event.
  const clicked = e.target.closest(".operations__tab"); // to get event listener only from the buttons, not the spans that are inside the buttons
  console.log(clicked);

  // Guard clause, wich means if clicked is falsy value wich basicaly means that there was no button pressed.
  if (!clicked) return;

  // -- Remove active class from all tabs
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((tab) =>
    tab.classList.remove("operations__content--active")
  );

  // -- Activating tab
  // add active tab style to tab that was clicked
  clicked.classList.add("operations__tab--active");

  // -- Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// --- Menu fade animation

const handleHover = function (event) {
  //
  if (event.target.classList.contains("nav__link")) {
    const link = event.target;

    const siblings = link.closest(".nav").querySelectorAll(".nav__link");

    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener("mouseover", function (event) {
//   //
//   handleHover(event, 0.5);
// });

nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

// --- Sticky navigation

const initialCoords = sectionOne.getBoundingClientRect();

window.addEventListener("scroll", function (e) {
  // console.log(e);

  if (window.scrollY > initialCoords.top) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
});

// --- Sticky navigation: Intersection observer API
// Note: Intersecion observer API basically allow our code to observe chances to the way a certain target element intersects another element, or the way it intersects the viewport.

// const observerCallback = function (entries, observer) {
//   entries.forEach((entry) => console.log(entry));
// };

// const observerOptins = {
//   root: null,
//   threshold: [0, 0.2], // this is percentage of intersection at which the observerCallback will be called.
// };

// const observer = new IntersectionObserver(observerCallback, observerOptins);
// observer.observe(sectionOne);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = (entries) => {
  //
  // gets the first element of the array, like entries[0]
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, options);

headerObserver.observe(header);

// --- Reveal sections

const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  //
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);

  // PUT THIS BACK LATER
  // section.classList.add("section--hidden");
});

// --- Lazy loading images

// The dataset read-only property of the HTMLElement interface provides read/write access to custom data attributes (data-*) on elements. It exposes a map of strings (DOMStringMap) with an entry for each data-* attribute.
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  // stop observing those images because it's no longer necesary
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// --- Building slider component
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const sliderBtnLeft = document.querySelector(".slider__btn--left");
  const sliderBtnRight = document.querySelector(".slider__btn--right");
  let currentSlide = 0;
  const maxSlides = slides.length - 1;

  const dotContainer = document.querySelector(".dots");

  // * Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // remove active class from all buttons
    document
      .querySelectorAll(".dots__dot")
      .forEach((el) => el.classList.remove("dots__dot--active"));

    // add active class to the button that is activated
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // // scale down the slider  >> TEMP
  // const slider = document.querySelector(".slider");
  // slider.style.transform = "scale(0.4) traslateX(-800px)";
  // slider.style.overflow = "visible";
  // // << TEMP

  const goToSlide = function (slide) {
    // The translateX() CSS function repositions an element horizontally on the 2D plane. Its result is a <transform-function> data type.
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    // 0%, 100%, 200%, 300%
  };

  const nextSlide = function () {
    if (currentSlide === maxSlides) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlides;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = () => {
    createDots();
    // add active class to the slide 0, initialization
    activateDot(0);
    goToSlide(0); // init all slides with transform = translate(value)
  };
  init();

  // * Event handlers
  // Next slide
  sliderBtnRight.addEventListener("click", nextSlide);

  // Previous slide
  sliderBtnLeft.addEventListener("click", prevSlide);

  // - Add slide with keys functionality
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      prevSlide();
    }
    if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  // - Add slide with dots
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      // DESTRUCTURING OBJECT: its basically like this:
      // const slide = clickedDot.dataset.slide;
      const { slide } = e.target.dataset;
      console.log(e.target);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////
///// PRACTICE
////////////////////////////////////////////////////
////////////////////////////////////////////////////

// ////////////////////////////////////////////////////
// // --- Selecting, Creating and Deleting Elements
// ////////////////////////////////////////////////////

// // -- Selecting elements
// // if we want to apply elements styles to the entire document we need to select documentElement.
// console.log(document.documentElement);

// // to select document header
// // console.log(document.head);
// // to select document body
// console.log(document.body);

// console.log(document.querySelector(".header"));
// console.log(document.querySelectorAll(".section"));
// const section = document.querySelectorAll(".section");
// console.log(section);

// console.log(document.getElementById("section--1"));
// console.log(document.getElementsByTagName("buttons"));
// console.log(document.getElementsByClassName("btn"));

// // -- Creating and inserting elements
// // .insertAdjacentHtml

// const message = document.createElement("div");
// message.classList.add("cookie-message");
// // message.textContent = "Hello world, hello cookie";
// message.innerHTML =
//   'Hello again <button class="btn btn--close-cookie">press bleaghi</button>';

// const header = document.querySelector(".header");
// header.prepend(message);
// // appers only the last message, because in DOM can be only one instance, like humans can't be in to locations simultaniously
// header.append(message.cloneNode(true));
// // To add the same message we need to copy it
// header.append(message.cloneNode(true));

// // To insert as siblings use before() and after() methods
// header.before(message.cloneNode(true));
// header.after(message.cloneNode(true));

// // -- Delete elements
// document.querySelector(".btn--close-cookie").addEventListener("click", () => {
//   // message.remove();
//   message.parentElement.removeChild(message); // older way of deleting elements, go up to the parrent el then select child el to remove
// });

// // add click to all buttons to remove parent, which is message + button
// document.querySelectorAll(".btn--close-cookie").forEach((btn) =>
//   btn.addEventListener("click", function () {
//     btn.parentElement.remove();
//   })
// );

// //////////////////////////////////////////////////
// //// -- Styles, attributes and classes
// ///////////////////////////////////////////////////
// // style properties are written with camel case
// document.body.style.backgroundColor = "gray";

// // create a div element
// const cookieMsg = document.createElement("div");
// // add a class to div element
// cookieMsg.classList.add("cookie-message");
// // add some html inside div element
// cookieMsg.innerHTML = `hello <button class="btn btn--clear-cookie">press nahui</button>`;
// // select header class from the dom html
// const header = document.querySelector(".header");
// // add to the header element
// header.prepend(cookieMsg);
// // add backgroundColor style to cookieMsg
// cookieMsg.style.backgroundColor = "green";
// // add an event listener
// cookieMsg.addEventListener("click", () => console.log(`pressed bleaghi`));

// cookieMsg.style.width = "150%";

// // To get css values from css file or inline or even added before with the help of js use "getComputedStyles(varName)"
// // console.log(getComputedStyle(cookieMsg));
// console.log(getComputedStyle(cookieMsg).width);

// // getComputedStyles() returns a string
// cookieMsg.style.width = getComputedStyle(cookieMsg).width + 100 + "px"; //
// console.log(
//   typeof getComputedStyle(cookieMsg).width,
//   getComputedStyle(cookieMsg).width
// );
// console.log(
//   typeof parseFloat(getComputedStyle(cookieMsg).width),
//   parseFloat(getComputedStyle(cookieMsg).width)
// );

// console.log(getComputedStyle(cookieMsg).height);
// cookieMsg.style.height =
//   parseFloat(getComputedStyle(cookieMsg).height) + 100 + "px";

// console.log(getComputedStyle(cookieMsg).height);

// document.documentElement.style.setProperty("--color-primary", "orangered");

// // -- Attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.className);
// console.log(logo.id);
// // - Setting attributes
// logo.alt = "minimalist logo";

// // for non-standard atribute
// console.log(logo.designer);
// console.log(logo.getAttribute("designer"));
// // - Setting attribute for non-standard attributes
// logo.setAttribute("company", "Bankist");

// // getAttribute() vs src
// console.log(logo.src); // absolute
// console.log(logo.getAttribute("src")); // relative
// // getAttribute() vs src on LINKS
// const menuLink = document.querySelector(".nav__link");
// console.log(menuLink.href); // absolute
// console.log(menuLink.getAttribute("href")); // relative

// // --- Data attributes (dataset),
// //  write the attribute with cammel case even if in html its with dash "data-version-number"
// console.log(logo.dataset.versionNumber);

// // --- Classes
// logo.classList.add("test");
// // multiple classes at once
// logo.classList.add("class-one", "class-two", "class-three");
// logo.classList.remove("class-three");
// logo.classList.contains("test");
// logo.classList.toggle("test");

// // - setting class name, don't use it will override all the classes
// // logo.className = "Jonas";

// //////////////////////////////////////////////////
// //// -- Implementing smooth scrolling
// //////////////////////////////////////////////////

// const sectionOne = document.getElementById("section--1");
// const sectionOne = document.querySelector('#section--1');
// const scrollTo = document.querySelector('.btn--scroll-to');

// scrollTo.addEventListener('click', function (event) {
//   //
//   console.log(`scrollTo clicked`);

//   // The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
//   const sectionOneCoords = sectionOne.getBoundingClientRect();
//   console.log(sectionOneCoords);

//   console.log(sectionOneCoords.top);
//   console.log(sectionOneCoords.bottom);
//   console.log(sectionOneCoords.y);
//   console.log(sectionOneCoords.x);
//   console.log(sectionOneCoords.left);
//   console.log(sectionOneCoords.right);

//   console.log(event.target.getBoundingClientRect());

//   // The read-only scrollX property of the Window interface returns the number of pixels that the document is currently scrolled horizontally. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number. You can get the number of pixels the document is scrolled vertically from the scrollY property.
//   console.log(`Current scroll (x/y): ${window.scrollX}, ${window.scrollY}`);
//   // Current viewport height and width
//   console.log(
//     `Current viewport widht ${document.documentElement.clientWidth} and height ${document.documentElement.clientHeight}`
//   );

// Implementing scrolling to the element
// Window.scrollTo() scrolls to a particular set of coordinates in the document.
// window.scrollTo(sectionOneCoords.left, sectionOneCoords.top);

// // This is the absolute position of the element relative to the entire document
// window.scrollTo(
//   sectionOneCoords.left + window.pageXOffset,
//   sectionOneCoords.top + window.pageYOffset
// );

// // setting the smooth effect
// window.scrollTo({
//   left: sectionOneCoords.left + window.pageXOffset,
//   top: sectionOneCoords.top + window.pageYOffset,
//   behavior: "smooth",
// });

// A newer way to do all of the above with scrolling
//   sectionOne.scrollIntoView({ behavior: 'smooth' });
// });

// //////////////////////////////////////////////////
// //// -- Types of events and event handlers
// //////////////////////////////////////////////////

// // An event - is anything of importance that happens in our webpage, generates an event.

// // Events are fired to notify code of "interesting changes" that may affect code execution. These can arise from user interactions such as using a mouse or resizing a window, changes in the state of the underlying environment (e.g. low battery or media events from the operating system), and other causes.

// // -- mouseenter event, behaves like when you hover above the element
// const h1 = document.querySelector("h1");

// // - Setting event listeners
// h1.addEventListener("mouseenter", () => {
//   console.log("mouseenter");
// });

// // The old way of attaching an event
// h1.onmouseenter = () => console.log(`old way mousenter`);

// // To remove event listener you need to export a function first

// const h1Func = (e) => {
//   console.log(">> Hello from h1Func!");

//   // h1.removeEventListener("mouseenter", h1Func);
// };

// h1.addEventListener("mouseenter", h1Func);

// // ofcourse you can remove event listener from an element anywhere in the code.
// setTimeout(() => h1.removeEventListener("mouseenter", h1Func), 3000); // removes eventListener after 3 sec

// // -- There is a way of adding element listener from HTML by adding an attribute, DON'T USE it.
// // ex: <h1 onclick="console.log('html onclick')">Hello</h1>

// //////////////////////////////////////////////////
// //// -- Event propagation: Bubbling and Capturing
// //////////////////////////////////////////////////

// // rgb(255, 255, 255)

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// console.log(randomInt(10, 20));
// // 0 -(r)-> 1,
// // 0 -{r * (20 - 10 + 1)}-> 11
// // 0 -{r * 11 + 10}-> {min -> (r * (max - min + 1))}

// const randomRgb = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomRgb);

// document
//   .querySelector('.nav__link')
//   .addEventListener('click', function (event) {
//     this.style.backgroundColor = randomRgb();
//     event.preventDefault();
//     console.log(
//       'Link: ',
//       event.target,
//       '\ncurrentTarget: ',
//       event.currentTarget
//     );

//     // event.stopPropagation(); // to will stop propagation to the rest of the elements above
//   });

// document
//   .querySelector('.nav__links')
//   .addEventListener('click', function (event) {
//     this.style.backgroundColor = randomRgb();
//     console.log(
//       'Container: ',
//       event.target,
//       '\ncurrentTarget: ',
//       event.currentTarget
//     );
//   });

// document.querySelector('.nav').addEventListener('click', function (event) {
//   this.style.backgroundColor = randomRgb();
//   console.log('nav: ', event.target, '\ncurrentTarget: ', event.currentTarget);
//   console.log(this === event.currentTarget); // true
// });

// // NOTE: To stop propagation use 'event.stopPropagation()', but it is not a good idea to do this.
// // NOTE: the 'this' keyword will be exactly the same as 'event.currentTarget'

// //////////////////////////////////////////////////
// //// --- DOM traversing
// //////////////////////////////////////////////////

// const h1 = document.querySelector("h1");
// console.log(h1);

// // -- Going downwards, selecting child element
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "orange";

// // -- Going upwards, selecting parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // closest() method traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string. Will return itself or the matching ancestor. If no such element exists, it returns null.
// console.log(h1.closest(".header"));
// h1.closest(".header").style.background = "var(--gradient-secondary)"; // using css vars
// // closest() method is basically the opposite of querySelector(), it is trying to find from the element upward in the DOM tree.
// h1.closest("h1").style.background = "var(--gradient-primary)";

// // -- Going sideways, selecting siblings
// // Note: In js you can only access direct siblings, only previous and next siblings.
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// // To select all the siblings
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach((el) => {
//  if (el !== h1) el.style.transform = "scale(0.3)"; // make them smaller
// });

///////////////////////////////////////////
// // --- Life cycle DOM Events
///////////////////////////////////////////

// console.log(`\n--- Life cycle DOM Events`);

// // ** DOMContentLoaded
// // *** Document: DOMContentLoaded event
// // The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
// // A different event, load, should be used only to detect a fully-loaded page. It is a common mistake to use load where DOMContentLoaded would be more appropriate.
// // Synchronous JavaScript pauses parsing of the DOM. If you want the DOM to get parsed as fast as possible after the user has requested the page, you can make your JavaScript asynchronous and optimize loading of stylesheets. If loaded as usual, stylesheets slow down DOM parsing as they're loaded in parallel, "stealing" traffic from the main HTML document.
// document.addEventListener("DOMContentLoaded", (e) => {
//   console.log(`Html parsed and DOM tree built!`, e);
// });

// // ** load
// // *** Window: load event
// // The load event is fired when the whole page has loaded, including all dependent resources such as stylesheets and images. This is in contrast to DOMContentLoaded, which is fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.
// window.addEventListener("load", (e) => console.log(e));

// // ** beforeunload
// // The beforeunload event is fired when the window, the document and its resources are about to be unloaded. The document is still visible and the event is still cancelable at this point.
// // This event enables a web page to trigger a confirmation dialog asking the user if they really want to leave the page. If the user confirms, the browser navigates to the new page, otherwise it cancels the navigation.
// // According to the specification, to show the confirmation dialog an event handler should call preventDefault() on the event.
// window.addEventListener("beforeunload", (e) => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "message";
// });

////////////////////////////////////////////////////
// // --- Efficient Script Loading: defer and async
///////////////////////////////////////////////////
