const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const faqButtons = document.querySelectorAll(".faq-item button");
const metricInfoButtons = document.querySelectorAll(".metric-info");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutStatus = document.querySelector("#checkout-status");
const sampleBackButton = document.querySelector("[data-sample-back]");
const sampleDatasetContainer = document.querySelector("[data-sample-dataset]");
const sampleCsvDownloadButton = document.querySelector("[data-download-csv]");

function setMenu(open) {
  if (!menuButton || !siteNav) return;

  menuButton.setAttribute("aria-expanded", String(open));
  siteNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function closeMetricTooltips(exceptButton = null) {
  metricInfoButtons.forEach((button) => {
    if (button !== exceptButton) {
      button.setAttribute("aria-expanded", "false");
    }
  });
}

metricInfoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    closeMetricTooltips(button);
    button.setAttribute("aria-expanded", String(!isOpen));
  });
});

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target?.closest(".metric-chip")) {
    closeMetricTooltips();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    closeMetricTooltips();
  }
});

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    if (answer) {
      answer.hidden = isOpen;
    }
  });
});

sampleBackButton?.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = "index.html";
});

if (checkoutForm) {
  const basePrice = 149;
  const firstExtraDevicePrice = 50;
  const extraDeviceDiscountRate = 0.05;
  const damageFee = 200;
  const deviceRange = checkoutForm.querySelector("[data-rental-device-range]");
  const deviceInput = checkoutForm.querySelector("[data-rental-device-input]");
  const deviceOutput = checkoutForm.querySelector("[data-rental-device-output]");
  const rentalTotal = document.querySelector("[data-rental-total]");
  const rentalSummary = document.querySelector("[data-rental-summary]");
  const extraDevicesPrice = checkoutForm.querySelector("[data-extra-devices-price]");
  const breakdownTotal = checkoutForm.querySelector("[data-breakdown-total]");
  const arrivalDateInput = checkoutForm.querySelector("[data-arrival-date]");
  const arrivalWindow = document.querySelector("[data-arrival-window]");
  const measurementEnd = document.querySelector("[data-measurement-end]");
  const returnDeadline = document.querySelector("[data-return-deadline]");

  const minDevices = Number(deviceInput?.min || deviceRange?.min || 1);
  const maxDevices = Number(deviceInput?.max || deviceRange?.max || 10);
  const roundMoney = (value) => Math.round(value * 100) / 100;
  const formatEuro = (value) => {
    const rounded = roundMoney(value);
    const fractionDigits = Number.isInteger(rounded) ? 0 : 2;
    return `${new Intl.NumberFormat("et-EE", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(rounded)} €`;
  };
  const formatDate = (date) => new Intl.DateTimeFormat("et-EE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
  const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  };

  const clampDevices = (value) => {
    const number = Number.parseInt(value, 10);
    if (Number.isNaN(number)) return minDevices;
    return Math.min(maxDevices, Math.max(minDevices, number));
  };

  const getDeviceCountText = (count) => `${count} ${count === 1 ? "seade" : "seadet"}`;
  const getMeasurementDeviceCountText = (count) => `${count} mõõte${count === 1 ? "seade" : "seadet"}`;

  const getExtraDevicePrice = (extraIndex) => {
    return roundMoney(firstExtraDevicePrice * Math.pow(1 - extraDeviceDiscountRate, extraIndex));
  };

  const getExtraDevicesTotal = (count) => {
    const extras = Math.max(0, count - 1);
    let total = 0;
    for (let index = 0; index < extras; index += 1) {
      total += getExtraDevicePrice(index);
    }
    return roundMoney(total);
  };

  const getOrderTotal = (count) => {
    return roundMoney(basePrice + getExtraDevicesTotal(count));
  };

  const updateDates = () => {
    if (!arrivalDateInput?.value) {
      if (arrivalWindow) arrivalWindow.textContent = "Vali soovitud kuupäev";
      if (measurementEnd) measurementEnd.textContent = "Arvutame pärast kuupäeva valikut";
      if (returnDeadline) returnDeadline.textContent = "2 päeva pärast mõõtmise lõppu";
      return;
    }

    const selectedDate = new Date(`${arrivalDateInput.value}T12:00:00`);
    const windowStart = addDays(selectedDate, -2);
    const windowEnd = addDays(selectedDate, 2);
    const endDate = addDays(selectedDate, 7);
    const deadlineDate = addDays(selectedDate, 9);

    if (arrivalWindow) {
      arrivalWindow.textContent = `${formatDate(windowStart)} - ${formatDate(windowEnd)}`;
    }
    if (measurementEnd) {
      measurementEnd.textContent = formatDate(endDate);
    }
    if (returnDeadline) {
      returnDeadline.textContent = formatDate(deadlineDate);
    }
  };

  const updateCheckout = (nextValue) => {
    const devices = clampDevices(nextValue ?? deviceInput?.value ?? deviceRange?.value);
    const extrasTotal = getExtraDevicesTotal(devices);
    const total = getOrderTotal(devices);
    const summary = `${getMeasurementDeviceCountText(devices)} 7 päevaks, analüüs ja raport.`;

    if (deviceRange) deviceRange.value = String(devices);
    if (deviceInput) deviceInput.value = String(devices);
    if (deviceOutput) deviceOutput.textContent = getDeviceCountText(devices);
    if (rentalTotal) rentalTotal.textContent = formatEuro(total);
    if (rentalSummary) rentalSummary.textContent = summary;
    if (extraDevicesPrice) extraDevicesPrice.textContent = formatEuro(extrasTotal);
    if (breakdownTotal) breakdownTotal.textContent = formatEuro(total);
  };

  const setMinArrivalDate = () => {
    if (!arrivalDateInput) return;
    const minDate = addDays(new Date(), 2).toISOString().slice(0, 10);
    arrivalDateInput.min = minDate;
  };

  deviceRange?.addEventListener("input", (event) => updateCheckout(event.target.value));
  deviceInput?.addEventListener("input", (event) => updateCheckout(event.target.value));
  deviceInput?.addEventListener("blur", (event) => updateCheckout(event.target.value));
  checkoutForm.querySelector("[data-rental-device-decrease]")?.addEventListener("click", () => {
    updateCheckout(clampDevices(deviceInput?.value) - 1);
  });
  checkoutForm.querySelector("[data-rental-device-increase]")?.addEventListener("click", () => {
    updateCheckout(clampDevices(deviceInput?.value) + 1);
  });
  arrivalDateInput?.addEventListener("change", updateDates);

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!checkoutForm.reportValidity()) {
      return;
    }

    const data = new FormData(checkoutForm);
    const devices = clampDevices(deviceInput?.value);
    const total = getOrderTotal(devices);
    const paymentMethod = data.get("paymentMethod") || "Pangalink";

    if (checkoutStatus) {
      checkoutStatus.textContent = `Rendibroneering on koostatud: ${getMeasurementDeviceCountText(devices)} 7 päevaks, ${formatEuro(total)}, makseviis ${paymentMethod}. Reaalne maksesuunamine vajab makseteenuse pakkuja ühendamist.`;
    }

    console.info("Checkout order draft", {
      devices,
      total,
      parcelProvider: data.get("parcelProvider"),
      parcelLocker: data.get("parcelLocker"),
      arrivalDate: data.get("arrivalDate"),
      paymentMethod,
      damageFeePerDevice: damageFee
    });
  });

  setMinArrivalDate();
  updateCheckout();
  updateDates();
}

const roomReportCards = document.querySelectorAll(".room-report-card");
const metricComparisonCards = document.querySelectorAll("[data-metric-comparison]");

