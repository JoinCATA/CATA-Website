import './index-preloader.scss';
import { gsap } from "gsap";

let pageLoaded = false;
let animationCompleted = false;


document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';


window.addEventListener('load', () => {
	pageLoaded = true;


	if (animationCompleted) {
		hidePreloader();
	}
});

gsap.set('#lText1B, #rText1B, #lText2B' , {opacity: 0, y: -50})
gsap.set('#lText1', {opacity: 1})
gsap.set('#lText3B', {opacity: 0, x:-150})
gsap.set('#rText1', {opacity: 0, x:200})
gsap.set('#lText2', {opacity: 0, x:-400})
gsap.set('#bText1', {opacity: 0, y:100})


function hidePreloader() {
	gsap.to('.preloader', {
		opacity: 0,
		duration: 0.5,
		onComplete: function() {
			const preloader = document.querySelector('.preloader');
			if (preloader) {
				preloader.remove();
			}
			
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
		}
	});
}

function createLoopAnimation() {
	const tlLoop = gsap.timeline({ 
		defaults: { ease: "back" },
		onComplete: function() {
			if (!pageLoaded) {
				gsap.set('#lText3B', {opacity: 0, x:-150});
				gsap.set('#rText1', {opacity: 0, x:200});
				gsap.set('#lText2', {opacity: 0, x:-400});
				gsap.set('#bText1', {opacity: 0, y:100});
				
				createLoopAnimation();
			}
		}
	});
	
	tlLoop
		.to('#lText3B', {x: 0, duration: .7, opacity: 1})
		.to('#rText1', {x: 0, duration: .7, opacity: 1})
		.to('#lText2', {x: 0, duration: .7, opacity: 1})
		.to('#bText1', {opacity: 1, y: 0})
		.to('#bText1', {scale: 1.05, transformOrigin: "50% 50%", duration: 1})
		.to('#lText3B, #rText1, #lText2, #bText1', {
			opacity: 0, 
			duration: 0.5,
			onComplete: function() {
				if (pageLoaded) {
					animationCompleted = true;
					hidePreloader();
				}
			}
		});
}

gsap.delayedCall(1, () => {
	createLoopAnimation();
});
