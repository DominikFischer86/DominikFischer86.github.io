// Config
const debug = false;
// const map = "wien"; // "wien, hamburg, hamburg2"
const path = "./assets/";
const mapUrlHamburg = { src: path + "map_hamburg.png", width: '1659px', height: '1338px' };
const mapUrlHamburg2 = { src:  path + "map_hamburg_2.png", width: '1473px', height: '856px'};
const mapUrlWien = { src: path + "map_wien.png", width: '1471px', height: '890px' };
const pinBar =  path + "icon_bar.svg";
const pinChurch =  path + "icon_church.svg";
const pinHome =  path + "icon_home.svg";
const pinHospital =  path + "icon_hospital.svg";
const pinHotel =  path + "icon_hotel.svg";
const pinTheatre =  path + "icon_theatre.svg";

const pins = [
  // Hamburg pins
  {
    x: 540,
    y: 130,
    icon: pinBar,
    color: "#9a28b3",
    name: "Fricke 46",
    description: "Nach der Arbeit abschalten, ein Feierabendbier trinken oder einfach nur über den Tag nachgrübeln, all das geht in dieser Bar unweit des UKE.",
    onMap: "hamburg"
  },
  {
    x: 490,
    y: 220,
    icon: pinHospital,
    color: "#a72412",
    name: "UKE",
    description: "Das UKE ist der gemeinsame Arbeitsort von Niklas und Frederik und der Ausgangspunkt aller FEHLER-Krimis.",
    onMap: "hamburg"
  },
  {
    x: 1000,
    y: 820,
    icon: pinHospital,
    color: "#a72412",
    name: "Asklepios Klinik St. Georg",
    description: "Die Asklepios-Klinik in St. Georg ist ab Systemfehler Frederiks neuer Arbeitgeber.",
    onMap: "hamburg"
  },
  {
    x: 1010,
    y: 1085,
    icon: pinHome,
    color: "#b2b62b",
    name: "Frederiks Wohnung",
    description: "Später zieht Frederik in ein Appartment am Mittelkanal, nicht weit entfernt von seiner neuen Arbeitsstelle.",
    onMap: "hamburg"
  },
  {
    x: 550,
    y: 1073,
    icon: pinHome,
    color: "#b2b62b",
    name: "Niklas' Wohnung",
    description: "Niklas wohnt währnd seiner Assistenzarzt-Ausbildung im Wohngebiet nahe es Michels, in der Winckler-Straße.",
    onMap: "hamburg"
  },
  {
    x: 570,
    y: 1070,
    icon: pinHome,
    color: "#b2b62b",
    name: "Niklas' neue Wohnung",
    description: "Später zieht Niklas in eine größere Wohnung im selben Wohngebiet, in der Martin-Luther-Straße.",
    onMap: "hamburg"
  },
  // Hamburg 2 pins
  {
    x: 720,
    y: 390,
    icon: pinHome,
    color: "#b2b62b",
    name: "Hendriksson Gestüt",
    description: "Das Gestüt der Familie Hendriksson liegt etwa eine halbe Autostunde nördlich von Hamburg. Dort leben Frederiks Brüder.",
    onMap: "hamburg2"
  },
  // Wien pins
  {
    x: 830,
    y: 370,
    icon: pinChurch,
    color: "#e9871a",
    name: "Stephansdom",
    description: "Im Herzen von Wien findet sich der Stephansdom - und manchmal gibt es in den dunklen Gewölben ungeahnt Trost in einer schweren Stunde.",
    onMap: "wien"
  },
  {
    x: 520,
    y: 160,
    icon: pinHospital,
    color: "#a72412",
    name: "Allgemeines Krankenhaus der Stadt Wien",
    description: "Christians unfreiwillige zweite Heimat während Herzenssache.",
    onMap: "wien"
  },
  {
    x: 445,
    y: 650,
    icon: pinTheatre,
    color: "#6c1341",
    name: "Ronacher Theater",
    description: "Christians Arbeitsplatz, hier spielt während der BÜHNENFIEBER-Reihe das fiktive Musical \"Das Tor zur Hölle\"",
    onMap: "wien"
  },
  {
    x: 850,
    y: 420,
    icon: pinTheatre,
    color: "#6c1341",
    name: "Raimund Theater",
    description: "Das zweite große Musicaltheater Wiens neben dem Ronacher.",
    onMap: "wien"
  },
  {
    x: 725,
    y: 535,
    icon: pinHotel,
    color: "#374aa9",
    name: "Hotel Drei Kronen Wien City",
    description: "In diesem Hotel in der Nähe von Christians Wohnung übernachten Familie und Freunde, wenn sein Gästezimmer belegt ist oder zu viel Besuch gleichzeitig in der Stadt ist.",
    onMap: "wien"
  },
  {
    x: 740,
    y: 570,
    icon: pinHome,
    color: "#b2b62b",
    name: "Christians Wohnung",
    description: "Die Wohnung gehört Christian bereits seit Studienzeiten. Wenn ihn ein Engagement mal wieder in die weite Welt führt, vermietet er sein Gästezimmer an Freunde oder Kollegen.",
    onMap: "wien"
  },
];