const sampleReportData = {
  days: ["10.03 E", "11.03 T", "12.03 K", "13.03 N", "14.03 R", "15.03 L", "16.03 P"],
  rooms: {
    bedroom: {
      point: "MP1",
      name: "Magamistuba",
      metrics: {
        co2: {
          label: "CO₂ maksimum",
          shortLabel: "CO₂",
          unit: "ppm",
          color: "#f28c28",
          chartKey: "max",
          secondaryKey: "avg",
          secondaryLabel: "päevakeskmine",
          avg: [820, 910, 940, 870, 980, 760, 840],
          max: [1420, 1680, 1580, 1490, 1630, 1120, 1380],
          bandFrom: 1200,
          bandClass: "warning",
          note: "Joon näitab päeva kõrgeimat CO₂ väärtust. Katkendjoon näitab sama päeva keskmist, et eristada lühiajalist tippu pikemast kõrgest perioodist.",
          summary: "Magamistoa öine õhuvahetus vajab tähelepanu."
        },
        temp: {
          label: "Temperatuuri keskmine",
          shortLabel: "Temp",
          unit: "°C",
          color: "#5b6ee1",
          chartKey: "avg",
          rangeLowKey: "min",
          rangeHighKey: "max",
          avg: [20.4, 20.2, 20.1, 20.3, 20.5, 20.6, 20.4],
          min: [19.8, 19.6, 19.7, 19.9, 20.0, 20.1, 19.8],
          max: [21.0, 20.8, 20.7, 20.9, 21.1, 21.2, 21.0],
          note: "Joon näitab päevakeskmist. Varjutus näitab päeva madalaima ja kõrgeima temperatuuri vahemikku.",
          summary: "Magamistoa temperatuur oli nädala jooksul ühtlane."
        },
        rh: {
          label: "Õhuniiskuse keskmine",
          shortLabel: "RH",
          unit: "%",
          color: "#159a8c",
          chartKey: "avg",
          secondaryKey: "max",
          secondaryLabel: "päeva maksimum",
          avg: [46, 48, 49, 47, 50, 45, 46],
          max: [52, 55, 56, 53, 57, 50, 52],
          note: "Joon näitab päevakeskmist suhtelist õhuniiskust. Katkendjoon näitab päeva kõrgeimat näitu.",
          summary: "Õhuniiskus jäi magamistoas ootuspärasesse vahemikku."
        }
      }
    },
    living: {
      point: "MP2",
      name: "Elutuba",
      metrics: {
        co2: {
          label: "CO₂ maksimum",
          shortLabel: "CO₂",
          unit: "ppm",
          color: "#f28c28",
          chartKey: "max",
          secondaryKey: "avg",
          secondaryLabel: "päevakeskmine",
          avg: [610, 650, 670, 640, 700, 690, 630],
          max: [820, 910, 940, 900, 980, 960, 870],
          bandFrom: 1200,
          bandClass: "warning",
          note: "Elutoa CO₂ tase ei näita pikki kõrgeid perioode. Joonel on päeva maksimum, katkendjoonel päevakeskmine.",
          summary: "Elutuba on selles mõõtmises kõige stabiilsem võrdlusruum."
        },
        temp: {
          label: "Temperatuuri keskmine",
          shortLabel: "Temp",
          unit: "°C",
          color: "#5b6ee1",
          chartKey: "avg",
          rangeLowKey: "min",
          rangeHighKey: "max",
          avg: [21.3, 21.5, 21.4, 21.2, 21.6, 21.8, 21.5],
          min: [20.7, 20.8, 20.9, 20.6, 21.0, 21.1, 20.9],
          max: [22.0, 22.2, 22.1, 21.9, 22.3, 22.5, 22.1],
          note: "Elutoa temperatuur püsib kitsas vahemikus. Varjutus näitab päevade miinimumi ja maksimumi ulatust.",
          summary: "Temperatuur on elutoas mugav ja ühtlane."
        },
        rh: {
          label: "Õhuniiskuse keskmine",
          shortLabel: "RH",
          unit: "%",
          color: "#159a8c",
          chartKey: "avg",
          secondaryKey: "max",
          secondaryLabel: "päeva maksimum",
          avg: [42, 43, 44, 43, 45, 44, 42],
          max: [47, 48, 49, 48, 50, 49, 47],
          note: "Elutoa õhuniiskus on mõõdukas ega püsi pikalt kõrgel.",
          summary: "Elutuba ei näita niiskusprobleemi mustrit."
        }
      }
    },
    kitchen: {
      point: "MP3",
      name: "Köök",
      metrics: {
        pm25: {
          label: "PM2.5 maksimum",
          shortLabel: "PM2.5",
          unit: "µg/m³",
          color: "#d94b5f",
          chartKey: "max",
          secondaryKey: "avg",
          secondaryLabel: "päevakeskmine",
          avg: [6, 8, 7, 5, 9, 11, 6],
          max: [58, 74, 49, 33, 68, 52, 35],
          zeroBase: true,
          bandFrom: 25,
          bandClass: "warning",
          note: "Joon näitab päeva kõrgeimat PM2.5 näitu. Katkendjoon näitab päevakeskmist, mis jääb tippudest palju madalamaks.",
          summary: "Toiduvalmistamise lühiajalised tipud on selgelt näha."
        },
        pm10: {
          label: "PM10 maksimum",
          shortLabel: "PM10",
          unit: "µg/m³",
          color: "#a33b4c",
          chartKey: "max",
          secondaryKey: "avg",
          secondaryLabel: "päevakeskmine",
          avg: [12, 15, 14, 10, 18, 21, 12],
          max: [92, 118, 75, 54, 110, 84, 56],
          zeroBase: true,
          bandFrom: 50,
          bandClass: "warning",
          note: "PM10 käitub sarnaselt PM2.5-ga: tipud on lühiajalised ja seotud tegevustega, mitte kogu päeva kestva kõrge taustaga.",
          summary: "PM10 tipud toetavad järeldust, et allikas on köögitegevus."
        },
        co2: {
          label: "CO₂ maksimum",
          shortLabel: "CO₂",
          unit: "ppm",
          color: "#f28c28",
          chartKey: "max",
          secondaryKey: "avg",
          secondaryLabel: "päevakeskmine",
          avg: [680, 710, 720, 700, 760, 740, 690],
          max: [980, 1090, 1030, 990, 1120, 1060, 980],
          bandFrom: 1200,
          bandClass: "warning",
          note: "Köögi CO₂ maksimumid on mõõdukad ega ole selle ruumi peamine murekoht.",
          summary: "CO₂ ei viita köögis pikale õhuvahetuse puudujäägile."
        },
        temp: {
          label: "Temperatuuri keskmine",
          shortLabel: "Temp",
          unit: "°C",
          color: "#5b6ee1",
          chartKey: "avg",
          rangeLowKey: "min",
          rangeHighKey: "max",
          avg: [21.1, 21.3, 21.2, 21.0, 21.4, 21.6, 21.2],
          min: [20.3, 20.4, 20.5, 20.2, 20.6, 20.8, 20.5],
          max: [23.1, 23.8, 22.9, 23.4, 24.1, 23.6, 22.8],
          note: "Keskmine temperatuur on stabiilne, kuid miinimumi ja maksimumi vahe näitab toiduvalmistamise mõju.",
          summary: "Köögis tekivad lühikesed soojemad perioodid."
        },
        rh: {
          label: "Õhuniiskuse keskmine",
          shortLabel: "RH",
          unit: "%",
          color: "#159a8c",
          chartKey: "avg",
          secondaryKey: "max",
          secondaryLabel: "päeva maksimum",
          avg: [44, 45, 46, 44, 47, 46, 45],
          max: [55, 57, 56, 54, 59, 58, 55],
          note: "Köögi niiskus tõuseb toiduvalmistamise ajal lühiajaliselt, kuid ei jää püsivalt kõrgele.",
          summary: "Niiskuse muutus on seotud tegevustega."
        }
      }
    },
    north: {
      point: "MP4",
      name: "Põhjapoolne tuba",
      metrics: {
        rh: {
          label: "Õhuniiskuse keskmine",
          shortLabel: "RH",
          unit: "%",
          color: "#159a8c",
          chartKey: "avg",
          secondaryKey: "max",
          secondaryLabel: "päeva maksimum",
          avg: [55, 58, 59, 57, 61, 60, 56],
          max: [63, 66, 68, 64, 67, 66, 62],
          bandFrom: 60,
          bandClass: "warning",
          note: "Joon näitab päevakeskmist ja katkendjoon päeva maksimumi. Ruum liigub mitmel päeval kõrgema niiskuse poole.",
          summary: "Jahedama ruumi ja kõrgema niiskuse koosmõju tasub jälgida."
        },
        temp: {
          label: "Temperatuuri keskmine",
          shortLabel: "Temp",
          unit: "°C",
          color: "#5b6ee1",
          chartKey: "avg",
          rangeLowKey: "min",
          rangeHighKey: "max",
          avg: [19.6, 19.4, 19.3, 19.2, 19.5, 19.8, 19.6],
          min: [18.9, 18.8, 18.7, 18.6, 18.9, 19.1, 18.9],
          max: [20.3, 20.0, 20.1, 19.9, 20.2, 20.6, 20.3],
          note: "Põhjapoolne tuba on teistest ruumidest jahedam. See mõjutab ka suhtelise õhuniiskuse näitu.",
          summary: "Temperatuur püsib nädala jooksul madalam kui elutoas."
        },
        co2: {
          label: "CO₂ maksimum",
          shortLabel: "CO₂",
          unit: "ppm",
          color: "#f28c28",
          chartKey: "max",
          secondaryKey: "avg",
          secondaryLabel: "päevakeskmine",
          avg: [690, 720, 710, 700, 760, 730, 700],
          max: [940, 1020, 980, 970, 1040, 990, 940],
          bandFrom: 1200,
          bandClass: "warning",
          note: "CO₂ on siin pigem taustainfo. Pikkade kõrgete CO₂ perioodide mustrit ei teki.",
          summary: "Õhuvahetuse vaates ei ole põhjapoolne tuba kõige kriitilisem."
        }
      }
    },
    hall: {
      point: "MP5",
      name: "Esik",
      metrics: {
        temp: {
          label: "Temperatuuri keskmine",
          shortLabel: "Temp",
          unit: "°C",
          color: "#5b6ee1",
          chartKey: "avg",
          rangeLowKey: "min",
          rangeHighKey: "max",
          avg: [20.7, 20.8, 20.8, 20.6, 20.9, 21.0, 20.8],
          min: [20.1, 20.1, 20.0, 19.9, 20.2, 20.3, 20.1],
          max: [21.2, 21.3, 21.4, 21.2, 21.5, 21.6, 21.4],
          note: "Esik on kasutusel neutraalse võrdluspunktina, mis aitab hinnata ülejäänud ruumide erisusi.",
          summary: "Temperatuur on esikus ühtlane."
        },
        rh: {
          label: "Õhuniiskuse keskmine",
          shortLabel: "RH",
          unit: "%",
          color: "#159a8c",
          chartKey: "avg",
          secondaryKey: "max",
          secondaryLabel: "päeva maksimum",
          avg: [45, 46, 46, 45, 47, 48, 46],
          max: [50, 51, 52, 50, 53, 54, 51],
          note: "Esiku niiskus jääb ülejäänud kodu keskele ega näita eraldi tähelepanu vajavat mustrit.",
          summary: "Niiskusnäit toimib võrdluspunktina."
        }
      }
    }
  }
};

const metricOrder = ["co2", "pm1", "pm25", "pm10", "tvoc", "nox", "temp", "rh", "hpa"];

