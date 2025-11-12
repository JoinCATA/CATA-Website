import './index-beforeThree.scss';


import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger)
gsap.set('#b3ElemL1H' , {opacity: 0})
gsap.set('#b3ElemL1' , {opacity: 0})
gsap.set('#b3ElemR1' , {opacity: 0, transformOrigin: "50% 50%", scale: 0.6 })

const tlBefore1 = gsap.timeline({  
	defaults: { ease: "sine.inOut" },
	paused: true 
})
	.to('#b3ElemL1', {x:  380, duration: 2, opacity: 1})
	.to('#b3ElemL1',{scale: .6, opacity: 0, transformOrigin: "50% 50%", duration: 1})
	.to('#b3ElemR1', {duration: 1, scale: 1, opacity: 1}, "<+.8")
	.to('#b3ElemL1H', {opacity: 1}, ">")


ScrollTrigger.create({
	trigger: "#before3", 
	start: "top 80%", 
	once: true, 
	onEnter: () => {
		tlBefore1.play(); 
	}
})