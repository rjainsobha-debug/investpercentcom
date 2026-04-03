/* ========================================================================
   investpercent.com — js/charts.js
   Shared Chart.js helpers
   Requires Chart.js to be loaded before this file
   ======================================================================== */

/* global window, Chart */

(function () {
  "use strict";

  window.ipCharts = window.ipCharts || {};

  const isLight = () =>
    document.documentElement.getAttribute("data-theme") === "light";

  const themeColor = (dark, light) => (isLight() ? light : dark);

  function getChartDefaults() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: {
          labels: {
            color: themeColor("#a8b2d8", "#334155"),
            font: {
              family: "Inter",
              size: 12,
              weight: "600"
            },
            usePointStyle: true,
            boxWidth: 10
          }
        },
        tooltip: {
          backgroundColor: themeColor("rgba(15,22,40,0.96)", "rgba(255,255,255,0.96)"),
          borderColor: themeColor("rgba(0,212,255,0.25)", "rgba(0,102,204,0.2)"),
          borderWidth: 1,
          titleColor: themeColor("#ffffff", "#0f172a"),
          bodyColor: themeColor("#cbd5e1", "#334155"),
          padding: 12,
          cornerRadius: 12
        }
      },
      scales: {
        x: {
          grid: {
            color: themeColor("rgba(255,255,255,0.05)", "rgba(15,23,42,0.06)")
          },
          ticks: {
            color: themeColor("#7c8aac", "#64748b"),
            font: {
              family: "Inter",
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: themeColor("rgba(255,255,255,0.05)", "rgba(15,23,42,0.06)")
          },
          ticks: {
            color: themeColor("#7c8aac", "#64748b"),
            font: {
              family: "Inter",
              size: 11
            }
          }
        }
      }
    };
  }

  const CHART_COLORS = {
    cyan: { fill: "rgba(0,212,255,0.75)", border: "#00d4ff" },
    purple: { fill: "rgba(123,97,255,0.75)", border: "#7b61ff" },
    green: { fill: "rgba(0,230,118,0.75)", border: "#00e676" },
    gold: { fill: "rgba(255,215,0,0.8)", border: "#ffd700" },
    orange: { fill: "rgba(255,107,53,0.8)", border: "#ff6b35" },
    red: { fill: "rgba(255,71,87,0.8)", border: "#ff4757" },
    blue: { fill: "rgba(56,189,248,0.75)", border: "#38bdf8" },
    pink: { fill: "rgba(255,79,216,0.75)", border: "#ff4fd8" }
  };

  function getCanvas(canvasId) {
    if (typeof canvasId === "string") {
      return document.getElementById(canvasId);
    }
    return canvasId;
  }

  function destroyChart(canvasId) {
    const key = typeof canvasId === "string" ? canvasId : canvasId?.id;
    if (!key) return;

    if (window.ipCharts[key]) {
      window.ipCharts[key].destroy();
      delete window.ipCharts[key];
    }
  }

  function registerChart(canvas, chart) {
    if (!canvas || !chart) return chart;
    window.ipCharts[canvas.id] = chart;
    return chart;
  }

  function mergeOptions(base, extra = {}) {
    return {
      ...base,
      ...extra,
      plugins: {
        ...(base.plugins || {}),
        ...(extra.plugins || {})
      },
      scales: {
        ...(base.scales || {}),
        ...(extra.scales || {})
      }
    };
  }

  function createStackedBar(canvasId, labels, datasets, options = {}) {
    const canvas = getCanvas(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    destroyChart(canvas);

    const config = {
      type: "bar",
      data: { labels, datasets },
      options: mergeOptions(getChartDefaults(), {
        ...options,
        scales: {
          x: {
            ...(getChartDefaults().scales.x),
            stacked: true
          },
          y: {
            ...(getChartDefaults().scales.y),
            stacked: true,
            ticks: {
              ...(getChartDefaults().scales.y.ticks),
              callback: (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`
            }
          }
        }
      })
    };

    return registerChart(canvas, new Chart(canvas, config));
  }

  function createLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = getCanvas(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    destroyChart(canvas);

    const normalized = datasets.map((dataset) => ({
      tension: 0.35,
      fill: false,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 4,
      ...dataset
    }));

    const config = {
      type: "line",
      data: { labels, datasets: normalized },
      options: mergeOptions(getChartDefaults(), options)
    };

    return registerChart(canvas, new Chart(canvas, config));
  }

  function createPieChart(canvasId, labels, data, colors = [], options = {}) {
    const canvas = getCanvas(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    destroyChart(canvas);

    const config = {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 6
          }
        ]
      },
      options: mergeOptions(
        {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: themeColor("#a8b2d8", "#334155"),
                font: { family: "Inter", size: 12, weight: "600" },
                padding: 18
              }
            },
            tooltip: getChartDefaults().plugins.tooltip
          }
        },
        options
      )
    };

    return registerChart(canvas, new Chart(canvas, config));
  }

  function createBarChart(canvasId, labels, data, color = CHART_COLORS.cyan, options = {}) {
    const canvas = getCanvas(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    destroyChart(canvas);

    const config = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: options.label || "Value",
            data,
            backgroundColor: color.fill,
            borderColor: color.border,
            borderWidth: 1.5,
            borderRadius: 10,
            borderSkipped: false,
            maxBarThickness: 48
          }
        ]
      },
      options: mergeOptions(getChartDefaults(), {
        scales: {
          y: {
            ...(getChartDefaults().scales.y),
            ticks: {
              ...(getChartDefaults().scales.y.ticks),
              callback: (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`
            }
          }
        },
        ...options
      })
    };

    return registerChart(canvas, new Chart(canvas, config));
  }

  function createHorizontalBarChart(canvasId, labels, data, color = CHART_COLORS.purple, options = {}) {
    const canvas = getCanvas(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    destroyChart(canvas);

    const config = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: options.label || "Value",
            data,
            backgroundColor: color.fill,
            borderColor: color.border,
            borderWidth: 1.5,
            borderRadius: 10,
            borderSkipped: false
          }
        ]
      },
      options: mergeOptions(getChartDefaults(), {
        indexAxis: "y",
        ...options
      })
    };

    return registerChart(canvas, new Chart(canvas, config));
  }

  function createComparisonChart(canvasId, labels, datasets, options = {}) {
    const canvas = getCanvas(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    destroyChart(canvas);

    const normalized = datasets.map((dataset) => ({
      borderRadius: 10,
      borderSkipped: false,
      borderWidth: 1,
      ...dataset
    }));

    const config = {
      type: "bar",
      data: { labels, datasets: normalized },
      options: mergeOptions(getChartDefaults(), options)
    };

    return registerChart(canvas, new Chart(canvas, config));
  }

  function refreshAllCharts() {
    Object.values(window.ipCharts).forEach((chart) => {
      if (!chart) return;
      chart.options = mergeOptions(getChartDefaults(), chart.options || {});
      chart.update();
    });
  }

  window.IPCharts = {
    CHART_COLORS,
    getChartDefaults,
    destroyChart,
    createStackedBar,
    createLineChart,
    createPieChart,
    createBarChart,
    createHorizontalBarChart,
    createComparisonChart,
    refreshAllCharts
  };
})();