const sampleHomeEvents = [
  {
    dayIndex: 0,
    hour: 18.1,
    label: "Koju jõudmine: elutoa ja köögi uksed jäid lahti",
    shortLabel: "koju",
    visibleMetrics: ["co2", "tvoc"],
    effects: [
      { room: "living", metric: "co2", amount: 120, width: 1.8 },
      { room: "kitchen", metric: "co2", amount: 90, width: 1.4 },
      { room: "hall", metric: "co2", amount: 70, width: 1.2 },
      { room: "living", metric: "tvoc", amount: 35, width: 1.6 },
      { room: "kitchen", metric: "tvoc", amount: 45, width: 1.5 }
    ]
  },
  {
    dayIndex: 0,
    hour: 19.2,
    label: "Õhtusöök köögis: praadimine, kubu käivitus hilja",
    shortLabel: "praadimine",
    visibleMetrics: ["pm1", "pm25", "pm10", "tvoc", "nox", "temp", "rh"],
    effects: [
      { room: "kitchen", metric: "pm1", amount: 18, width: 0.75 },
      { room: "kitchen", metric: "pm25", amount: 30, width: 0.75 },
      { room: "kitchen", metric: "pm10", amount: 46, width: 0.8 },
      { room: "kitchen", metric: "tvoc", amount: 180, width: 1.0 },
      { room: "kitchen", metric: "nox", amount: 28, width: 1.0 },
      { room: "kitchen", metric: "temp", amount: 1.1, width: 1.2 },
      { room: "kitchen", metric: "rh", amount: 6, width: 1.6 },
      { room: "living", metric: "pm25", amount: 14, delay: 0.45, width: 1.0 },
      { room: "living", metric: "pm10", amount: 22, delay: 0.45, width: 1.1 },
      { room: "living", metric: "tvoc", amount: 75, delay: 0.55, width: 1.4 },
      { room: "hall", metric: "pm25", amount: 8, delay: 0.65, width: 1.2 },
      { room: "hall", metric: "pm10", amount: 14, delay: 0.65, width: 1.2 }
    ]
  },
  {
    dayIndex: 0,
    hour: 22.8,
    label: "Magamistoa lühike tuulutus enne magamaminekut",
    shortLabel: "tuulutus",
    visibleMetrics: ["co2", "temp", "rh", "tvoc"],
    effects: [
      { room: "bedroom", metric: "co2", amount: -260, width: 0.8 },
      { room: "bedroom", metric: "tvoc", amount: -55, width: 0.9 },
      { room: "bedroom", metric: "rh", amount: -3, width: 1.0 },
      { room: "bedroom", metric: "temp", amount: -0.5, width: 1.0 }
    ]
  },
  {
    dayIndex: 1,
    hour: 3.1,
    label: "Magamistoa uks oli öösel kinni",
    shortLabel: "uks kinni",
    visibleMetrics: ["co2"],
    effects: [
      { room: "bedroom", metric: "co2", amount: 260, width: 3.4 },
      { room: "bedroom", metric: "rh", amount: 4, width: 3.0 }
    ]
  },
  {
    dayIndex: 1,
    hour: 7.25,
    label: "Hommikune magamistoa ukse avamine ja lühike tuulutus",
    shortLabel: "hommik",
    visibleMetrics: ["co2", "rh", "temp"],
    effects: [
      { room: "bedroom", metric: "co2", amount: -420, width: 0.9 },
      { room: "hall", metric: "co2", amount: 120, delay: 0.2, width: 0.9 },
      { room: "bedroom", metric: "rh", amount: -4, width: 1.0 },
      { room: "bedroom", metric: "temp", amount: -0.4, width: 0.9 }
    ]
  },
  {
    dayIndex: 1,
    hour: 18.5,
    label: "Laps tegi elutoas trenni",
    shortLabel: "trenn",
    visibleMetrics: ["co2", "temp", "tvoc"],
    effects: [
      { room: "living", metric: "co2", amount: 230, width: 1.4 },
      { room: "living", metric: "temp", amount: 0.5, width: 1.3 },
      { room: "living", metric: "tvoc", amount: 55, width: 1.2 },
      { room: "hall", metric: "co2", amount: 70, delay: 0.4, width: 1.1 }
    ]
  },
  {
    dayIndex: 2,
    hour: 8.1,
    label: "Röstsai ja kohv köögis",
    shortLabel: "röstsai",
    visibleMetrics: ["pm25", "pm10", "tvoc"],
    effects: [
      { room: "kitchen", metric: "pm25", amount: 16, width: 0.7 },
      { room: "kitchen", metric: "pm10", amount: 24, width: 0.8 },
      { room: "kitchen", metric: "tvoc", amount: 70, width: 0.9 },
      { room: "living", metric: "pm25", amount: 6, delay: 0.45, width: 0.9 }
    ]
  },
  {
    dayIndex: 2,
    hour: 18.7,
    label: "Pesu kuivas põhjapoolses toas, uks poolenisti kinni",
    shortLabel: "pesu",
    visibleMetrics: ["rh", "temp"],
    effects: [
      { room: "north", metric: "rh", amount: 11, width: 4.8 },
      { room: "north", metric: "temp", amount: -0.35, width: 4.2 },
      { room: "hall", metric: "rh", amount: 3, delay: 1.2, width: 3.2 }
    ]
  },
  {
    dayIndex: 2,
    hour: 21.3,
    label: "Elutoas põles lõhnaküünal",
    shortLabel: "küünal",
    visibleMetrics: ["tvoc", "pm1", "pm25"],
    effects: [
      { room: "living", metric: "tvoc", amount: 170, width: 1.1 },
      { room: "living", metric: "pm1", amount: 7, width: 0.9 },
      { room: "living", metric: "pm25", amount: 10, width: 0.9 },
      { room: "hall", metric: "tvoc", amount: 55, delay: 0.45, width: 1.2 },
      { room: "bedroom", metric: "tvoc", amount: 35, delay: 0.7, width: 1.1 }
    ]
  },
  {
    dayIndex: 3,
    hour: 7.35,
    label: "Läbiv tuulutus magamistoas ja elutoas",
    shortLabel: "läbiv tuulutus",
    visibleMetrics: ["co2", "temp", "rh", "tvoc"],
    effects: [
      { room: "bedroom", metric: "co2", amount: -360, width: 0.8 },
      { room: "living", metric: "co2", amount: -220, width: 0.8 },
      { room: "hall", metric: "co2", amount: -120, width: 0.8 },
      { room: "bedroom", metric: "tvoc", amount: -60, width: 0.9 },
      { room: "living", metric: "tvoc", amount: -45, width: 0.9 },
      { room: "bedroom", metric: "temp", amount: -0.8, width: 0.9 },
      { room: "living", metric: "temp", amount: -0.6, width: 0.9 },
      { room: "bedroom", metric: "rh", amount: -3, width: 0.9 }
    ]
  },
  {
    dayIndex: 3,
    hour: 18.9,
    label: "Keetmine ja ahju kasutamine köögis",
    shortLabel: "ahi",
    visibleMetrics: ["rh", "temp", "tvoc", "pm25", "pm10"],
    effects: [
      { room: "kitchen", metric: "rh", amount: 9, width: 1.8 },
      { room: "kitchen", metric: "temp", amount: 1.5, width: 1.8 },
      { room: "kitchen", metric: "tvoc", amount: 150, width: 1.2 },
      { room: "kitchen", metric: "pm25", amount: 16, width: 0.9 },
      { room: "kitchen", metric: "pm10", amount: 22, width: 1.0 },
      { room: "living", metric: "rh", amount: 3, delay: 0.6, width: 1.6 },
      { room: "living", metric: "tvoc", amount: 60, delay: 0.6, width: 1.3 }
    ]
  },
  {
    dayIndex: 4,
    hour: 19.6,
    label: "Reede õhtusöök: praadimine ja ahjuroog",
    shortLabel: "õhtusöök",
    visibleMetrics: ["pm1", "pm25", "pm10", "tvoc", "nox", "temp"],
    effects: [
      { room: "kitchen", metric: "pm1", amount: 22, width: 0.8 },
      { room: "kitchen", metric: "pm25", amount: 38, width: 0.85 },
      { room: "kitchen", metric: "pm10", amount: 58, width: 0.9 },
      { room: "kitchen", metric: "tvoc", amount: 230, width: 1.1 },
      { room: "kitchen", metric: "nox", amount: 34, width: 1.0 },
      { room: "kitchen", metric: "temp", amount: 1.6, width: 1.5 },
      { room: "living", metric: "pm25", amount: 18, delay: 0.5, width: 1.2 },
      { room: "living", metric: "pm10", amount: 30, delay: 0.5, width: 1.2 },
      { room: "living", metric: "tvoc", amount: 95, delay: 0.6, width: 1.4 },
      { room: "hall", metric: "pm25", amount: 11, delay: 0.75, width: 1.2 }
    ]
  },
  {
    dayIndex: 4,
    hour: 23.8,
    label: "Magamistoa uks jäi ööseks kinni",
    shortLabel: "uks kinni",
    visibleMetrics: ["co2"],
    effects: [
      { room: "bedroom", metric: "co2", amount: 300, delay: 3.1, width: 3.6 },
      { room: "bedroom", metric: "rh", amount: 4, delay: 3.0, width: 3.2 }
    ]
  },
  {
    dayIndex: 5,
    hour: 10.25,
    label: "Tolmupühkimine ja kuiv koristus",
    shortLabel: "tolm",
    visibleMetrics: ["pm10", "pm25", "pm1"],
    effects: [
      { room: "living", metric: "pm10", amount: 32, width: 1.2 },
      { room: "hall", metric: "pm10", amount: 24, delay: 0.3, width: 1.2 },
      { room: "north", metric: "pm10", amount: 20, delay: 0.4, width: 1.2 },
      { room: "living", metric: "pm25", amount: 9, width: 1.0 },
      { room: "hall", metric: "pm25", amount: 7, delay: 0.3, width: 1.0 }
    ]
  },
  {
    dayIndex: 5,
    hour: 20.1,
    label: "Külalised elutoas, köögis suupisted",
    shortLabel: "külalised",
    visibleMetrics: ["co2", "tvoc", "pm25", "temp"],
    effects: [
      { room: "living", metric: "co2", amount: 420, width: 2.2 },
      { room: "living", metric: "tvoc", amount: 150, width: 2.0 },
      { room: "living", metric: "temp", amount: 0.7, width: 2.0 },
      { room: "living", metric: "pm25", amount: 12, width: 1.4 },
      { room: "kitchen", metric: "pm25", amount: 20, width: 1.1 },
      { room: "kitchen", metric: "tvoc", amount: 120, width: 1.4 },
      { room: "hall", metric: "co2", amount: 140, delay: 0.35, width: 1.7 },
      { room: "hall", metric: "tvoc", amount: 70, delay: 0.5, width: 1.6 }
    ]
  },
  {
    dayIndex: 6,
    hour: 9.65,
    label: "Pikk dušš, vannitoa uks jäi avatuks",
    shortLabel: "dušš",
    visibleMetrics: ["rh", "temp", "tvoc"],
    effects: [
      { room: "hall", metric: "rh", amount: 9, delay: 0.2, width: 2.0 },
      { room: "north", metric: "rh", amount: 4, delay: 0.9, width: 2.4 },
      { room: "living", metric: "rh", amount: 2, delay: 0.8, width: 1.8 },
      { room: "hall", metric: "temp", amount: 0.3, width: 1.2 },
      { room: "hall", metric: "tvoc", amount: 35, width: 1.3 }
    ]
  },
  {
    dayIndex: 6,
    hour: 11.5,
    label: "Koristus lõhnastatud vahendiga, kõik siseuksed lahti",
    shortLabel: "koristus",
    visibleMetrics: ["tvoc", "pm10", "pm25", "nox"],
    effects: [
      { room: "living", metric: "tvoc", amount: 240, width: 2.0 },
      { room: "hall", metric: "tvoc", amount: 210, delay: 0.25, width: 2.0 },
      { room: "bedroom", metric: "tvoc", amount: 120, delay: 0.6, width: 1.8 },
      { room: "north", metric: "tvoc", amount: 110, delay: 0.7, width: 1.8 },
      { room: "kitchen", metric: "tvoc", amount: 140, delay: 0.5, width: 1.8 },
      { room: "living", metric: "pm10", amount: 28, width: 1.2 },
      { room: "hall", metric: "pm10", amount: 24, delay: 0.3, width: 1.2 },
      { room: "living", metric: "pm25", amount: 9, width: 1.1 },
      { room: "hall", metric: "pm25", amount: 8, delay: 0.3, width: 1.1 },
      { room: "living", metric: "nox", amount: 15, width: 1.4 },
      { room: "hall", metric: "nox", amount: 12, delay: 0.4, width: 1.4 }
    ]
  },
  {
    dayIndex: 6,
    hour: 21.85,
    label: "Tuulutati ainult elutuba, magamistuba jäi suletuks",
    shortLabel: "osaline tuulutus",
    visibleMetrics: ["co2", "tvoc", "temp"],
    effects: [
      { room: "living", metric: "co2", amount: -220, width: 1.0 },
      { room: "living", metric: "tvoc", amount: -80, width: 1.0 },
      { room: "living", metric: "temp", amount: -0.5, width: 1.0 },
      { room: "bedroom", metric: "co2", amount: 280, delay: 4.5, width: 3.7 }
    ]
  }
];

