const header = document.getElementById("site-header");
const headerHeight = header.getBoundingClientRect().height;

window.onscroll = function changeNav() {
  if (window.pageYOffset > headerHeight) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};

const menuToggle = document.getElementById("header-menu-toggle");
const menuHeader = document.getElementById("header-menu");

menuToggle.addEventListener("click", function() {
  if (menuHeader.classList.contains("active")) {
    menuHeader.classList.remove("active");
  } else {
    menuHeader.classList.add("active");
  }
});
/*
function scrollTo(element) {
  window.scroll({
    behavior: "smooth",
    left: 0,
    top: element.offsetTop
  });
}
*/
