const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const faqButtons = document.querySelectorAll(".faq-item button");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
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

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const data = new FormData(contactForm);
  const subject = "Ruumikliima.ee päring: 7-päevane sisekliima uuring";
  const lines = [
    "Tere",
    "",
    "Soovin küsida 7-päevast sisekliima uuringut.",
    "",
    `Nimi: ${data.get("name") || ""}`,
    `E-post: ${data.get("email") || ""}`,
    `Telefon: ${data.get("phone") || ""}`,
    `Linn / piirkond: ${data.get("area") || ""}`,
    `Kodu tüüp: ${data.get("homeType") || ""}`,
    `Ligikaudne pindala: ${data.get("size") || ""}`,
    `Ruumide arv: ${data.get("rooms") || ""}`,
    `Lisamõõtepunktid: ${data.get("extras") || ""}`,
    "",
    "Peamine mure:",
    `${data.get("concern") || ""}`,
    "",
    "Mõistan, et tegemist on ülevaatliku uuringuga, mitte ametliku mõõtmise, sertifikaadi ega ekspertiisiga."
  ];

  const mailto = `mailto:info@ruumikliima.ee?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

  if (formStatus) {
    formStatus.textContent = "Avan e-kirja mustandi. Kui meiliprogramm ei avane, kirjuta otse: info@ruumikliima.ee";
  }

  window.location.href = mailto;
});

const roomReportCards = document.querySelectorAll(".room-report-card");

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

const HOURS_PER_DAY = 24;
const READINGS_PER_HOUR = 12;
const metricOrder = ["co2", "temp", "rh", "pm25", "pm10"];
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
    temp: "Temp",
    rh: "RH",
    pm25: "PM2.5",
    pm10: "PM10"
  }[metricKey] || metricKey;
}

function getHourLabel(index) {
  const dayIndex = Math.floor(index / HOURS_PER_DAY);
  const hour = index % HOURS_PER_DAY;
  return `${sampleReportData.days[dayIndex]} ${String(hour).padStart(2, "0")}:00`;
}

function getMinuteLabel(dayIndex, hour, slice) {
  const minute = slice * 5;
  return `${sampleReportData.days[dayIndex]} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function buildHourlyValue(roomKey, metricKey, metric, dayIndex, hour) {
  const avg = metric.avg?.[dayIndex] ?? metric[metric.chartKey]?.[dayIndex] ?? 0;
  const max = metric.max?.[dayIndex] ?? metric.avg?.[dayIndex] ?? avg;
  const min = metric.min?.[dayIndex] ?? avg - Math.max(1, (max - avg) * 0.8);
  const seed = dayIndex * 31 + hour * 7 + metricKey.length * 13 + roomKey.length;

  if (metricKey === "temp") {
    const dayCurve = (Math.sin(((hour - 8) / HOURS_PER_DAY) * Math.PI * 2) + 1) / 2;
    const value = min + (max - min) * dayCurve + wave(seed, 0.05);
    return roundReading(clamp(value, min - 0.2, max + 0.2), metric);
  }

  if (metricKey === "rh") {
    const nightLift = Math.max(gaussian(circularDistance(hour, 5), 3.6), gaussian(circularDistance(hour, 22), 2.8) * 0.55);
    const middayDry = gaussian(circularDistance(hour, 14), 4.2);
    const value = avg + (max - avg) * nightLift - middayDry * 2.2 + wave(seed, 0.45);
    return roundReading(clamp(value, Math.max(25, avg - 8), Math.max(max + 1, avg + 2)), metric);
  }

  if (metricKey === "pm25" || metricKey === "pm10") {
    const eventHours = [18, 19, 18, 20, 19, 12, 10];
    const mealPeak = gaussian(circularDistance(hour, eventHours[dayIndex]), 0.9);
    const breakfast = gaussian(circularDistance(hour, 8), 0.85) * 0.22;
    const base = Math.max(1, avg * 0.55);
    const value = base + (max - base) * Math.max(mealPeak, breakfast) + wave(seed, avg * 0.08);
    return roundReading(clamp(value, 0, max + Math.max(2, avg * 0.3)), metric);
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

  const value = base + (max - base) * profile + wave(seed, 18);
  return roundReading(clamp(value, 400, max + 35), metric);
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
    <p>Graafik kuvab kogu mõõteperioodi tunniajase sammuga. Tabelis saab sama ruumi andmeid vaadata päevakoondina, ühe päeva tunnivaates või valitud tunni 5 minuti mõõtehetkedena.</p>
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

function renderDailyTable(room) {
  const metrics = room.metrics;
  const has = (key) => Boolean(metrics[key]);
  const columns = [{ label: "Päev", value: (_, index) => sampleReportData.days[index] }];

  if (has("co2")) {
    columns.push(
      { label: "CO₂ keskm.", value: (_, index) => formatMetricValue(metrics.co2.avg[index], metrics.co2) },
      { label: "CO₂ max", value: (_, index) => formatMetricValue(metrics.co2.max[index], metrics.co2) }
    );
  }

  if (has("temp")) {
    columns.push(
      { label: "Temp keskm.", value: (_, index) => formatMetricValue(metrics.temp.avg[index], metrics.temp) },
      { label: "Temp vahemik", value: (_, index) => `${formatMetricValue(metrics.temp.min[index], metrics.temp)} - ${formatMetricValue(metrics.temp.max[index], metrics.temp)}` }
    );
  }

  if (has("rh")) {
    columns.push(
      { label: "RH keskm.", value: (_, index) => formatMetricValue(metrics.rh.avg[index], metrics.rh) },
      { label: "RH max", value: (_, index) => formatMetricValue(metrics.rh.max[index], metrics.rh) }
    );
  }

  if (has("pm25")) {
    columns.push(
      { label: "PM2.5 keskm.", value: (_, index) => formatMetricValue(metrics.pm25.avg[index], metrics.pm25) },
      { label: "PM2.5 max", value: (_, index) => formatMetricValue(metrics.pm25.max[index], metrics.pm25) }
    );
  }

  if (has("pm10")) {
    columns.push(
      { label: "PM10 keskm.", value: (_, index) => formatMetricValue(metrics.pm10.avg[index], metrics.pm10) },
      { label: "PM10 max", value: (_, index) => formatMetricValue(metrics.pm10.max[index], metrics.pm10) }
    );
  }

  const body = sampleReportData.days.map((day, index) => `
    <tr>${columns.map((column) => `<td>${column.value(day, index)}</td>`).join("")}</tr>
  `).join("");

  return {
    head: columns.map((column) => `<th>${column.label}</th>`).join(""),
    body
  };
}

function renderHourlyTable(room, roomKey, dayIndex) {
  const keys = getMetricKeys(room);
  const columns = [
    { label: "Tund", value: (hour) => `${String(hour).padStart(2, "0")}:00` },
    ...keys.map((metricKey) => ({
      label: getMetricShortLabel(metricKey),
      value: (hour) => {
        const metric = room.metrics[metricKey];
        const value = getHourlySeries(roomKey, metricKey)[dayIndex * HOURS_PER_DAY + hour];
        return formatMetricValue(value, metric);
      }
    }))
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
  const keys = getMetricKeys(room);
  const columns = [
    { label: "Aeg", value: (slice) => getMinuteLabel(dayIndex, hour, slice) },
    ...keys.map((metricKey) => ({
      label: getMetricShortLabel(metricKey),
      value: (slice) => {
        const metric = room.metrics[metricKey];
        const value = getFiveMinuteValue(roomKey, metricKey, dayIndex, hour, slice);
        return formatMetricValue(value, metric);
      }
    }))
  ];
  const body = Array.from({ length: READINGS_PER_HOUR }, (_, slice) => `
    <tr>${columns.map((column) => `<td>${column.value(slice)}</td>`).join("")}</tr>
  `).join("");

  return {
    head: columns.map((column) => `<th>${column.label}</th>`).join(""),
    body
  };
}

function renderRoomTable(card, room, roomKey, state) {
  const wrap = card.querySelector("[data-room-table]");
  if (!wrap) return;

  const mode = state.tableMode;
  const dayOptions = sampleReportData.days.map((day, index) => `
    <option value="${index}" ${index === state.dayIndex ? "selected" : ""}>${day}</option>
  `).join("");
  const hourOptions = Array.from({ length: HOURS_PER_DAY }, (_, hour) => `
    <option value="${hour}" ${hour === state.hour ? "selected" : ""}>${String(hour).padStart(2, "0")}:00</option>
  `).join("");
  const detailText = {
    daily: "Päevakoond: 7 rida ruumi kohta.",
    hourly: `Tunnivaade: ${sampleReportData.days[state.dayIndex]} · 24 rida.`,
    five: `5 minuti vaade: ${sampleReportData.days[state.dayIndex]} ${String(state.hour).padStart(2, "0")}:00 · 12 mõõtehetke.`
  }[mode];
  const table = mode === "daily"
    ? renderDailyTable(room)
    : mode === "hourly"
      ? renderHourlyTable(room, roomKey, state.dayIndex)
      : renderFiveMinuteTable(room, roomKey, state.dayIndex, state.hour);
  const filters = mode === "daily" ? "" : `
    <div class="room-table-filters">
      <label class="room-table-filter">
        Päev
        <select data-table-day>${dayOptions}</select>
      </label>
      ${mode === "five" ? `
        <label class="room-table-filter">
          Tund
          <select data-table-hour>${hourOptions}</select>
        </label>
      ` : ""}
    </div>
  `;

  wrap.innerHTML = `
    <div class="room-table-toolbar">
      <div>
        <strong>Andmetabel</strong>
        <span>${detailText}</span>
      </div>
      <div class="room-table-actions" role="group" aria-label="Tabeli täpsus">
        <button type="button" class="room-table-button ${mode === "daily" ? "is-active" : ""}" data-table-mode="daily">Päev</button>
        <button type="button" class="room-table-button ${mode === "hourly" ? "is-active" : ""}" data-table-mode="hourly">Tund</button>
        <button type="button" class="room-table-button ${mode === "five" ? "is-active" : ""}" data-table-mode="five">5 min</button>
      </div>
      ${filters}
    </div>
    <div class="room-table-scroll">
      <table class="room-data-table">
        <thead><tr>${table.head}</tr></thead>
        <tbody>${table.body}</tbody>
      </table>
    </div>
  `;

  wrap.querySelectorAll("[data-table-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tableMode = button.dataset.tableMode;
      renderRoomTable(card, room, roomKey, state);
    });
  });

  wrap.querySelector("[data-table-day]")?.addEventListener("change", (event) => {
    state.dayIndex = Number(event.target.value);
    renderRoomTable(card, room, roomKey, state);
  });

  wrap.querySelector("[data-table-hour]")?.addEventListener("change", (event) => {
    state.hour = Number(event.target.value);
    renderRoomTable(card, room, roomKey, state);
  });
}

roomReportCards.forEach((card) => {
  const roomKey = card.dataset.room;
  const room = sampleReportData.rooms[roomKey];
  if (!room) return;

  const buttons = [...card.querySelectorAll(".room-chart-button")];
  const activeMetric = buttons.find((button) => button.classList.contains("is-active"))?.dataset.metric || buttons[0]?.dataset.metric;
  const state = {
    activeMetric,
    tableMode: "daily",
    dayIndex: 0,
    hour: 0
  };

  renderRoomChart(card, room, roomKey, state.activeMetric);
  renderRoomTable(card, room, roomKey, state);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      state.activeMetric = button.dataset.metric;
      renderRoomChart(card, room, roomKey, state.activeMetric);
    });
  });
});