const outdoorDailyContext = [
  { temp: -1.5, rh: 78, pm: 7, nox: 8, pressureOffset: -1.2, note: "jahe kuiv argipäev" },
  { temp: -0.8, rh: 74, pm: 9, nox: 10, pressureOffset: 0.4, note: "hommikune tänavaliiklus" },
  { temp: 1.2, rh: 82, pm: 11, nox: 9, pressureOffset: 1.6, note: "niiskem välisõhk" },
  { temp: 0.4, rh: 70, pm: 6, nox: 7, pressureOffset: 0.2, note: "läbiv tuulutus" },
  { temp: -1.0, rh: 76, pm: 10, nox: 11, pressureOffset: -1.4, note: "reede õhtune liiklus" },
  { temp: 2.1, rh: 80, pm: 8, nox: 7, pressureOffset: -2.2, note: "nädalavahetuse kodune päev" },
  { temp: 1.6, rh: 84, pm: 7, nox: 6, pressureOffset: -1.6, note: "niiske koristuspäev" }
];

const roomRealismProfiles = {
  bedroom: { outdoorShare: 0.32, occupancyCo2: 145, thermalLag: 0.72, moistureShare: 0.85, baselineTvoc: 0.9 },
  living: { outdoorShare: 0.55, occupancyCo2: 120, thermalLag: 0.46, moistureShare: 0.62, baselineTvoc: 1.05 },
  kitchen: { outdoorShare: 0.48, occupancyCo2: 82, thermalLag: 0.36, moistureShare: 0.78, baselineTvoc: 1.18 },
  north: { outdoorShare: 0.22, occupancyCo2: 46, thermalLag: 0.9, moistureShare: 1.15, baselineTvoc: 0.84 },
  hall: { outdoorShare: 0.38, occupancyCo2: 58, thermalLag: 0.58, moistureShare: 0.7, baselineTvoc: 0.92 }
};

const sharedMetricMeta = {
  pm1: {
    label: "PM1 maksimum",
    shortLabel: "PM1",
    unit: "µg/m³",
    color: "#bf4c7a",
    chartKey: "max",
    secondaryKey: "avg",
    secondaryLabel: "päevakeskmine",
    zeroBase: true,
    bandFrom: 15,
    bandClass: "warning",
    note: "PM1 aitab näha väga peente osakeste lühiajalisi tõuse, mis liiguvad koos köögi, küünalde või välisõhu mõjuga.",
    summary: "Väga peente osakeste muutused on sündmuste ajal nähtavad."
  },
  pm25: {
    label: "PM2.5 maksimum",
    shortLabel: "PM2.5",
    unit: "µg/m³",
    color: "#d94b5f",
    chartKey: "max",
    secondaryKey: "avg",
    secondaryLabel: "päevakeskmine",
    zeroBase: true,
    bandFrom: 25,
    bandClass: "warning",
    note: "PM2.5 näitab peenosakeste muutusi. Päevakeskmine võib olla madal ka siis, kui tegevuse ajal tekib lühike tipp.",
    summary: "Peenosakeste tipud on ajaliselt tegevustega võrreldavad."
  },
  pm10: {
    label: "PM10 maksimum",
    shortLabel: "PM10",
    unit: "µg/m³",
    color: "#a33b4c",
    chartKey: "max",
    secondaryKey: "avg",
    secondaryLabel: "päevakeskmine",
    zeroBase: true,
    bandFrom: 50,
    bandClass: "warning",
    note: "PM10 aitab eristada suuremaid sissehingatavaid osakesi, näiteks tolmu, koristuse või toiduvalmistamise mõju.",
    summary: "PM10 muutused toetavad osakeste allika tõlgendust."
  },
  tvoc: {
    label: "TVOC maksimum",
    shortLabel: "TVOC",
    unit: "ppb",
    color: "#7b61ff",
    chartKey: "max",
    secondaryKey: "avg",
    secondaryLabel: "päevakeskmine",
    zeroBase: true,
    note: "TVOC on lenduvate orgaaniliste ühendite koondnäit ja reageerib näiteks koristusele, lõhnadele või värsketele materjalidele.",
    summary: "TVOC annab konteksti lõhnade ja kemikaalsete allikate ajastusele."
  },
  nox: {
    label: "NOx-indeksi maksimum",
    shortLabel: "NOx",
    unit: "indeks",
    color: "#b86b1d",
    chartKey: "max",
    secondaryKey: "avg",
    secondaryLabel: "päevakeskmine",
    zeroBase: true,
    note: "NOx-indeks aitab märgata põlemise, välisõhu või liiklusest tuleva õhu võimalikku mõju.",
    summary: "NOx-indeks on abinäit gaasiliste muutuste võrdlemiseks."
  },
  hpa: {
    label: "Õhurõhu keskmine",
    shortLabel: "hPa",
    unit: "hPa",
    color: "#5d7896",
    chartKey: "avg",
    secondaryKey: "max",
    secondaryLabel: "päeva maksimum",
    note: "Õhurõhk kirjeldab mõõteperioodi tausttingimusi ja aitab eristada koduseid muutusi ilmastiku taustast.",
    summary: "Õhurõhk oli taustnäitajana stabiilne."
  }
};

const sharedRoomMetricData = {
  bedroom: {
    pm1: { avg: [2, 2, 3, 2, 3, 2, 2], max: [8, 9, 11, 7, 10, 6, 8] },
    pm25: { avg: [4, 5, 5, 4, 6, 4, 4], max: [18, 22, 24, 16, 26, 15, 17] },
    pm10: { avg: [8, 9, 10, 8, 11, 8, 9], max: [30, 34, 38, 28, 42, 26, 31] },
    tvoc: { avg: [92, 98, 105, 96, 112, 88, 94], max: [210, 238, 260, 225, 285, 198, 220] },
    nox: { avg: [11, 12, 13, 12, 14, 10, 11], max: [28, 30, 33, 29, 35, 24, 27] },
    hpa: { avg: [1009, 1011, 1013, 1010, 1008, 1006, 1007], max: [1011, 1013, 1015, 1012, 1010, 1008, 1009] }
  },
  living: {
    pm1: { avg: [2, 2, 2, 2, 3, 3, 2], max: [7, 8, 8, 7, 11, 12, 7] },
    pm25: { avg: [3, 4, 4, 3, 6, 7, 4], max: [14, 17, 18, 14, 28, 30, 16] },
    pm10: { avg: [7, 8, 8, 7, 12, 13, 8], max: [24, 28, 30, 23, 45, 48, 27] },
    tvoc: { avg: [88, 92, 96, 90, 118, 135, 96], max: [180, 190, 205, 188, 330, 360, 210] },
    nox: { avg: [10, 11, 11, 10, 16, 17, 11], max: [22, 25, 24, 23, 42, 46, 26] },
    hpa: { avg: [1009, 1011, 1013, 1010, 1008, 1006, 1007], max: [1011, 1013, 1015, 1012, 1010, 1008, 1009] }
  },
  kitchen: {
    pm1: { avg: [3, 4, 4, 3, 5, 6, 3], max: [32, 42, 28, 19, 38, 30, 20] },
    tvoc: { avg: [130, 145, 138, 125, 160, 170, 132], max: [420, 520, 390, 340, 560, 480, 360] },
    nox: { avg: [18, 22, 19, 17, 24, 26, 18], max: [58, 72, 55, 48, 80, 66, 50] },
    hpa: { avg: [1009, 1011, 1013, 1010, 1008, 1006, 1007], max: [1011, 1013, 1015, 1012, 1010, 1008, 1009] }
  },
  north: {
    pm1: { avg: [2, 2, 2, 2, 3, 2, 2], max: [7, 8, 9, 7, 10, 7, 8] },
    pm25: { avg: [4, 4, 5, 4, 5, 4, 4], max: [16, 18, 21, 17, 23, 16, 18] },
    pm10: { avg: [8, 9, 10, 9, 11, 8, 9], max: [27, 31, 35, 30, 38, 28, 32] },
    tvoc: { avg: [86, 92, 95, 90, 102, 88, 90], max: [175, 190, 210, 180, 230, 170, 185] },
    nox: { avg: [9, 10, 10, 9, 12, 9, 10], max: [21, 24, 25, 22, 28, 21, 23] },
    hpa: { avg: [1009, 1011, 1013, 1010, 1008, 1006, 1007], max: [1011, 1013, 1015, 1012, 1010, 1008, 1009] }
  },
  hall: {
    co2: {
      label: "CO₂ maksimum",
      shortLabel: "CO₂",
      unit: "ppm",
      color: "#f28c28",
      chartKey: "max",
      secondaryKey: "avg",
      secondaryLabel: "päevakeskmine",
      avg: [620, 650, 660, 640, 690, 680, 640],
      max: [820, 890, 900, 860, 960, 940, 870],
      bandFrom: 1200,
      bandClass: "warning",
      note: "Esiku CO₂ näitab kodu üldist õhu liikumist ja lühikesi muutusi pärast uste avamist.",
      summary: "Esik toimib kodu üldise võrdluspunktina."
    },
    pm1: { avg: [2, 2, 2, 2, 3, 3, 2], max: [8, 9, 9, 8, 13, 12, 8] },
    pm25: { avg: [3, 4, 4, 3, 6, 6, 4], max: [15, 18, 19, 15, 30, 28, 17] },
    pm10: { avg: [7, 8, 8, 7, 12, 12, 8], max: [25, 29, 31, 24, 48, 44, 28] },
    tvoc: { avg: [82, 88, 92, 85, 112, 120, 90], max: [170, 185, 200, 178, 300, 330, 195] },
    nox: { avg: [9, 10, 10, 9, 14, 15, 10], max: [20, 23, 24, 21, 38, 40, 24] },
    hpa: { avg: [1009, 1011, 1013, 1010, 1008, 1006, 1007], max: [1011, 1013, 1015, 1012, 1010, 1008, 1009] }
  }
};

Object.entries(sharedRoomMetricData).forEach(([roomKey, metrics]) => {
  const room = sampleReportData.rooms[roomKey];
  if (!room) return;

  Object.entries(metrics).forEach(([metricKey, data]) => {
    if (room.metrics[metricKey]) return;
    room.metrics[metricKey] = {
      ...(sharedMetricMeta[metricKey] || {}),
      ...data
    };
  });
});

const HOURS_PER_DAY = 24;
const READINGS_PER_HOUR = 6;
const hourlySeriesCache = new Map();

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function circularDistance(hour, target) {
  const distance = Math.abs(hour - target);
  return Math.min(distance, HOURS_PER_DAY - distance);
}

function gaussian(distance, width) {
  return Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(width, 2)));
}

function wave(seed, amplitude) {
  return Math.sin(seed * 1.73) * amplitude + Math.cos(seed * 0.47) * amplitude * 0.35;
}

function getAbsoluteHour(dayIndex, hour) {
  return dayIndex * HOURS_PER_DAY + hour;
}

function getHomeEventEffect(roomKey, metricKey, dayIndex, hour) {
  const currentHour = getAbsoluteHour(dayIndex, hour);

  return sampleHomeEvents.reduce((sum, event) => {
    const eventHour = getAbsoluteHour(event.dayIndex, event.hour);
    const eventEffects = event.effects || [];
    const matchingEffects = eventEffects.filter((effect) => effect.room === roomKey && effect.metric === metricKey);

    if (!matchingEffects.length) return sum;

    return sum + matchingEffects.reduce((effectSum, effect) => {
      const center = eventHour + (effect.delay || 0);
      const width = effect.width || 1;
      const distance = Math.abs(currentHour - center);
      return effectSum + effect.amount * gaussian(distance, width);
    }, 0);
  }, 0);
}

