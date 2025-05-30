// Alpine.js custom components and utilities
import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";

// Register Alpine.js plugins
Alpine.plugin(collapse);

document.addEventListener("alpine:init", () => {
  // Counter component
  Alpine.data("counter", () => ({
    count: 0,
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  }));

  // Global store for navigation state
  Alpine.store("navigation", {
    isMenuOpen: false,
    scrollPosition: 0,

    toggle() {
      this.isMenuOpen = !this.isMenuOpen;

      if (this.isMenuOpen) {
        this.lockScroll();
      } else {
        this.unlockScroll();
      }
    },

    close() {
      this.isMenuOpen = false;
      this.unlockScroll();
    },

    lockScroll() {
      // Store current scroll position
      this.scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      // Apply scroll lock styles
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = "100%";
      document.body.style.left = "0";
    },

    unlockScroll() {
      // Remove scroll lock styles
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.left = "";

      // Restore scroll position
      window.scrollTo(0, this.scrollPosition);
    },
  });
});
