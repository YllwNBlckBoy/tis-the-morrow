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
});