function getVentilationPulse(roomKey, dayIndex, hour) {
  const profile = roomRealismProfiles[roomKey] || roomRealismProfiles.hall;
  const currentHour = getAbsoluteHour(dayIndex, hour);

  return sampleHomeEvents.reduce((sum, event) => {
    if (!event.visibleMetrics?.includes("co2") && !event.visibleMetrics?.includes("temp")) return sum;

    const text = `${event.label} ${event.shortLabel}`.toLowerCase();
    if (!text.includes("tuulut")) return sum;

    const eventHour = getAbsoluteHour(event.dayIndex, event.hour);
    const distance = Math.abs(currentHour - eventHour);
    const base = gaussian(distance, 0.75);
    const roomFactor = (
      (roomKey === "bedroom" && text.includes("magamistoa")) ||
      (roomKey === "living" && text.includes("elutuba")) ||
      text.includes("läbiv")
    ) ? 1 : profile.outdoorShare * 0.45;

    return sum + base * roomFactor;
  }, 0);
}

function getOccupancyLevel(roomKey, dayIndex, hour) {
  const weekend = dayIndex >= 5;
  const morning = gaussian(circularDistance(hour, 7.5), 1.1);
  const evening = gaussian(circularDistance(hour, 20.5), weekend ? 3.2 : 2.3);
  const night = Math.max(gaussian(circularDistance(hour, 2.5), 3.2), gaussian(circularDistance(hour, 23.5), 1.7));
  const midday = gaussian(circularDistance(hour, 13.0), weekend ? 3.8 : 1.2);

  if (roomKey === "bedroom") {
    return night * 1.25 + morning * 0.35 + (weekend ? midday * 0.18 : 0);
  }

  if (roomKey === "living") {
    return evening * 0.85 + morning * 0.25 + midday * (weekend ? 0.72 : 0.12);
  }

  if (roomKey === "kitchen") {
    const breakfast = gaussian(circularDistance(hour, 8.0), 0.95);
    const dinner = gaussian(circularDistance(hour, 19.2), 1.25);
    const lunch = gaussian(circularDistance(hour, 12.7), weekend ? 1.25 : 0.7);
    return breakfast * 0.45 + dinner * 0.7 + lunch * (weekend ? 0.55 : 0.15);
  }

  if (roomKey === "north") {
    return weekend ? midday * 0.22 + evening * 0.12 : evening * 0.08;
  }

  return morning * 0.28 + evening * 0.32 + midday * (weekend ? 0.18 : 0.06);
}

function getRoutineEffect(roomKey, metricKey, dayIndex, hour) {
  const profile = roomRealismProfiles[roomKey] || roomRealismProfiles.hall;
  const occupancy = getOccupancyLevel(roomKey, dayIndex, hour);
  const weekend = dayIndex >= 5;
  const awayDip = !weekend ? gaussian(circularDistance(hour, 13), 3.8) : 0;
  const eveningSettling = gaussian(circularDistance(hour, 22), 2.8);

  if (metricKey === "co2") {
    return occupancy * profile.occupancyCo2 - awayDip * 65;
  }

  if (metricKey === "temp") {
    const heatingCycle = gaussian(circularDistance(hour, 6.5), 2.0) * 0.28 + gaussian(circularDistance(hour, 18.5), 3.0) * 0.22;
    const awaySetback = !weekend ? gaussian(circularDistance(hour, 12.5), 4.2) * -0.24 : 0;
    return (heatingCycle + occupancy * 0.16 + awaySetback) * (1 - profile.thermalLag * 0.32);
  }

  if (metricKey === "rh") {
    return occupancy * profile.moistureShare * 1.1 + eveningSettling * 0.8 - awayDip * 0.7;
  }

  if (metricKey === "tvoc") {
    return occupancy * profile.baselineTvoc * 14 + eveningSettling * 10 - awayDip * 8;
  }

  return 0;
}

function getOutdoorEffect(roomKey, metricKey, dayIndex, hour) {
  const context = outdoorDailyContext[dayIndex] || outdoorDailyContext[0];
  const profile = roomRealismProfiles[roomKey] || roomRealismProfiles.hall;
  const ventilation = getVentilationPulse(roomKey, dayIndex, hour);
  const traffic = (dayIndex < 5 ? gaussian(circularDistance(hour, 8.1), 1.1) + gaussian(circularDistance(hour, 17.4), 1.35) * 0.75 : 0.25 * gaussian(circularDistance(hour, 12.0), 2.5));
  const outdoorEntry = profile.outdoorShare * (0.18 + ventilation * 1.15);

  if (metricKey === "pm1") {
    return context.pm * outdoorEntry * (0.28 + traffic * 0.32);
  }

  if (metricKey === "pm25") {
    return context.pm * outdoorEntry * (0.55 + traffic * 0.52);
  }

  if (metricKey === "pm10") {
    return context.pm * outdoorEntry * (0.85 + traffic * 0.38);
  }

  if (metricKey === "nox") {
    return context.nox * outdoorEntry * (0.7 + traffic * 1.1);
  }

  if (metricKey === "temp") {
    const indoorTarget = roomKey === "north" ? 19.3 : roomKey === "kitchen" ? 21.0 : 20.8;
    return ventilation * (context.temp - indoorTarget) * 0.22;
  }

  if (metricKey === "rh") {
    const indoorReference = roomKey === "north" ? 55 : 45;
    return ventilation * (context.rh - indoorReference) * 0.06;
  }

  if (metricKey === "hpa") {
    const pressureWave = Math.sin(((dayIndex * HOURS_PER_DAY + hour) / (HOURS_PER_DAY * 7)) * Math.PI * 2 + 0.6) * 0.6;
    return context.pressureOffset + pressureWave;
  }

  return 0;
}

function getDataQualityFlag(roomKey, dayIndex, hour, slice) {
  const decimalHour = hour + slice / READINGS_PER_HOUR;

  if (roomKey === "kitchen" && dayIndex === 4 && decimalHour >= 11.33 && decimalHour <= 12.08) {
    return "kontrollitud andmelünk: seade oli ajutiselt ümberpaigutamisel";
  }

  if (roomKey === "hall" && dayIndex === 6 && decimalHour >= 9.5 && decimalHour <= 10.2) {
    return "tõlgendamisel arvestatud: vannitoa uks avatud";
  }

  return "ok";
}

function getVisibleMetricEvents(metricKey) {
  return sampleHomeEvents.filter((event) => event.visibleMetrics?.includes(metricKey));
}

function getEventContext(dayIndex, hour, slice) {
  const currentHour = getAbsoluteHour(dayIndex, hour + slice / READINGS_PER_HOUR);
  return sampleHomeEvents
    .filter((event) => {
      const eventHour = getAbsoluteHour(event.dayIndex, event.hour);
      return Math.abs(currentHour - eventHour) <= 0.45;
    })
    .map((event) => event.shortLabel)
    .join(", ");
}

function formatNumber(value, metric) {
  if (metric.unit === "°C") {
    return value.toFixed(1).replace(".", ",");
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
}

function formatMetricValue(value, metric) {
  if (value === undefined || value === null) return "-";
  return `${formatNumber(value, metric)} ${metric.unit}`;
}

function formatTrend(value, metric) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, metric)} ${metric.unit}`;
}

function roundReading(value, metric) {
  if (metric.unit === "°C") {
    return Number(value.toFixed(1));
  }

  if (metric.unit === "µg/m³") {
    return Math.max(0, Math.round(value));
  }

  return Math.round(value);
}

function getMetricKeys(room) {
  return metricOrder.filter((key) => room.metrics[key]);
}

function getMetricShortLabel(metricKey) {
  return {
    co2: "CO₂",
    pm1: "PM1",
    pm25: "PM2.5",
    pm10: "PM10",
    tvoc: "TVOC",
    nox: "NOx",
    temp: "Temp",
    rh: "RH",
    hpa: "hPa"
  }[metricKey] || metricKey;
}

function getMetricMeaning(metricKey) {
  return {
    co2: "süsihappegaas",
    pm1: "ultrapeenosakesed",
    pm25: "peenosakesed",
    pm10: "tolm",
    tvoc: "lendühendid",
    nox: "lämmastikoksiidid",
    temp: "temperatuur",
    rh: "õhuniiskus",
    hpa: "õhurõhk"
  }[metricKey] || "";
}

function getMetricTitle(metricKey) {
  const meaning = getMetricMeaning(metricKey);
  return meaning ? `${getMetricShortLabel(metricKey)} (${meaning})` : getMetricShortLabel(metricKey);
}

function getHourLabel(index) {
  const dayIndex = Math.floor(index / HOURS_PER_DAY);
  const hour = index % HOURS_PER_DAY;
  return `${sampleReportData.days[dayIndex]} ${String(hour).padStart(2, "0")}:00`;
}

function getMinuteLabel(dayIndex, hour, slice) {
  const minute = slice * 10;
  return `${sampleReportData.days[dayIndex]} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function buildHourlyValue(roomKey, metricKey, metric, dayIndex, hour) {
  const avg = metric.avg?.[dayIndex] ?? metric[metric.chartKey]?.[dayIndex] ?? 0;
  const max = metric.max?.[dayIndex] ?? metric.avg?.[dayIndex] ?? avg;
  const min = metric.min?.[dayIndex] ?? avg - Math.max(1, (max - avg) * 0.8);
  const seed = dayIndex * 31 + hour * 7 + metricKey.length * 13 + roomKey.length;
  const eventEffect = getHomeEventEffect(roomKey, metricKey, dayIndex, hour);
  const routineEffect = getRoutineEffect(roomKey, metricKey, dayIndex, hour);
  const outdoorEffect = getOutdoorEffect(roomKey, metricKey, dayIndex, hour);
  const contextualEffect = eventEffect + routineEffect + outdoorEffect;

  if (metricKey === "temp") {
    const dayCurve = (Math.sin(((hour - 8) / HOURS_PER_DAY) * Math.PI * 2) + 1) / 2;
    const value = min + (max - min) * dayCurve + contextualEffect + wave(seed, 0.05);
    return roundReading(clamp(value, min - 0.4, max + 2.0), metric);
  }

  if (metricKey === "rh") {
    const nightLift = Math.max(gaussian(circularDistance(hour, 5), 3.6), gaussian(circularDistance(hour, 22), 2.8) * 0.55);
    const middayDry = gaussian(circularDistance(hour, 14), 4.2);
    const value = avg + (max - avg) * nightLift - middayDry * 2.2 + contextualEffect + wave(seed, 0.45);
    return roundReading(clamp(value, Math.max(25, avg - 10), Math.max(max + 12, avg + 5)), metric);
  }

  if (metricKey === "pm1" || metricKey === "pm25" || metricKey === "pm10") {
    const eventHours = [18, 19, 18, 20, 19, 12, 10];
    const mealPeak = gaussian(circularDistance(hour, eventHours[dayIndex]), 0.9);
    const breakfast = gaussian(circularDistance(hour, 8), 0.85) * 0.22;
    const base = Math.max(1, avg * 0.55);
    const value = base + (max - base) * Math.max(mealPeak, breakfast) * 0.62 + contextualEffect + wave(seed, avg * 0.08);
    return roundReading(clamp(value, 0, max + Math.max(18, Math.abs(contextualEffect) + 8)), metric);
  }

  if (metricKey === "tvoc" || metricKey === "nox") {
    const cleaning = gaussian(circularDistance(hour, 11), 1.4) * (dayIndex === 6 ? 1 : 0.28);
    const cooking = gaussian(circularDistance(hour, 19), 1.7) * (roomKey === "kitchen" ? 1 : 0.45);
    const guests = gaussian(circularDistance(hour, 21), 2.4) * (dayIndex === 5 ? 0.75 : 0.15);
    const base = Math.max(1, avg * 0.68);
    const event = Math.max(cleaning, cooking, guests);
    const value = base + (max - base) * event * 0.62 + contextualEffect + wave(seed, avg * 0.05);
    return roundReading(clamp(value, 0, max + Math.max(35, Math.abs(contextualEffect) + 12)), metric);
  }

  if (metricKey === "hpa") {
    const slowCurve = Math.sin(((dayIndex * HOURS_PER_DAY + hour) / (HOURS_PER_DAY * 7)) * Math.PI * 2 + 0.6);
    const value = avg + slowCurve * 1.1 + outdoorEffect + wave(seed, 0.12);
    return roundReading(clamp(value, avg - 3, max + 1), metric);
  }

  const base = Math.max(420, avg - 220);
  let profile;

  if (roomKey === "bedroom") {
    profile = Math.max(
      gaussian(circularDistance(hour, 3), 2.7),
      gaussian(circularDistance(hour, 23), 1.8) * 0.48
    );
  } else if (roomKey === "kitchen") {
    profile = Math.max(
      gaussian(circularDistance(hour, 19), 1.9),
      gaussian(circularDistance(hour, 8), 1.3) * 0.35,
      gaussian(circularDistance(hour, 13), 1.4) * 0.28
    );
  } else if (roomKey === "living") {
    profile = Math.max(
      gaussian(circularDistance(hour, 20), 3.3),
      gaussian(circularDistance(hour, 12), 4.6) * 0.45
    );
  } else {
    profile = Math.max(
      gaussian(circularDistance(hour, 21), 3.0) * 0.75,
      gaussian(circularDistance(hour, 10), 4.0) * 0.35
    );
  }

  const value = base + (max - base) * profile * 0.78 + contextualEffect + wave(seed, 18);
  return roundReading(clamp(value, 390, max + Math.max(120, Math.abs(contextualEffect) + 60)), metric);
}

