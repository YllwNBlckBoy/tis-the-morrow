document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mainNav = document.getElementById("main-nav");
  const mainNavCreations = document.getElementById("main-nav-creations");
  const mainNavCreationsCategories = document.getElementById("creations-categories");
  const creationsToggle = document.getElementById("mobile-creations-toggle");
  const creationsMenu = document.getElementById("mobile-creations-menu");

  const daySwitch = document.getElementById("day-switch");

  if (daySwitch) {
    daySwitch.addEventListener("click", () => {
      const body = document.body;
      body.classList.toggle("today-me");
      if (body.classList.contains("today-me")) {
        body.classList.remove("tomorrow-me");
      } else {
        body.classList.remove("today-me");
        body.classList.add("tomorrow-me");
      }
    });
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      console.log("hamburger clicked");
      mobileMenu.classList.toggle("hidden");
      mainNav.classList.add("hidden");
    });
  }

  if (creationsToggle && creationsMenu) {
    creationsToggle.addEventListener("click", () => {
      creationsMenu.classList.toggle("hidden");
    });
  }

  
  if (mainNav && mainNavCreations) {
    mainNavCreations.addEventListener("click", () => {
      mainNavCreationsCategories.classList.toggle("block");
      mainNavCreationsCategories.classList.toggle("hidden");

    });
  }

  // Carousel Script
  const carousel = document.getElementById('carousel');
  const images = carousel.getElementsByClassName('product-img');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const copyLink = document.getElementById('copyLink')


  let index = 0;

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % images.length;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  });

  // Copy Link Script
  copyLink.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const msg = document.getElementById('copyMsg');
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('hidden'), 2000);
    });
  });

  // Game Play
  const gamePlayButton = document.getElementById('game-play');
  const gameIframe = document.querySelector('iframe');
  gamePlayButton.addEventListener('click', () => {
    gameIframe.classList.toggle('hidden');

    // Go fullscreen if possible
    if (gameIframe.requestFullscreen) {
      gameIframe.requestFullscreen();
    } else if (gameIframe.webkitRequestFullscreen) {
      gameIframe.webkitRequestFullscreen();
    } else if (gameIframe.msRequestFullscreen) {
      gameIframe.msRequestFullscreen();
    }

    // Focus the game inside
    if (gameIframe.contentWindow) {
      gameIframe.contentWindow.focus();
    } else {
      gameIframe.focus();
    }
  });

  document.addEventListener('fullscreenchange', () => { 
    if (!document.fullscreenElement) {
      gameIframe.classList.add('hidden');
    }
  });
  
});