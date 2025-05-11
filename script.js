'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

function openVideoPopup(element) {
  const videoSrc = element.closest('.project-item').getAttribute('data-video-src');
  const videoId = videoSrc.split('v=')[1]; // Extract the video ID from the original URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}`; // Create the embed URL
  const videoPopup = document.getElementById('videoPopup');
  const videoIframe = document.getElementById('videoIframe');

  // Set the iframe source to the embeddable video URL
  videoIframe.src = embedUrl;
  videoPopup.style.display = 'block';
}

function closeVideoPopup() {
  const videoPopup = document.getElementById('videoPopup');
  const videoIframe = document.getElementById('videoIframe');

  // Stop the video and hide the popup
  videoIframe.src = '';
  videoPopup.style.display = 'none';
}

// Tech stack carousel functionality - completely reworked
function initTechCarousel() {
  const carousel = document.getElementById('techCarousel');
  if (!carousel) return;

  // Get all original tech items
  let items = Array.from(carousel.querySelectorAll('.tech-item'));
  if (items.length === 0) return;

  // Remove all children and re-add originals for a clean start
  carousel.innerHTML = '';
  items.forEach(item => carousel.appendChild(item));

  // Calculate dimensions
  const itemWidth = items[0].offsetWidth;
  const itemGap = parseInt(window.getComputedStyle(carousel).gap) || 35;
  const itemFullWidth = itemWidth + itemGap;

  let position = 0;
  let speed = 1;
  let paused = false;
  let animationId = null;

  carousel.addEventListener('mouseenter', () => { paused = true; });
  carousel.addEventListener('mouseleave', () => { paused = false; });

  function animate() {
    if (!paused) {
      position += speed;
      carousel.style.transition = 'transform 0s linear';
      carousel.style.transform = `translateX(-${position}px)`;

      // When the first item is fully out of view, move it to the end
      if (position >= itemFullWidth) {
        // Remove first item and append to end
        const first = carousel.firstElementChild;
        carousel.appendChild(first);
        // Instantly shift carousel back by one item's width (no visible jump)
        position -= itemFullWidth;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${position}px)`;
        // Force reflow to apply the jump instantly
        carousel.offsetHeight;
        carousel.style.transition = 'transform 0s linear';
      }
    }
    animationId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

document.addEventListener('DOMContentLoaded', initTechCarousel);

// Certificate PDF Modal functionality
document.addEventListener('DOMContentLoaded', function () {
  // Attach click event to all certificate view buttons
  document.querySelectorAll('.view-certificate-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const pdfUrl = this.getAttribute('data-pdf');
      const modal = document.getElementById('certificateModal');
      const iframe = document.getElementById('certificateIframe');
      if (iframe && modal) {
        iframe.src = pdfUrl;
        modal.style.display = 'block';
      }
    });
  });

  // Close modal on close button
  const closeBtn = document.getElementById('closeCertificateModal');
  if (closeBtn) {
    closeBtn.onclick = function() {
      const modal = document.getElementById('certificateModal');
      const iframe = document.getElementById('certificateIframe');
      if (modal && iframe) {
        modal.style.display = 'none';
        iframe.src = '';
      }
    };
  }

  // Optional: Close modal when clicking outside content
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('certificateModal');
    const iframe = document.getElementById('certificateIframe');
    if (modal && event.target === modal) {
      modal.style.display = 'none';
      if (iframe) iframe.src = '';
    }
  });
});