function getHourlySeries(roomKey, metricKey) {
  const cacheKey = `${roomKey}:${metricKey}`;
  if (hourlySeriesCache.has(cacheKey)) {
    return hourlySeriesCache.get(cacheKey);
  }

  const room = sampleReportData.rooms[roomKey];
  const metric = room?.metrics[metricKey];
  if (!metric) return [];

  const values = sampleReportData.days.flatMap((_, dayIndex) => (
    Array.from({ length: HOURS_PER_DAY }, (_, hour) => buildHourlyValue(roomKey, metricKey, metric, dayIndex, hour))
  ));

  hourlySeriesCache.set(cacheKey, values);
  return values;
}

function getFiveMinuteValue(roomKey, metricKey, dayIndex, hour, slice) {
  const room = sampleReportData.rooms[roomKey];
  const metric = room.metrics[metricKey];
  const hourly = getHourlySeries(roomKey, metricKey);
  const index = dayIndex * HOURS_PER_DAY + hour;
  const current = hourly[index];
  const next = hourly[Math.min(index + 1, hourly.length - 1)];
  const ratio = slice / READINGS_PER_HOUR;
  const interpolated = current + (next - current) * ratio;
  const amplitude = metric.unit === "°C" ? 0.04 : metric.unit === "%" ? 0.35 : metric.unit === "ppm" ? 14 : 0.9;
  return roundReading(interpolated + wave(index * 11 + slice * 3 + metricKey.length, amplitude), metric);
}

function getScale(metric, values) {
  const scaleValues = [...values];

  if (metric.bandFrom) {
    scaleValues.push(metric.bandFrom);
  }

  const min = Math.min(...scaleValues);
  const max = Math.max(...scaleValues);
  const spread = max - min || 1;
  let yMin = metric.zeroBase ? 0 : min - spread * 0.16;
  let yMax = max + spread * 0.16;

  if (metric.unit === "ppm") {
    yMin = Math.max(400, Math.floor(yMin / 100) * 100);
    yMax = Math.ceil(yMax / 100) * 100;
  } else if (metric.unit === "°C") {
    yMin = Math.floor(yMin * 2) / 2;
    yMax = Math.ceil(yMax * 2) / 2;
  } else if (metric.unit === "%") {
    yMin = Math.max(0, Math.floor(yMin / 5) * 5);
    yMax = Math.ceil(yMax / 5) * 5;
  } else {
    yMax = Math.ceil(yMax / 10) * 10;
  }

  return { yMin, yMax };
}

function buildPath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

function renderRoomSummary(card, room, metric, metricKey, values) {
  const summary = card.querySelector("[data-room-summary]");
  if (!summary) return;

  const peakIndex = values.indexOf(Math.max(...values));
  summary.innerHTML = `
    <span>${room.point} · ${getMetricShortLabel(metricKey)} · tunnivaade</span>
    <strong>${metric.summary}</strong>
    <p>Graafik kuvab kogu mõõteperioodi tunniajase sammuga. Tabelis saab sama ruumi andmeid vaadata päevakoondina, ühe päeva tunnivaates või valitud tunni 10 minuti mõõtehetkedena.</p>
    <p data-room-current>Kõrgeim tunnipunkt: ${getHourLabel(peakIndex)} · ${formatMetricValue(values[peakIndex], metric)}.</p>
  `;
}

function renderRoomStats(card, metric, values) {
  const stats = card.querySelector("[data-room-stats]");
  if (!stats) return;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = average(values);
  const trend = values[values.length - 1] - values[0];

  stats.innerHTML = [
    ["Kõrgeim tunnipunkt", formatMetricValue(max, metric)],
    ["Madalaim tunnipunkt", formatMetricValue(min, metric)],
    ["7 päeva keskmine", formatMetricValue(avg, metric)],
    ["Muutus algusest lõpuni", formatTrend(trend, metric)]
  ].map(([label, value]) => `
    <article class="room-stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
}

function renderRoomChart(card, room, roomKey, metricKey) {
  const metric = room.metrics[metricKey];
  const svg = card.querySelector(".room-chart-svg");
  const tooltip = card.querySelector(".room-chart-tooltip");
  if (!metric || !svg) return;

  const values = getHourlySeries(roomKey, metricKey);
  const width = 720;
  const height = 340;
  const left = 70;
  const right = 28;
  const top = 36;
  const bottom = 56;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const { yMin, yMax } = getScale(metric, values);
  const yScale = (value) => top + ((yMax - value) / (yMax - yMin)) * chartHeight;
  const xScale = (index) => left + (index / (values.length - 1)) * chartWidth;
  const points = values.map((value, index) => ({ x: xScale(index), y: yScale(value), value, index }));
  const tickValues = [yMax, yMin + (yMax - yMin) * 0.67, yMin + (yMax - yMin) * 0.34, yMin];
  const grid = tickValues.map((tick) => {
    const y = yScale(tick);
    return `<line class="room-chart-grid" x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}"></line>`;
  }).join("");
  const dayGrid = sampleReportData.days.slice(1).map((_, dayIndex) => {
    const x = xScale((dayIndex + 1) * HOURS_PER_DAY);
    return `<line class="room-chart-grid" x1="${x.toFixed(1)}" y1="${top}" x2="${x.toFixed(1)}" y2="${height - bottom}"></line>`;
  }).join("");
  const axisLabels = tickValues.map((tick) => `
    <text class="room-chart-label axis-y" x="${left - 12}" y="${yScale(tick) + 5}">${formatNumber(tick, metric)}</text>
  `).join("");
  const dayLabels = sampleReportData.days.map((day, dayIndex) => {
    const x = xScale(Math.min(dayIndex * HOURS_PER_DAY + 12, values.length - 1));
    return `<text class="room-chart-label axis-x" x="${x}" y="${height - 18}">${day.split(" ")[1]}</text>`;
  }).join("");
  const band = metric.bandFrom && metric.bandFrom < yMax
    ? `<rect class="room-chart-band ${metric.bandClass || ""}" x="${left}" y="${top}" width="${chartWidth}" height="${Math.max(0, yScale(metric.bandFrom) - top).toFixed(1)}"></rect>`
    : "";

  svg.style.setProperty("--metric-color", metric.color);
  svg.setAttribute("aria-label", `${room.name}: ${getMetricShortLabel(metricKey)}, tunniajane 7 päeva graafik`);
  svg.innerHTML = `
    ${band}
    ${grid}
    ${dayGrid}
    <line class="room-chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}"></line>
    <line class="room-chart-axis" x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}"></line>
    <path class="room-chart-path" d="${buildPath(points)}"></path>
    <circle class="room-chart-active-point" data-active-point cx="${points[0].x.toFixed(1)}" cy="${points[0].y.toFixed(1)}" r="0"></circle>
    ${axisLabels}
    ${dayLabels}
    <text class="room-chart-label axis-x" x="${width - right}" y="${top + 15}">${metric.unit}</text>
  `;

  renderRoomSummary(card, room, metric, metricKey, values);
  renderRoomStats(card, metric, values);

  const current = card.querySelector("[data-room-current]");
  const activePoint = svg.querySelector("[data-active-point]");

  function showPoint(index, clientX) {
    const point = points[index];

    if (activePoint) {
      activePoint.setAttribute("cx", point.x.toFixed(1));
      activePoint.setAttribute("cy", point.y.toFixed(1));
      activePoint.setAttribute("r", "7");
    }

    if (current) {
      current.textContent = `${getHourLabel(index)}: ${formatMetricValue(point.value, metric)}.`;
    }

    if (!tooltip) return;

    const rect = svg.getBoundingClientRect();
    const x = Number.isFinite(clientX) ? clientX - rect.left : (point.x / width) * rect.width;
    const y = (point.y / height) * rect.height;
    tooltip.hidden = false;
    tooltip.style.left = `${Math.min(Math.max(x - 82, 8), rect.width - 172)}px`;
    tooltip.style.top = `${Math.max(y - 74, 8)}px`;
    tooltip.innerHTML = `
      <span>${getHourLabel(index)}</span>
      <strong>${formatMetricValue(point.value, metric)}</strong>
      <span>Tunnipunkt</span>
    `;
  }

  svg.onpointermove = (event) => {
    const rect = svg.getBoundingClientRect();
    const viewX = ((event.clientX - rect.left) / rect.width) * width;
    const nearest = points.reduce((best, point) => (
      Math.abs(point.x - viewX) < Math.abs(points[best].x - viewX) ? point.index : best
    ), 0);
    showPoint(nearest, event.clientX);
  };

  svg.onpointerleave = () => {
    if (activePoint) {
      activePoint.setAttribute("r", "0");
    }
    if (tooltip) tooltip.hidden = true;
    const peakIndex = values.indexOf(Math.max(...values));
    if (current) {
      current.textContent = `Kõrgeim tunnipunkt: ${getHourLabel(peakIndex)} · ${formatMetricValue(values[peakIndex], metric)}.`;
    }
  };
}

