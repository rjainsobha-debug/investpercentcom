/* ========================================================================
   investpercent.com — js/utils.js
   Shared helper utilities
   ======================================================================== */

/* global window, document, navigator */

(function () {
  "use strict";

  function isFiniteNumber(value) {
    return Number.isFinite(Number(value));
  }

  function toNumber(value, fallback = 0) {
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function clamp(value, min, max) {
    const num = toNumber(value, min);
    return Math.min(Math.max(num, min), max);
  }

  function roundTo(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
  }

  function formatINR(amount, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits
    }).format(toNumber(amount));
  }

  function formatCurrency(amount, currency = "INR", maximumFractionDigits = 2) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits
    }).format(toNumber(amount));
  }

  function formatNumber(num, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits
    }).format(toNumber(num));
  }

  function formatPercent(num, maximumFractionDigits = 2) {
    return `${roundTo(num, maximumFractionDigits)}%`;
  }

  function getEl(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function getEls(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function safeText(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function debounce(fn, wait = 250) {
    let timer = null;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function throttle(fn, limit = 100) {
    let inThrottle = false;
    let lastArgs = null;

    return function throttled(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
          if (lastArgs) {
            fn.apply(this, lastArgs);
            lastArgs = null;
          }
        }, limit);
      } else {
        lastArgs = args;
      }
    };
  }

  function animateCounter(element, start, end, duration = 1200, prefix = "", suffix = "") {
    if (!element) return;

    const startValue = toNumber(start);
    const endValue = toNumber(end);
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = startValue + (endValue - startValue) * eased;

      element.textContent = `${prefix}${formatNumber(current)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${prefix}${formatNumber(endValue)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  function scrollToResult(elementId, offset = 80) {
    const element = typeof elementId === "string" ? document.getElementById(elementId) : elementId;
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: "smooth"
    });
  }

  function scrollToHash(hash) {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      scrollToResult(el);
    }
  }

  function copyToClipboard(text) {
    if (!navigator.clipboard) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        showToast("Copied to clipboard!");
      } catch (error) {
        showToast("Could not copy text", "error");
      }
      document.body.removeChild(textarea);
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => showToast("Copied to clipboard!"))
      .catch(() => showToast("Could not copy text", "error"));
  }

  function showToast(message, type = "success", duration = 3000) {
    let container = document.querySelector(".ip-toast-container");

    if (!container) {
      container = document.createElement("div");
      container.className = "ip-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `ip-toast ip-toast-${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = `
      <span class="ip-toast-dot"></span>
      <span class="ip-toast-text">${safeText(message)}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  function serializeForm(form) {
    const data = {};
    if (!form) return data;

    const formData = new FormData(form);
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  function resetForm(form) {
    if (!form) return;
    form.reset();

    getEls("input[type='range']", form).forEach((range) => {
      const output = form.querySelector(`[data-range-output="${range.id}"]`);
      if (output) output.textContent = range.value;
    });
  }

  function updateRangeBubble(rangeInput) {
    if (!rangeInput) return;
    const output = document.querySelector(`[data-range-output="${rangeInput.id}"]`);
    if (!output) return;

    const suffix = rangeInput.dataset.suffix || "";
    const prefix = rangeInput.dataset.prefix || "";
    output.textContent = `${prefix}${formatNumber(rangeInput.value)}${suffix}`;
  }

  function bindRangeOutputs(scope = document) {
    getEls("input[type='range']", scope).forEach((range) => {
      updateRangeBubble(range);
      range.addEventListener("input", () => updateRangeBubble(range));
    });
  }

  function parseAmount(text) {
    if (typeof text === "number") return text;
    return toNumber(String(text).replace(/[₹,\s]/g, ""));
  }

  function monthsToYearsMonths(totalMonths) {
    const months = Math.max(0, Math.round(toNumber(totalMonths)));
    const years = Math.floor(months / 12);
    const remaining = months % 12;

    if (years === 0) return `${remaining} month${remaining === 1 ? "" : "s"}`;
    if (remaining === 0) return `${years} year${years === 1 ? "" : "s"}`;
    return `${years} year${years === 1 ? "" : "s"} ${remaining} month${remaining === 1 ? "" : "s"}`;
  }

  function numberToWords(num) {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function twoDigits(n) {
      if (n < 20) return ones[n];
      return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`.trim();
    }

    function threeDigits(n) {
      let str = "";
      if (n >= 100) {
        str += `${ones[Math.floor(n / 100)]} Hundred`;
        if (n % 100) str += " ";
      }
      str += twoDigits(n % 100);
      return str.trim();
    }

    function section(n, divisor, label) {
      if (n >= divisor) {
        const value = Math.floor(n / divisor);
        return `${convert(value)} ${label}${n % divisor ? " " : ""}`;
      }
      return "";
    }

    function convert(n) {
      n = Math.floor(Math.abs(n));
      if (n === 0) return "Zero";
      if (n < 100) return twoDigits(n);
      if (n < 1000) return threeDigits(n);

      let str = "";

      if (n >= 10000000) {
        const crore = Math.floor(n / 10000000);
        str += `${convert(crore)} Crore `;
        n %= 10000000;
      }

      if (n >= 100000) {
        const lakh = Math.floor(n / 100000);
        str += `${convert(lakh)} Lakh `;
        n %= 100000;
      }

      if (n >= 1000) {
        const thousand = Math.floor(n / 1000);
        str += `${convert(thousand)} Thousand `;
        n %= 1000;
      }

      if (n > 0) {
        str += threeDigits(n);
      }

      return str.trim();
    }

    const rounded = Math.round(toNumber(num));
    return `Rupees ${convert(rounded)} Only`;
  }

  function generateShareText({ title = "investpercent.com Result", metrics = {} } = {}) {
    const lines = [title];
    Object.entries(metrics).forEach(([label, value]) => {
      lines.push(`${label}: ${value}`);
    });
    lines.push("Calculated on investpercent.com");
    return lines.join("\n");
  }

  async function shareResult(payload) {
    const text = generateShareText(payload);

    if (navigator.share) {
      try {
        await navigator.share({
          title: payload?.title || "investpercent.com",
          text
        });
        showToast("Result shared successfully");
      } catch (error) {
        copyToClipboard(text);
      }
      return;
    }

    copyToClipboard(text);
  }

  function uid(prefix = "ip") {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function currentYear() {
    return new Date().getFullYear();
  }

  function currentDateISO() {
    return new Date().toISOString().split("T")[0];
  }

  function sum(values) {
    return values.reduce((acc, val) => acc + toNumber(val), 0);
  }

  function average(values) {
    return values.length ? sum(values) / values.length : 0;
  }

  function emitCustomEvent(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  window.IPUtils = {
    isFiniteNumber,
    toNumber,
    clamp,
    roundTo,
    formatINR,
    formatCurrency,
    formatNumber,
    formatPercent,
    getEl,
    getEls,
    safeText,
    debounce,
    throttle,
    animateCounter,
    scrollToResult,
    scrollToHash,
    copyToClipboard,
    showToast,
    serializeForm,
    resetForm,
    updateRangeBubble,
    bindRangeOutputs,
    parseAmount,
    monthsToYearsMonths,
    numberToWords,
    generateShareText,
    shareResult,
    uid,
    currentYear,
    currentDateISO,
    sum,
    average,
    emitCustomEvent
  };
})();
