function debounce(fn, delay) {
  var timer;
  return function() {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(this, args); }, delay);
  };
}

function formatINR(n) {
  if (isNaN(n)) return "₹0";
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function trackEvent(category, action, label) {
  if (typeof gtag !== "undefined") {
    gtag("event", action, { event_category: category, event_label: label });
  }
}