function renderAllRoomCharts(card, room, roomKey) {
  const panel = card.querySelector(".room-chart-panel");
  if (!panel) return;

  const metricKeys = getMetricKeys(room);
  panel.classList.add("is-static");
  panel.innerHTML = `
    <div class="room-chart-list" aria-label="${room.name} kõik mõõdikute graafikud">
      ${metricKeys.map((metricKey) => {
        const metric = room.metrics[metricKey];
        return `
          <article class="room-static-chart" data-static-chart="${metricKey}">
            <div>
              <h4>${getMetricTitle(metricKey)}</h4>
              <span>${metric.label}</span>
            </div>
            <svg class="room-chart-svg" viewBox="0 0 720 340" role="img" aria-label="${room.name}: ${getMetricTitle(metricKey)}"></svg>
          </article>
        `;
      }).join("")}
    </div>
  `;

  metricKeys.forEach((metricKey) => {
    const chartCard = panel.querySelector(`[data-static-chart="${metricKey}"]`);
    if (chartCard) {
      renderRoomChart(chartCard, room, roomKey, metricKey);
    }
  });

  const stats = card.querySelector("[data-room-stats]");
  if (stats) {
    stats.innerHTML = metricKeys.slice(0, 4).map((metricKey) => {
      const metric = room.metrics[metricKey];
      const values = getHourlySeries(roomKey, metricKey);
      return `
        <article class="room-stat">
          <span>${getMetricShortLabel(metricKey)} keskmine</span>
          <strong>${formatMetricValue(average(values), metric)}</strong>
        </article>
      `;
    }).join("");
  }
}

const tableMetricGroups = [
  { label: "Õhk", keys: ["co2"] },
  { label: "Osakesed", keys: ["pm1", "pm25", "pm10"] },
  { label: "Gaasilised", keys: ["tvoc", "nox"] },
  { label: "Ruumikliima", keys: ["temp", "rh", "hpa"] }
];

function renderMetricStack(items) {
  return `<div class="metric-stack">${items.map((item) => `
    <span><b>${item.label}</b><em>${item.value}</em></span>
  `).join("")}</div>`;
}

function getDailyMetricValue(metricKey, metric, index) {
  if (metricKey === "temp" && metric.min && metric.max) {
    return `${formatMetricValue(metric.avg[index], metric)} · ${formatMetricValue(metric.min[index], metric)}-${formatMetricValue(metric.max[index], metric)}`;
  }

  if (metric.max) {
    return `${formatMetricValue(metric.avg[index], metric)} · max ${formatMetricValue(metric.max[index], metric)}`;
  }

  return formatMetricValue(metric.avg[index], metric);
}

function buildGroupedColumns(room, valueGetter) {
  return tableMetricGroups.map((group) => ({
    label: group.label,
    value: (index) => {
      const items = group.keys
        .filter((metricKey) => room.metrics[metricKey])
        .map((metricKey) => ({
          label: getMetricShortLabel(metricKey),
          value: valueGetter(metricKey, room.metrics[metricKey], index)
        }));

      return renderMetricStack(items);
    }
  }));
}

function renderDailyTable(room) {
  const columns = [
    { label: "Päev", value: (index) => sampleReportData.days[index] },
    ...buildGroupedColumns(room, (metricKey, metric, index) => getDailyMetricValue(metricKey, metric, index))
  ];
  const body = sampleReportData.days.map((_, index) => `
    <tr>${columns.map((column) => `<td>${column.value(index)}</td>`).join("")}</tr>
  `).join("");

  return {
    head: columns.map((column) => `<th>${column.label}</th>`).join(""),
    body
  };
}

function renderHourlyTable(room, roomKey, dayIndex) {
  const columns = [
    { label: "Tund", value: (hour) => `${String(hour).padStart(2, "0")}:00` },
    ...buildGroupedColumns(room, (metricKey, metric, hour) => {
      const value = getHourlySeries(roomKey, metricKey)[dayIndex * HOURS_PER_DAY + hour];
      return formatMetricValue(value, metric);
    })
  ];
  const body = Array.from({ length: HOURS_PER_DAY }, (_, hour) => `
    <tr>${columns.map((column) => `<td>${column.value(hour)}</td>`).join("")}</tr>
  `).join("");

  return {
    head: columns.map((column) => `<th>${column.label}</th>`).join(""),
    body
  };
}

function renderFiveMinuteTable(room, roomKey, dayIndex, hour) {
  const columns = [
    { label: "Aeg", value: (slice) => getMinuteLabel(dayIndex, hour, slice) },
    ...buildGroupedColumns(room, (metricKey, metric, slice) => {
      const value = getFiveMinuteValue(roomKey, metricKey, dayIndex, hour, slice);
      return formatMetricValue(value, metric);
    })
  ];
  const body = Array.from({ length: READINGS_PER_HOUR }, (_, slice) => `
    <tr>${columns.map((column) => `<td>${column.value(slice)}</td>`).join("")}</tr>
  `).join("");

  return {
    head: columns.map((column) => `<th>${column.label}</th>`).join(""),
    body
  };
}

function renderRoomTable(card, room) {
  const wrap = card.querySelector("[data-room-table]");
  if (!wrap) return;

  const table = renderDailyTable(room);

  wrap.innerHTML = `
    <div class="room-table-toolbar">
      <div>
        <strong>Andmetabel</strong>
        <span>Päevakoond: mõõdikud on mahutamiseks temaatilistesse veergudesse. Täisandmestik on eraldi CSV-vaates.</span>
      </div>
      <a class="room-table-link" href="sample-data.html">Ava CSV-vaade</a>
    </div>
    <div class="room-table-scroll">
      <table class="room-data-table">
        <thead><tr>${table.head}</tr></thead>
        <tbody>${table.body}</tbody>
      </table>
    </div>
  `;
}

const roomComparisonColors = {
  bedroom: "#f28c28",
  living: "#2d6cdf",
  kitchen: "#d94b5f",
  north: "#159a8c",
  hall: "#5d7896"
};

function getMetricRooms(metricKey) {
  return Object.entries(sampleReportData.rooms)
    .filter(([, room]) => room.metrics[metricKey]);
}

function getMetricDynamicsText(metricKey) {
  return {
    co2: "Magamistuba eristub öösel; hommikul on näha lühike järeltõus esikus.",
    pm1: "Köögi kiire tipp eelneb väiksemale muutusele elutoas ja esikus.",
    pm25: "Köögi tipp on kõige järsem, kuid elutoa ja esiku jooned liiguvad pärast seda samas suunas.",
    pm10: "Koristuse ja toiduvalmistamise ajal tekivad suuremate osakeste tipud eri ruumides erineva kujuga.",
    tvoc: "Koristuse ajal tõusevad mitu ruumi koos; köögis on lisaks eraldi toiduvalmistamise tipud.",
    nox: "Köögi ja elutoa samasuunaline liikumine aitab eristada gaasilist muutust osakeste tipust.",
    temp: "Põhjapoolne tuba püsib teistest madalamal, köögis tekivad lühikesed soojemad perioodid.",
    rh: "Põhjapoolne tuba eristub kõrgema niiskusega; esik reageerib väiksema viitega.",
    hpa: "Kõigi ruumide jooned kattuvad, seega on see pigem tausttingimus kui ruumipõhine leid."
  }[metricKey] || "Ruumide joonte kattuvus ja eristumine aitavad muutuse allikat täpsustada.";
}

function getMetricRoomNote(metricKey, roomKey) {
  const notes = {
    co2: {
      bedroom: "Öine kogunemine suletud uksega.",
      living: "Stabiilne võrdlusruum.",
      kitchen: "Mõõdukad kasutusega seotud tõusud.",
      north: "Ei eristu CO₂ põhileiuna.",
      hall: "Hommikused lühikesed järeltõusud."
    },
    pm1: {
      bedroom: "Madal taust, üksikud väikesed tipud.",
      living: "Jälgib kööki nõrgema amplituudiga.",
      kitchen: "Kiired tipud toiduvalmistamisel.",
      north: "Püsib enamasti tausttasemel.",
      hall: "Näitab muutuse liikumist ruumide vahel."
    },
    pm25: {
      bedroom: "Madal taust, üksikud lühikesed tõusud.",
      living: "Köögi järel nähtav väiksem tõus.",
      kitchen: "Peamine tippude allikas.",
      north: "Ei ole osakeste põhiallikas.",
      hall: "Vahepunkt köögi ja teiste ruumide vahel."
    },
    pm10: {
      bedroom: "Taust püsib mõõdukas.",
      living: "Koristuse ja köögi mõju on nähtav.",
      kitchen: "Suurimad lühiajalised tipud.",
      north: "Väikesed tolmuga seotud tõusud.",
      hall: "Liikumise ja koristuse mõju vahepunkt."
    },
    tvoc: {
      bedroom: "Õhtused ja öised tõusud on mõõdukad.",
      living: "Koristuse ja külaliste mõju on nähtav.",
      kitchen: "Kõrgeimad lõhna ja toiduvalmistamise tipud.",
      north: "Püsib pigem taustal.",
      hall: "Koristuse mõju liigub läbi esiku."
    },
    nox: {
      bedroom: "Madal taust.",
      living: "Mõnel õhtul liigub köögiga koos.",
      kitchen: "Kõrgeimad gaasilised muutused.",
      north: "Ei eristu põhiallikana.",
      hall: "Nõrk ülekande märk."
    },
    temp: {
      bedroom: "Ühtlane magamistemperatuur.",
      living: "Kõige stabiilsem mugavustsoon.",
      kitchen: "Lühikesed soojemad perioodid.",
      north: "Püsivalt jahedam tsoon.",
      hall: "Neutraalne võrdluspunkt."
    },
    rh: {
      bedroom: "Normaalne niiskuse vahemik.",
      living: "Stabiilne ja mõõdukas.",
      kitchen: "Lühikesed tegevusega seotud tõusud.",
      north: "Kõrgeim ja korduv niiskusjoon.",
      hall: "Väike viitega tõus põhjapoolse toa järel."
    },
    hpa: {
      bedroom: "Kattub teiste ruumidega.",
      living: "Kattub teiste ruumidega.",
      kitchen: "Kattub teiste ruumidega.",
      north: "Kattub teiste ruumidega.",
      hall: "Kattub teiste ruumidega."
    }
  };

  return notes[metricKey]?.[roomKey] || "Võrdluspunkt muutuse suuna hindamiseks.";
}

