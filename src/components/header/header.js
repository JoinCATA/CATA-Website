// import "./header.scss"



window.addEventListener("DOMContentLoaded", () => {

	//----------------------SCROLL-----------------------
	const scrollTo = (scrollTo) => {
		let list = document.querySelector(scrollTo);
		list = '.' + list.classList[0]  + ' li a[href^="#"';

		document.querySelectorAll(list).forEach(link => {

			link.addEventListener('click', function(e) {
					e.preventDefault();
					const scrollMenu = document.querySelector(scrollTo);

					let href = this.getAttribute('href').substring(1);

					const scrollTarget = document.getElementById(href);

					if (scrollTarget) {
						const topOffset = 70;
						const elementPosition = scrollTarget.offsetTop;
						const offsetPosition = elementPosition - topOffset;

						window.scrollTo({
							top: offsetPosition,
							behavior: 'smooth'
						});
					}
					
					let button = document.querySelector('.hamburger'),
							nav = document.querySelector('.header__nav'),
							header = document.querySelector('.header');

					button.classList.remove('hamburger--active');
					nav.classList.remove('header__nav--active');
					header.classList.remove('header--menu');
			});
		});
	};
	scrollTo('.header__nav');		
//----------------------HAMBURGER-----------------------
		const hamburger = (hamburgerButton, hamburgerNav, hamburgerHeader) => {
			const button = document.querySelector(hamburgerButton),
						nav = document.querySelector(hamburgerNav),
						header = document.querySelector(hamburgerHeader);
	
			button.addEventListener('click', (e) => {
				button.classList.toggle('hamburger--active');
				nav.classList.toggle('header__nav--active');
				header.classList.toggle('header--menu');
			});
	
		};
		hamburger('.hamburger', '.header__nav', '.header');


		// ---------------- SVG LINES ANIMATION ----------------
	
		const startSvgDrawLoop = () => {
			const total = 72; 
			const elems = [];
			for (let i = 1; i <= total; i++) {
				const id = 'lElem' + i;
				const el = document.getElementById(id);
				if (el) elems.push(el);
			}

			if (elems.length === 0) return;

		
			elems.forEach(el => {
				el.style.fill = 'none';
				el.style.transition = 'none';
				const len = el.getTotalLength ? el.getTotalLength() : Math.hypot( (el.x2?.baseVal?.value - el.x1?.baseVal?.value) || 0, (el.y2?.baseVal?.value - el.y1?.baseVal?.value) || 0 );
				el.style.strokeDasharray = len + ' ' + len;
				el.style.strokeDashoffset = len;
				el.style.opacity = '0';
			});

			const drawAll = (duration = 1600) => {
				return Promise.all(elems.map(el => {
					return new Promise(resolve => {
						const len = el.getTotalLength ? el.getTotalLength() : Math.hypot( (el.x2?.baseVal?.value - el.x1?.baseVal?.value) || 0, (el.y2?.baseVal?.value - el.y1?.baseVal?.value) || 0 );
					
						const anim = el.animate([
							{ strokeDashoffset: String(len), opacity: 0 },
							{ strokeDashoffset: '0', opacity: 1 }
						], { duration: duration, easing: 'ease-in-out', fill: 'forwards' });
						anim.onfinish = () => resolve();
					});
				}));
			};

			const fadeOutAll = (duration = 1000) => {
				return Promise.all(elems.map(el => {
					return new Promise(resolve => {
						const anim = el.animate([
							{ opacity: 1 },
							{ opacity: 0 }
						], { duration: duration, easing: 'ease-out', fill: 'forwards' });
						anim.onfinish = () => resolve();
					});
				}));
			};

			const resetAll = () => {
				elems.forEach(el => {
					const len = el.getTotalLength ? el.getTotalLength() : Math.hypot( (el.x2?.baseVal?.value - el.x1?.baseVal?.value) || 0, (el.y2?.baseVal?.value - el.y1?.baseVal?.value) || 0 );
				
					el.style.transition = 'none';
					el.style.strokeDashoffset = String(len);
					el.style.opacity = '0';
				});
			};

		
			const loop = async () => {
				const drawDuration = 1600; // doubled from 800
				const holdDuration = 1400; // doubled from 700
				const fadeDuration = 1000; // doubled from 500

				await drawAll(drawDuration);
				await new Promise(r => setTimeout(r, holdDuration));
				await fadeOutAll(fadeDuration);
				await new Promise(r => setTimeout(r, 40));

				resetAll();

				setTimeout(loop, 500);
			};

			setTimeout(loop, 300);
		};

		startSvgDrawLoop();


});
