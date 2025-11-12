import "./index-faq.scss";

const accordions = (accordionSelector) => {
  const accordion = document.querySelectorAll(accordionSelector);

  const updatePreviousBorders = () => {
    accordion.forEach((item, index) => {
      if (index > 0) {
        const previousItem = accordion[index - 1];
        previousItem.style.borderBottom = "1px solid #F9785F";
      }

      if (item.classList.contains("accordion--active") && index > 0) {
        const previousItem = accordion[index - 1];
        previousItem.style.borderBottom = "1px solid transparent";
      }
    });
  };

  accordion.forEach((item) => {
    const accordionClick = item.querySelector(".accordion__header"),
      accordionContent = item.querySelector(".accordion__content");

    accordionClick.addEventListener("click", (e) => {
      if (!item.classList.contains("accordion--active")) {
        accordion.forEach((otherItem) => {
          if (
            otherItem !== item &&
            otherItem.classList.contains("accordion--active")
          ) {
            const otherContent = otherItem.querySelector(".accordion__content");
            otherContent.style.height = "0px";
            otherItem.classList.remove("accordion--active");
          }
        });

        item.classList.add("accordion--active");
        accordionContent.style.height = "auto";
        var height = accordionContent.clientHeight + "px";
        accordionContent.style.height = "0px";

        setTimeout(() => {
          accordionContent.style.height = height;
        }, 0);
      } else {
        accordionContent.style.height = "0px";
        item.classList.remove("accordion--active");
      }

      setTimeout(() => {
        updatePreviousBorders();
      }, 50);
    });
  });

  updatePreviousBorders();
};
accordions(".accordion");