function getMetricComparisonStats(metricKey, entries) {
  return entries.map(([roomKey, room]) => {
    const metric = room.metrics[metricKey];
    const values = getHourlySeries(roomKey, metricKey);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = average(values);
    const peakIndex = values.indexOf(max);

    return {
      roomKey,
      room,
      metric,
      values,
      max,
      min,
      avg,
      peakIndex
    };
  });
}

function renderMetricComparisonChart(card, metricKey, stats, metric) {
  const svg = card.querySelector(".metric-comparison-svg");
  if (!svg || !stats.length) return;

  const width = 920;
  const height = 390;
  const left = 78;
  const right = 34;
  const top = 34;
  const bottom = 62;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const allValues = stats.flatMap((item) => item.values);
  const { yMin, yMax } = getScale(metric, allValues);
  const yScale = (value) => top + ((yMax - value) / (yMax - yMin)) * chartHeight;
  const xScale = (index) => left + (index / (stats[0].values.length - 1)) * chartWidth;
  const tickValues = [yMax, yMin + (yMax - yMin) * 0.67, yMin + (yMax - yMin) * 0.34, yMin];
  const grid = tickValues.map((tick) => `
    <line class="room-chart-grid" x1="${left}" y1="${yScale(tick).toFixed(1)}" x2="${width - right}" y2="${yScale(tick).toFixed(1)}"></line>
  `).join("");
  const dayGrid = sampleReportData.days.slice(1).map((_, dayIndex) => {
    const x = xScale((dayIndex + 1) * HOURS_PER_DAY);
    return `<line class="room-chart-grid" x1="${x.toFixed(1)}" y1="${top}" x2="${x.toFixed(1)}" y2="${height - bottom}"></line>`;
  }).join("");
  const axisLabels = tickValues.map((tick) => `
    <text class="room-chart-label axis-y" x="${left - 12}" y="${yScale(tick) + 5}">${formatNumber(tick, metric)}</text>
  `).join("");
  const dayLabels = sampleReportData.days.map((day, dayIndex) => {
    const x = xScale(Math.min(dayIndex * HOURS_PER_DAY + 12, stats[0].values.length - 1));
    return `<text class="room-chart-label axis-x" x="${x}" y="${height - 20}">${day.split(" ")[1]}</text>`;
  }).join("");
  const band = metric.bandFrom && metric.bandFrom < yMax
    ? `<rect class="room-chart-band ${metric.bandClass || ""}" x="${left}" y="${top}" width="${chartWidth}" height="${Math.max(0, yScale(metric.bandFrom) - top).toFixed(1)}"></rect>`
    : "";
  const visibleEvents = getVisibleMetricEvents(metricKey).slice(0, 7);
  const eventMarkers = visibleEvents.map((event, index) => {
    const eventIndex = getAbsoluteHour(event.dayIndex, event.hour);
    const x = xScale(Math.min(Math.max(eventIndex, 0), stats[0].values.length - 1));
    const labelY = top + 15 + (index % 2) * 18;

    return `
      <g class="metric-event-marker">
        <line x1="${x.toFixed(1)}" y1="${top}" x2="${x.toFixed(1)}" y2="${height - bottom}"></line>
        <text x="${Math.min(x + 6, width - right - 82).toFixed(1)}" y="${labelY}">${event.shortLabel}</text>
        <title>${event.label}</title>
      </g>
    `;
  }).join("");
  const lines = stats.map((item) => {
    const color = roomComparisonColors[item.roomKey] || "#0a2540";
    const points = item.values.map((value, index) => ({ x: xScale(index), y: yScale(value) }));

    return `
      <path class="metric-comparison-line" d="${buildPath(points)}" style="--room-line-color: ${color}">
        <title>${item.room.point} ${item.room.name}</title>
      </path>
    `;
  }).join("");

  svg.setAttribute("aria-label", `${getMetricTitle(metricKey)} ruumide võrdlus 7 päeva jooksul`);
  svg.innerHTML = `
    ${band}
    ${grid}
    ${dayGrid}
    ${eventMarkers}
    <line class="room-chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}"></line>
    <line class="room-chart-axis" x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}"></line>
    ${lines}
    ${axisLabels}
    ${dayLabels}
    <text class="room-chart-label axis-x" x="${width - right}" y="${top + 16}">${metric.unit}</text>
  `;
}

function renderMetricComparisonLegend(card, stats) {
  const legend = card.querySelector("[data-metric-legend]");
  if (!legend) return;

  legend.innerHTML = stats.map((item) => `
    <span style="--room-line-color: ${roomComparisonColors[item.roomKey] || "#0a2540"}">
      <i aria-hidden="true"></i>
      ${item.room.point} ${item.room.name}
    </span>
  `).join("");
}

function renderMetricComparisonSummary(card, metricKey, stats, metric) {
  const summary = card.querySelector("[data-metric-summary]");
  if (!summary || !stats.length) return;

  const peak = stats.reduce((best, item) => item.max > best.max ? item : best, stats[0]);
  const highestAvg = [...stats].sort((a, b) => b.avg - a.avg)[0];
  const lowestAvg = [...stats].sort((a, b) => a.avg - b.avg)[0];
  const spread = highestAvg.avg - lowestAvg.avg;
  const visibleEvents = getVisibleMetricEvents(metricKey)
    .slice(0, 4)
    .map((event) => event.shortLabel)
    .join(", ");

  summary.innerHTML = `
    <article>
      <span>Kõrgeim punkt</span>
      <strong>${peak.room.point} ${peak.room.name}</strong>
      <p>${getHourLabel(peak.peakIndex)} · ${formatMetricValue(peak.max, metric)}</p>
    </article>
    <article>
      <span>Keskmiste vahe</span>
      <strong>${formatTrend(spread, metric)}</strong>
      <p>${highestAvg.room.name} võrreldes madalaima keskmisega (${lowestAvg.room.name}).</p>
    </article>
    <article>
      <span>Dünaamika</span>
      <strong>Ruumide liikumine</strong>
      <p>${getMetricDynamicsText(metricKey)}</p>
    </article>
    <article>
      <span>Sündmused</span>
      <strong>${visibleEvents || "Taustmuutus"}</strong>
      <p>Graafikul märgitud sündmused pärinevad kliendi päevikust ja aitavad ajastada mõõteandmete muutusi.</p>
    </article>
  `;
}

function renderMetricComparisonTable(card, metricKey, stats, metric) {
  const wrap = card.querySelector("[data-metric-table]");
  if (!wrap) return;

  const rows = [...stats]
    .sort((a, b) => b.max - a.max)
    .map((item) => `
      <tr>
        <td><strong>${item.room.point}</strong><span>${item.room.name}</span></td>
        <td>${formatMetricValue(item.avg, metric)}</td>
        <td>${formatMetricValue(item.max, metric)}<span>${getHourLabel(item.peakIndex)}</span></td>
        <td>${getMetricRoomNote(metricKey, item.roomKey)}</td>
      </tr>
    `).join("");

  wrap.innerHTML = `
    <table class="metric-comparison-data">
      <thead>
        <tr>
          <th>Mõõtepunkt</th>
          <th>7 päeva keskmine</th>
          <th>Kõrgeim tunnipunkt</th>
          <th>Tõlgendus</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderMetricComparisonCard(card) {
  const metricKey = card.dataset.metricComparison;
  const entries = getMetricRooms(metricKey);
  const metric = entries[0]?.[1].metrics[metricKey];
  if (!metric) return;

  const stats = getMetricComparisonStats(metricKey, entries);
  renderMetricComparisonChart(card, metricKey, stats, metric);
  renderMetricComparisonLegend(card, stats);
  renderMetricComparisonSummary(card, metricKey, stats, metric);
  renderMetricComparisonTable(card, metricKey, stats, metric);
}

roomReportCards.forEach((card) => {
  const roomKey = card.dataset.room;
  const room = sampleReportData.rooms[roomKey];
  if (!room) return;

  renderAllRoomCharts(card, room, roomKey);
  renderRoomTable(card, room);
});

metricComparisonCards.forEach((card) => {
  renderMetricComparisonCard(card);
});


const datasetColumns = [
  ["point", "Mõõtepunkt"],
  ["room", "Ruum"],
  ["day", "Päev"],
  ["time", "Kell"],
  ["eventContext", "Sündmuse kontekst"],
  ["qualityFlag", "Andmekvaliteedi märkus"],
  ["co2", "CO₂ ppm"],
  ["pm1", "PM1 µg/m³"],
  ["pm25", "PM2.5 µg/m³"],
  ["pm10", "PM10 µg/m³"],
  ["tvoc", "TVOC ppb"],
  ["nox", "NOx indeks"],
  ["temp", "°C"],
  ["rh", "RH %"],
  ["hpa", "hPa"]
];

function getDatasetRows() {
  return Object.entries(sampleReportData.rooms).flatMap(([roomKey, room]) => (
    sampleReportData.days.flatMap((day, dayIndex) => (
      Array.from({ length: HOURS_PER_DAY }, (_, hour) => (
        Array.from({ length: READINGS_PER_HOUR }, (_, slice) => {
          const time = `${String(hour).padStart(2, "0")}:${String(slice * 10).padStart(2, "0")}`;
          const row = {
            point: room.point,
            room: room.name,
            day,
            time,
            eventContext: getEventContext(dayIndex, hour, slice),
            qualityFlag: getDataQualityFlag(roomKey, dayIndex, hour, slice)
          };

          metricOrder.forEach((metricKey) => {
            const metric = room.metrics[metricKey];
            row[metricKey] = metric && row.qualityFlag !== "kontrollitud andmelünk: seade oli ajutiselt ümberpaigutamisel"
              ? formatNumber(getFiveMinuteValue(roomKey, metricKey, dayIndex, hour, slice), metric)
              : "";
          });

          return row;
        })
      )).flat()
    ))
  ));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildCsv(rows) {
  const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return [
    datasetColumns.map(([, label]) => escapeCsv(label)).join(";"),
    ...rows.map((row) => datasetColumns.map(([key]) => escapeCsv(row[key] ?? "")).join(";"))
  ].join("\r\n");
}

function downloadCsv(rows) {
  const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sisekliimauuring-naidisandmestik.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function renderSampleDataset(container) {
  const rows = getDatasetRows();
  const tableRows = rows.map((row) => `
    <tr>
      ${datasetColumns.map(([key]) => `<td>${escapeHtml(row[key] ?? "")}</td>`).join("")}
    </tr>
  `).join("");

  container.innerHTML = `
    <table class="dataset-table">
      <thead>
        <tr>${datasetColumns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join("")}</tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  const datasetCount = document.querySelector("[data-dataset-count]");
  if (datasetCount) {
    datasetCount.textContent = `${rows.length.toLocaleString("et-EE")} mõõterida`;
  }

  sampleCsvDownloadButton?.addEventListener("click", () => downloadCsv(rows));
}

if (sampleDatasetContainer) {
  renderSampleDataset(sampleDatasetContainer);
}
