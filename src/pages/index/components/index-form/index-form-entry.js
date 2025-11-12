import './index-form.scss';

const formTabs = (headerSelector, tabSelector, contentSelector, activeClass) => {
	const formHeader = document.querySelector(headerSelector),
				formTab = document.querySelectorAll(tabSelector),
				formContent = document.querySelectorAll(contentSelector);

	function hideFormTabContent() {
		formContent.forEach(item => {
			item.style.display = "none";
		});

		formTab.forEach(item => {
			item.classList.remove(activeClass);
		});
	}

	function showFormTabContent(i = 0) {
		formContent[i].style.display = "block";
		formTab[i].classList.add(activeClass);
	}

	hideFormTabContent();
	showFormTabContent();

	formHeader.addEventListener('click', (e) => {
		const target = e.target;
		if (target && 
			(target.classList.contains(tabSelector.replace(/\./, '')) || 
			target.parentNode.classList.contains(tabSelector.replace(/\./, '')))) {
			formTab.forEach((item, i) => {
				if (target == item || target.parentNode == item) {
					hideFormTabContent();
					showFormTabContent(i);
				}
			});
		}
	});
};
formTabs('.form-tabs__header', '.form-tabs__item', '.form-tabs__content', 'form-tabs--active');