// Karte rendern
const wrapper = window.document.body.querySelector("#map_location_wrapper");
const map = wrapper.attributes["data-src"].value;
const sheet = window.document.body.querySelector("#map_sheet");
const mapImage = map === "hamburg" ? mapUrlHamburg.src : map === "hamburg2" ? mapUrlHamburg2.src : mapUrlWien.src;
const mapWidth = map === "hamburg" ? mapUrlHamburg.width : map === "hamburg2" ? mapUrlHamburg2.width : mapUrlWien.width;
const mapHeight = map === "hamburg" ? mapUrlHamburg.height : map === "hamburg2" ? mapUrlHamburg2.height : mapUrlWien.height;
let mapSheetStyles = sheet.getAttribute("style");
mapSheetStyles += `width: ${mapWidth}; height: ${mapHeight};`;
mapSheetStyles += `background-image: url(${mapImage});`;
sheet.setAttribute("style", mapSheetStyles);

// Dragging
let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

function getPosition(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}

// Bei Mausklick
function startDrag(e) {
  isDragging = true;
  const pos = getPosition(e);
  startX = pos.x - currentX;
  startY = pos.y - currentY;
  sheet.style.cursor = "grabbing";
};

// Maus bewegen
function drag(e) {
  if (!isDragging) return;

  const pos = getPosition(e);

  let newX = pos.x - startX;
  let newY = pos.y - startY;

  // Grenzen berechnen
  const wrapperRect = wrapper.getBoundingClientRect();

  const maxX = 0;
  const maxY = 0;
  const minX = wrapperRect.width - sheet.offsetWidth;
  const minY = wrapperRect.height - sheet.offsetHeight;

  // Clamp (Begrenzen)
  newX = Math.min(maxX, Math.max(minX, newX));
  newY = Math.min(maxY, Math.max(minY, newY));

  currentX = newX;
  currentY = newY;

  sheet.style.transform = `translate(${currentX}px, ${currentY}px)`;
};

// Maus loslassen
function endDrag() {
  isDragging = false;
  sheet.style.cursor = "grab";
};

// Maus Events
sheet.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", endDrag);

// Touch Events
sheet.addEventListener("touchstart", startDrag, { passive: true });
window.addEventListener("touchmove", drag, { passive: false });
window.addEventListener("touchend", endDrag);

async function createPin(pin) {
  if (pin.onMap !== map) return;

  const el = document.createElement("div");
  el.classList.add("map-pin");

  el.style.left = `${pin.x}px`;
  el.style.top = `${pin.y}px`;
  el.style.backgroundColor = pin.color;

  // SVG laden
  const res = await fetch(pin.icon);
  const svgText = await res.text();

  el.innerHTML = svgText;

  el.addEventListener("click", () => openPanel(pin));

  sheet.appendChild(el);
}

// Pins rendern
async function renderPins() {
    for (const pin of pins) {
  await createPin(pin);
}
}

renderPins();

// Panel
const panel = document.querySelector("#map_panel");
const panelTitle = document.querySelector("#panel_title");
const panelTitleHeader = panel.querySelector(".map_panel_header");
const panelName = document.querySelector("#panel_name");
const panelDesc = document.querySelector("#panel_desc");
const closeBtn = document.querySelector("#close_panel");

function openPanel(pin) {
  panelTitle.textContent = pin.name;
  panelName.textContent = pin.name;
  panelDesc.textContent = pin.description;

  panelTitleHeader.style.backgroundColor = pin.color;

  panel.classList.add("active");
}

function closePanel() {
  panel.classList.remove("active");
}

closeBtn.addEventListener("click", closePanel);

// Pin Locator
sheet.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // verhindert das normale Rechtsklick-Menü
  if (!debug) return

  const rect = sheet.getBoundingClientRect();

  // Mausposition relativ zum Sheet
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  alert(`x: ${Math.round(x)}, y: ${Math.round(y)}`);
});