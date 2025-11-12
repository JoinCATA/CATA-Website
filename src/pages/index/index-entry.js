require("./../../global/js/global-entry")
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from "./../../plugins/javascript.fullPage"
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import "./index.scss"

// Скролимо на початок сторінки при завантаженні/перезавантаженні
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Скролимо на початок одразу при завантаженні скрипта
window.scrollTo(0, 0);

// require('../home/home-entry');
require('./../../global/js/global-entry');
require('./../../components/header/header.js');
require('./components/index-intro/index-intro-entry');
require('./components/index-builder/index-builder-entry');
require('./components/index-preloader/index-preloader-entry');
require('./components/index-intro/index-intro-entry');
require('./components/index-video/index-video-entry');
require('./components/index-cards/index-cards-entry');
require('./components/index-before/index-before-entry');
require('./components/index-beforeTwo/index-beforeTwo-entry');
require('./components/index-beforeThree/index-beforeThree-entry');
require('./components/index-cardsTwo/index-cardsTwo-entry');
require('./components/index-intro/index-intro-entry');
require('./components/index-tabs/index-tabs-entry');
require('./components/index-form/index-form-entry');
require('./components/index-faq/index-faq-entry');

gsap.registerPlugin(ScrollTrigger);



/**
 * outImageUrl - change image url in svg (if image save with link)
 * needContent - return content to js file
 * par - preserveAspectRatio attribute for svg
 * class - class for svg <svg class=""></svg>
 * ./img/test_svg/test.svg - path to svg in src
 */
// let svgContent = require("!!svg-anim-loader?outImageUrl=./assets/img/&needContent=false&par=''&class=''!./img/test.svg")
// console.log(svgContent);

