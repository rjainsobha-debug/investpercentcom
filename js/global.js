/* ========================================================================
   investpercent.com — js/global.js
   Shared app bootstrap, components, header, search, theme, favorites, CTA
   ======================================================================== */

/* global window, document, localStorage */

(function () {
  "use strict";

  const utils = window.IPUtils;

  const TOOLS = [
    /* IP:ADD_TOOL_SEARCH — Add new tool to search index here */
    { name: "SIP Calculator", url: "/pages/investment.html#sip", keywords: ["sip", "mutual fund", "monthly investment", "systematic"] },
    { name: "Lump Sum Calculator", url: "/pages/investment.html#lumpsum", keywords: ["lumpsum", "one time investment", "returns"] },
    { name: "CAGR Calculator", url: "/pages/investment.html#cagr", keywords: ["cagr", "growth rate", "return"] },
    { name: "PPF Calculator", url: "/pages/investment.html#ppf", keywords: ["ppf", "public provident fund", "tax free"] },
    { name: "Income Tax Calculator", url: "/pages/tax.html#income-tax", keywords: ["tax", "income", "salary", "itr", "old regime", "new regime"] },
    { name: "Capital Gains Tax Calculator", url: "/pages/tax.html#capital-gains", keywords: ["capital gains", "equity", "property tax", "ltcg", "stcg"] },
    { name: "GST Calculator", url: "/pages/tax.html#gst", keywords: ["gst", "cgst", "sgst", "igst", "invoice"] },
    { name: "Home Loan EMI Calculator", url: "/pages/loans.html#home-loan", keywords: ["emi", "home loan", "property", "housing"] },
    { name: "Personal Loan EMI Calculator", url: "/pages/loans.html#personal-loan", keywords: ["personal loan", "emi", "interest"] },
    { name: "Debt Payoff Planner", url: "/pages/loans.html#debt-payoff", keywords: ["debt", "payoff", "snowball", "avalanche"] },
    { name: "Retirement Corpus Calculator", url: "/pages/retirement.html#retirement-corpus", keywords: ["retirement", "corpus", "future planning"] },
    { name: "FIRE Calculator", url: "/pages/retirement.html#fire", keywords: ["fire", "financial independence", "early retirement"] },
    { name: "Currency Converter", url: "/pages/global.html#currency", keywords: ["currency", "forex", "conversion", "usd", "inr"] },
    { name: "Remittance Cost Calculator", url: "/pages/global.html#remittance", keywords: ["remittance", "send money", "forex", "international transfer"] },
    { name: "Break-Even Calculator", url: "/pages/business.html#break-even", keywords: ["business", "break even", "profit"] },
    { name: "Profit Margin Calculator", url: "/pages/business.html#profit-margin", keywords: ["margin", "business", "profitability"] },
    { name: "Invoice Generator", url: "/pages/business.html#invoice", keywords: ["invoice", "gst invoice", "billing"] },
    { name: "Domain Value Estimator", url: "/pages/digital.html#domain-value", keywords: ["domain", "digital asset", "valuation"] },
    { name: "Online Business ROI Calculator", url: "/pages/digital.html#digital-roi", keywords: ["roi", "digital business", "ads", "revenue"] }
  ];

  const PARTNER_CTAS = {
    /* IP:ADD_PARTNER_CTA — Add new partner CTA mapping here */
    justinvesting: {
      domain: "https://justinvesting.in",
      brandColor: "#00d4ff",
      logo: "📈",
      tagline: "Mutual Funds, SIPs, Stocks & Insurance",
      ctaTexts: [
        "🚀 Ready to invest? Start your SIP on justinvesting.in →",
        "💼 Talk to an Investment Advisor →",
        "📊 Open your free investment account →",
        "🎯 Get a personalized investment plan →"
      ]
    },
    absolutemoney: {
      domain: "https://absolutemoney.in",
      brandColor: "#ffd700",
      logo: "👑",
      tagline: "Wealth Management & Legacy Planning",
      ctaTexts: [
        "👑 Plan your financial legacy with absolutemoney.in →",
        "🏆 Speak to a Wealth Manager — Book a Free Session →",
        "💎 Exclusive HNI wealth management services →",
        "🌟 Build generational wealth — Start today →"
      ]
    },
    justproperty: {
      domain: "https://justproperty.in",
      brandColor: "#ff6b35",
      logo: "🏠",
      tagline: "Real Estate & Property Investment",
      ctaTexts: [
        "🏠 Find your dream property on justproperty.in →",
        "📍 Talk to a Property Expert — Free Consultation →",
        "🔑 Compare properties. Get best deals →",
        "🏗️ New launches. Pre-launch deals. Exclusive listings →"
      ]
    },
    goglobal: {
      domain: "https://goglobal.forex",
      brandColor: "#7b61ff",
      logo: "🌍",
      tagline: "Forex, Travel Money & Global Transfers",
      ctaTexts: [
        "🌍 Get the best forex rates on goglobal.forex →",
        "✈️ Send money abroad at lowest rates →",
        "💱 Live forex rates. Zero hidden charges →",
        "🌐 NRI investment services — Start here →"
      ]
    },
    microventure: {
      domain: "https://microventure.in",
      brandColor: "#00e676",
      logo: "⚡",
      tagline: "Startups, Side Hustles & Small Business",
      ctaTexts: [
        "⚡ Turn your idea into income — microventure.in →",
        "🚀 Launch your side hustle. Start today →",
        "💡 Find startup ideas. Get mentorship →",
        "🤝 Connect with co-founders & investors →"
      ]
    },
    domaindcl: {
      domain: "https://domaindcl.in",
      brandColor: "#00d4ff",
      logo: "🔗",
      tagline: "Premium Domains & Digital Assets",
      ctaTexts: [
        "🔗 Find your perfect domain on domaindcl.in →",
        "💻 Build your digital empire — Start with a great domain →",
        "🌐 Premium domain marketplace — Buy, Sell, Invest →",
        "✨ Your brand starts with the right domain →"
      ]
    }
  };

  const CALCULATOR_PARTNER_MAP = {
    sip: "justinvesting",
    lumpsum: "justinvesting",
    cagr: "justinvesting",
    ppf: "justinvesting",
    nps: "justinvesting",
    "mutual-fund": "justinvesting",
    gold: "justinvesting",
    "step-up-sip": "justinvesting",

    "income-tax": "justinvesting",
    "capital-gains": "justinvesting",
    gst: "microventure",
    hra: "justproperty",
    "advance-tax": "justinvesting",

    "home-loan": "justproperty",
    "car-loan": "justproperty",
    "personal-loan": "justinvesting",
    "loan-vs-rent": "justproperty",
    "debt-payoff": "absolutemoney",

    fd: "justinvesting",
    rd: "justinvesting",
    ssy: "justinvesting",

    "retirement-corpus": "absolutemoney",
    fire: "absolutemoney",
    pension: "absolutemoney",
    "post-retirement": "absolutemoney",

    "net-worth": "absolutemoney",
    "financial-health": "absolutemoney",
    salary: "justinvesting",
    budget: "absolutemoney",

    currency: "goglobal",
    remittance: "goglobal",
    ppp: "goglobal",
    "global-tax": "goglobal",

    "stock-return": "justinvesting",
    "pe-ratio": "justinvesting",
    portfolio: "justinvesting",
    brokerage: "justinvesting",

    "crypto-pl": "justinvesting",
    "bitcoin-dca": "justinvesting",
    "crypto-tax": "justinvesting",

    "break-even": "microventure",
    roi: "microventure",
    "startup-valuation": "microventure",
    invoice: "microventure",
    "business-tax": "microventure",

    "term-insurance": "justinvesting",
    "health-insurance": "justinvesting",
    "education-cost": "absolutemoney",

    "domain-value": "domaindcl",
    "digital-roi": "domaindcl"
  };

  const MOBILE_NAV_ITEMS = [
    { label: "Home", href: "/index.html", icon: "🏠" },
    { label: "Invest", href: "/pages/investment.html", icon: "📈" },
    { label: "Tax", href: "/pages/tax.html", icon: "🧾" },
    { label: "Loans", href: "/pages/loans.html", icon: "🏡" },
    { label: "More", href: "#", icon: "✨" }
  ];

  function initTheme() {
    const saved = localStorage.getItem("ip-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeToggles();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ip-theme", next);
    updateThemeToggles();

    if (window.IPCharts?.refreshAllCharts) {
      window.IPCharts.refreshAllCharts();
    }
  }

  function updateThemeToggles() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    utils.getEls("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(isLight));
      btn.classList.toggle("is-light", isLight);
      btn.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
    });
  }

  async function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return;

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }

      const html = await response.text();
      container.innerHTML = html;

      if (id === "ip-header") initHeader();
      if (id === "ip-footer") initFooter();
    } catch (error) {
      console.error("Component load failed:", error);
      container.innerHTML = "";
    }
  }

  function initHeader() {
    bindThemeToggle();
    initMobileMenu();
    initSearchOverlay();
    initDropdowns();
    initHeaderScrollState();
    injectMobileBottomNav();
    wireHashLinks();
  }

  function initFooter() {
    const newsletterForm = document.querySelector("[data-newsletter-form]");
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      utils.showToast("Thanks! Newsletter UI is ready. Backend can be added later.");
      newsletterForm.reset();
    });
  }

  function bindThemeToggle() {
    utils.getEls("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  }

  function initHeaderScrollState() {
    const header = document.querySelector(".ip-site-header");
    if (!header) return;

    const onScroll = utils.throttle(() => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }, 50);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileMenu() {
    const openBtn = document.querySelector("[data-mobile-menu-open]");
    const closeBtn = document.querySelector("[data-mobile-menu-close]");
    const drawer = document.querySelector("[data-mobile-drawer]");
    const backdrop = document.querySelector("[data-mobile-backdrop]");

    if (!openBtn || !drawer || !backdrop) return;

    const openDrawer = () => {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.classList.add("ip-no-scroll");
    };

    const closeDrawer = () => {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.classList.remove("ip-no-scroll");
    };

    openBtn.addEventListener("click", openDrawer);
    closeBtn?.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    utils.getEls("a", drawer).forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer();
    });
  }

  function initSearchOverlay() {
    const openBtn = document.querySelector("[data-search-open]");
    const closeBtn = document.querySelector("[data-search-close]");
    const overlay = document.querySelector("[data-search-overlay]");
    const input = document.querySelector("[data-search-input]");
    const results = document.querySelector("[data-search-results]");

    if (!overlay || !input || !results) return;

    const openOverlay = () => {
      overlay.classList.add("is-open");
      document.body.classList.add("ip-no-scroll");
      setTimeout(() => input.focus(), 60);
      renderSearchResults("");
    };

    const closeOverlay = () => {
      overlay.classList.remove("is-open");
      document.body.classList.remove("ip-no-scroll");
      input.value = "";
      renderSearchResults("");
    };

    function renderSearchResults(query) {
      const normalized = query.trim().toLowerCase();

      const matches = TOOLS.filter((tool) => {
        if (!normalized) return true;
        if (tool.name.toLowerCase().includes(normalized)) return true;
        return tool.keywords.some((keyword) => keyword.toLowerCase().includes(normalized));
      }).slice(0, 12);

      if (!matches.length) {
        results.innerHTML = `
          <div class="ip-search-empty">
            <p>No tools found for “${utils.safeText(query)}”.</p>
          </div>
        `;
        return;
      }

      results.innerHTML = matches.map((tool) => `
        <a class="ip-search-result" href="${tool.url}">
          <span class="ip-search-result-title">${utils.safeText(tool.name)}</span>
          <span class="ip-search-result-url">${utils.safeText(tool.url)}</span>
        </a>
      `).join("");
    }

    openBtn?.addEventListener("click", openOverlay);
    closeBtn?.addEventListener("click", closeOverlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeOverlay();
    });

    input.addEventListener("input", utils.debounce((event) => {
      renderSearchResults(event.target.value);
    }, 80));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeOverlay();
    });
  }

  function initDropdowns() {
    utils.getEls("[data-nav-dropdown]").forEach((item) => {
      const trigger = item.querySelector("[data-nav-trigger]");
      const menu = item.querySelector("[data-nav-menu]");
      if (!trigger || !menu) return;

      trigger.addEventListener("mouseenter", () => item.classList.add("is-open"));
      item.addEventListener("mouseleave", () => item.classList.remove("is-open"));
      trigger.addEventListener("focus", () => item.classList.add("is-open"));
      item.addEventListener("focusout", (event) => {
        if (!item.contains(event.relatedTarget)) {
          item.classList.remove("is-open");
        }
      });
    });
  }

  function wireHashLinks() {
    utils.getEls("a[href^='#']").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        utils.scrollToHash(hash);
      });
    });
  }

  function initScrollProgress() {
    let bar = document.querySelector(".ip-scroll-progress");

    if (!bar) {
      bar = document.createElement("div");
      bar.className = "ip-scroll-progress";
      document.body.appendChild(bar);
    }

    const onScroll = utils.throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    }, 16);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  function initAnimations() {
    const animatedNodes = utils.getEls(".ip-card, .ip-category-card, .ip-section-head, .ip-fade-target");
    if (!animatedNodes.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animatedNodes.forEach((node) => observer.observe(node));
  }

  function initCounters() {
    utils.getEls("[data-counter]").forEach((counter) => {
      const end = utils.toNumber(counter.dataset.counter);
      const prefix = counter.dataset.prefix || "";
      const suffix = counter.dataset.suffix || "";

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          utils.animateCounter(counter, 0, end, 1200, prefix, suffix);
          obs.unobserve(counter);
        });
      }, { threshold: 0.6 });

      observer.observe(counter);
    });
  }

  function initRippleEffect() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".ip-btn-primary, .ip-btn-outline");
      if (!button) return;

      const ripple = document.createElement("span");
      ripple.className = "ip-ripple";

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("ip-favorites") || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem("ip-favorites", JSON.stringify(favorites));
  }

  function toggleFavorite(calcId) {
    if (!calcId) return;

    const favorites = getFavorites();
    const exists = favorites.includes(calcId);

    const next = exists
      ? favorites.filter((id) => id !== calcId)
      : [...favorites, calcId];

    saveFavorites(next);
    loadFavorites();

    utils.showToast(
      exists ? "Removed from saved tools" : "Saved to favorites",
      "success"
    );
  }

  function loadFavorites() {
    const favorites = getFavorites();

    utils.getEls("[data-favorite-id]").forEach((button) => {
      const calcId = button.dataset.favoriteId;
      const isActive = favorites.includes(calcId);
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

      const label = isActive ? "Remove from saved tools" : "Save this calculator";
      button.setAttribute("title", label);
    });
  }

  function bindFavoriteButtons() {
    utils.getEls("[data-favorite-id]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleFavorite(button.dataset.favoriteId);
      });
    });
  }

  function renderPartnerCTA(calculatorId) {
    const partnerKey = CALCULATOR_PARTNER_MAP[calculatorId];
    const partner = PARTNER_CTAS[partnerKey];

    if (!partner) return "";

    const ctaText = partner.ctaTexts[Math.floor(Math.random() * partner.ctaTexts.length)];

    return `
      <div class="partner-cta-box" style="border-color:${partner.brandColor}33;background:linear-gradient(135deg, ${partner.brandColor}14, transparent);">
        <span class="partner-logo">${partner.logo}</span>
        <div class="partner-info">
          <p class="partner-tagline">${partner.tagline}</p>
          <a href="${partner.domain}" target="_blank" rel="noopener noreferrer" class="partner-cta-btn" style="background:${partner.brandColor};color:#041018;">
            ${ctaText}
          </a>
        </div>
      </div>
    `;
  }

  function injectPartnerCTA(calculatorId, targetSelector) {
    const container = typeof targetSelector === "string"
      ? document.querySelector(targetSelector)
      : targetSelector;

    if (!container) return;
    container.innerHTML = renderPartnerCTA(calculatorId);
  }

  function injectMobileBottomNav() {
    if (document.querySelector(".ip-mobile-bottom-nav")) return;
    if (window.innerWidth > 767) return;

    const nav = document.createElement("nav");
    nav.className = "ip-mobile-bottom-nav";
    nav.setAttribute("aria-label", "Mobile quick navigation");

    nav.innerHTML = MOBILE_NAV_ITEMS.map((item) => `
      <a class="ip-mobile-bottom-link" href="${item.href}">
        <span class="ip-mobile-bottom-icon">${item.icon}</span>
        <span class="ip-mobile-bottom-label">${item.label}</span>
      </a>
    `).join("");

    document.body.appendChild(nav);
  }

  function initStickyCalculatorNav() {
    utils.getEls("[data-calc-nav-link]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        utils.scrollToResult(target, 100);
      });
    });
  }

  function syncQuickCalculatorTabs() {
    utils.getEls("[data-tab-trigger]").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.dataset.tabGroup;
        const target = button.dataset.tabTarget;
        if (!group || !target) return;

        utils.getEls(`[data-tab-trigger][data-tab-group="${group}"]`).forEach((btn) => {
          btn.classList.remove("is-active");
        });
        utils.getEls(`[data-tab-panel][data-tab-group="${group}"]`).forEach((panel) => {
          panel.classList.remove("is-active");
        });

        button.classList.add("is-active");
        const panel = document.querySelector(`[data-tab-panel="${target}"]`);
        panel?.classList.add("is-active");
      });
    });
  }

  function initParticleCanvas() {
    const canvas = document.querySelector("[data-particle-canvas]");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particleCount = 60;
    const particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        o: Math.random() * 0.6 + 0.2
      };
    }

    function init() {
      resize();
      particles.length = 0;
      for (let i = 0; i < particleCount; i += 1) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.o})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", utils.debounce(init, 150));
  }

  function initCollapsibles() {
    utils.getEls("[data-collapse-trigger]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.collapseTarget);
        if (!target) return;

        const open = target.classList.toggle("is-open");
        button.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function initPrintButtons() {
    utils.getEls("[data-print-page]").forEach((btn) => {
      btn.addEventListener("click", () => window.print());
    });
  }

  function initResetButtons() {
    utils.getEls("[data-form-reset]").forEach((button) => {
      button.addEventListener("click", () => {
        const formId = button.dataset.formReset;
        const form = document.getElementById(formId);
        if (!form) return;
        utils.resetForm(form);
      });
    });
  }

  function initShareButtons() {
    utils.getEls("[data-share-result]").forEach((button) => {
      button.addEventListener("click", async () => {
        const title = button.dataset.shareTitle || "investpercent.com Result";
        const payload = { title, metrics: {} };

        const selector = button.dataset.shareMetrics;
        if (selector) {
          utils.getEls(selector).forEach((node) => {
            const label = node.dataset.metricLabel || node.querySelector("[data-metric-label]")?.textContent || "Metric";
            const value = node.dataset.metricValue || node.querySelector("[data-metric-value]")?.textContent || node.textContent.trim();
            payload.metrics[label] = value;
          });
        }

        await utils.shareResult(payload);
      });
    });
  }

  function initTooltips() {
    utils.getEls(".ip-tooltip-wrapper").forEach((wrapper) => {
      const tooltip = wrapper.querySelector(".ip-tooltip");
      if (!tooltip) return;

      wrapper.addEventListener("mouseenter", () => tooltip.classList.add("is-visible"));
      wrapper.addEventListener("mouseleave", () => tooltip.classList.remove("is-visible"));
      wrapper.addEventListener("focusin", () => tooltip.classList.add("is-visible"));
      wrapper.addEventListener("focusout", () => tooltip.classList.remove("is-visible"));
    });
  }

  function initAccordions() {
    utils.getEls("[data-accordion-trigger]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest("[data-accordion-item]");
        if (!item) return;
        item.classList.toggle("is-open");
      });
    });
  }

  function bootSharedUI() {
    initAnimations();
    initScrollProgress();
    initCounters();
    initRippleEffect();
    initStickyCalculatorNav();
    syncQuickCalculatorTabs();
    initParticleCanvas();
    initCollapsibles();
    initPrintButtons();
    initResetButtons();
    initShareButtons();
    initTooltips();
    initAccordions();
    bindFavoriteButtons();
    loadFavorites();
    utils.bindRangeOutputs(document);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadComponent("ip-header", "/components/header.html");
    loadComponent("ip-footer", "/components/footer.html");
    bootSharedUI();

    if (window.location.hash) {
      setTimeout(() => utils.scrollToHash(window.location.hash), 250);
    }
  });

  window.IPApp = {
    TOOLS,
    PARTNER_CTAS,
    CALCULATOR_PARTNER_MAP,
    initTheme,
    toggleTheme,
    loadComponent,
    renderPartnerCTA,
    injectPartnerCTA,
    toggleFavorite,
    loadFavorites,
    bootSharedUI
  };
})();
