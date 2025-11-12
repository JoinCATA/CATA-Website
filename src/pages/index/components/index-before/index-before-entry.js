import './index-before.scss';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger)
gsap.set('#b1ElemL1H' , {opacity: 0})
gsap.set('#b1ElemL1' , {opacity: 0})
gsap.set('#b1ElemR1' , {x: -470,  opacity: 0, transformOrigin: "50% 50%", scale: 0.6 })

const tlBefore1 = gsap.timeline({  
	defaults: { ease: "sine.inOut" },
	paused: true 
})
	.to('#b1ElemL1', {x:  380, duration: 2, opacity: 1})
	.to('#b1ElemL1',{scale: .6, opacity: 0, transformOrigin: "50% 50%", duration: 1})
	.to('#b1ElemR1', {duration: 1, scale: 1, opacity: 1}, "<+.8")
	.to('#b1ElemL1H', {opacity: 1}, ">")


ScrollTrigger.create({
	trigger: "#before1", 
	start: "top 80%", 
	once: true, 
	onEnter: () => {
		tlBefore1.play(); 
	}
})