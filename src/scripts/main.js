// Alpine.js custom components and utilities
document.addEventListener('alpine:init', () => {
  Alpine.data('counter', () => ({
    count: 0,
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    }
  }));
});