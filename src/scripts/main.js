// Alpine.js custom components and utilities
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

    toggle() {
      this.isMenuOpen = !this.isMenuOpen;

      // Toggle body scroll lock
      if (this.isMenuOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    },
  });
});
