
// i dont know if comments are mandatory for stardance, but this is good practice for ics4u0. btw the code for dragElement is from the guide
// i still don't know why the time loading thing is necessary or even if it is for actual users launching the github pages, but i needed it for testing

setInterval(function () {
  document.querySelector("#timeElement").innerHTML = "<strong>" + new Date().toLocaleString("en-CA") + "</strong>" }, 1000);

function setWindowPosition(element, left, top) {
  var rect = element.getBoundingClientRect();
  var deltaX = left - element.offsetLeft;
  var deltaY = top - element.offsetTop;
  var minDeltaX = 1 - rect.left;
  var maxDeltaX = window.innerWidth - 1 - rect.right;
  var minDeltaY = 1 - rect.top;
  var maxDeltaY = window.innerHeight - 1 - rect.bottom;

  deltaX = minDeltaX > maxDeltaX ? minDeltaX : Math.max(minDeltaX, Math.min(maxDeltaX, deltaX));
  deltaY = minDeltaY > maxDeltaY ? minDeltaY : Math.max(minDeltaY, Math.min(maxDeltaY, deltaY));

  element.style.left = (element.offsetLeft + deltaX) + "px";
  element.style.top = (element.offsetTop + deltaY) + "px";
}

window.addEventListener("resize", function () {
  document.querySelectorAll(".window").forEach(function (element) {
    setWindowPosition(element, element.offsetLeft, element.offsetTop);
  });
});

  // Make the DIV element draggable:
dragElement(document.getElementById("welcome"));  
dragElement(document.getElementById("notes"));
dragElement(document.getElementById("notesopen"));
dragElement(document.getElementById("sketchopen"));
dragElement(document.getElementById("sketch"));
dragElement(document.getElementById("calculatoropen"));
dragElement(document.getElementById("calculator"));
dragElement(document.getElementById("musicopen"));
dragElement(document.getElementById("music"));
dragElement(document.getElementById("searchopen"));
dragElement(document.getElementById("search"));
dragElement(document.getElementById("magzenopen"));
dragElement(document.getElementById("magzen"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;
  var wasDragged = false;
  var dragThreshold = 4;

  if (!element.style.position) {
    element.style.position = "absolute";
  }

  element.addEventListener("click", function (e) {
    if (wasDragged) {
      e.preventDefault();
      e.stopImmediatePropagation();
      wasDragged = false;
    }
  });

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    // Check if the target or any parent is contenteditable
    let target = e.target;
    while (target && target !== element) {
      if (target.contentEditable === 'true' || target.isContentEditable) {
        return; // Don't drag if clicking on editable content
      }
      if (element.id === "sketch" && (target.closest && (target.closest(".sketch-toolbar") || target.closest(".sketch-canvas")))) {
        return; // Keep sketchpad interactions inside the canvas and toolbar
      }
      if (element.id === "music" && target.closest && target.closest(".music-player")) {
        return;
      }
      if (element.id === "search" && target.closest && target.closest(".search-shell")) {
        return;
      }
      if (element.id === "magzen" && target.closest && (target.closest(".magzen-stage") || target.closest(".magzen-controls"))) {
        return;
      }
      if (target.closest && target.closest(".color-toggle")) {
        return; // Let the magnet polarity switch handle its own click
      }
      target = target.parentElement;
    }
    e.preventDefault();
    wasDragged = false;
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    if (Math.abs(currentX) > dragThreshold || Math.abs(currentY) > dragThreshold) {
      wasDragged = true;
    }

    if (window.magnetConstrainDrag) {
      var boundedDelta = window.magnetConstrainDrag(element, currentX, currentY);
      currentX = boundedDelta.dx;
      currentY = boundedDelta.dy;
    }

    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    var previousLeft = element.offsetLeft;
    var previousTop = element.offsetTop;
    setWindowPosition(element, previousLeft - currentX, previousTop - currentY);

    if (window.magnetHandleDrag) {
      window.magnetHandleDrag(element, previousLeft - element.offsetLeft, previousTop - element.offsetTop);
    }
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var welcomeScreen = document.querySelector("#welcome")

function closeWindow(element) {
  element.style.display = "none"
}

function openWindow(element) {
  element.style.display = "flex"
  biggestIndex++;  // biggestIndex up by 1
  element.style.zIndex = biggestIndex;
  element.style.top = "50%"
  element.style.left = "50%"
  element.style.transform = "translate(-50%, -50%)"
}

var welcomeScreenClose = document.querySelector("#welcomeclose")
var welcomeScreenOpen = document.querySelector("#welcomeopen")

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

var notesClose = document.querySelector("#notesclose")
var notesOpen = document.querySelector("#notesopen")

notesClose.addEventListener("click", function() {
  closeWindow(notes);
  deselectIcon(notesOpen);
});

notesOpen.addEventListener("click", function() {
  openWindow(notes);
  selectIcon(notesOpen);
});

var sketchClose = document.querySelector("#sketchclose")
var sketchOpen = document.querySelector("#sketchopen")

sketchClose.addEventListener("click", function() {
  closeWindow(sketch);
  deselectIcon(sketchOpen);
});

sketchOpen.addEventListener("click", function() {
  openWindow(sketch);
  selectIcon(sketchOpen);
  context.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
  resizeCanvas();
});


var selectedIcon = undefined

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined
}


function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element)
  } else {
    selectIcon(element)
  }
}

var biggestIndex = 1;

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}

addWindowTapHandling(welcomeScreen)
addWindowTapHandling(notes)
addWindowTapHandling(sketch)
addWindowTapHandling(document.getElementById("calculator"))
addWindowTapHandling(document.getElementById("music"))
addWindowTapHandling(document.getElementById("search"))
addWindowTapHandling(document.getElementById("magzen"))


function handleWindowTap(element) {
  biggestIndex++;  
  element.style.zIndex = biggestIndex;
}

// Yeah the calculator makes a buncha stuff open hopefully that will never cause any issues
if (!window.magnosCalculatorInitialized) {
  window.magnosCalculatorInitialized = true;
  var calculator = document.querySelector("#calculator");
  var calculatorOpen = document.querySelector("#calculatoropen");
  var calculatorClose = document.querySelector("#calculatorclose");
  var calculatorDisplay = document.querySelector("#calculatorDisplay");
  var calculatorMode = document.querySelector("#calculatorMode");
  var calculatorAngle = document.querySelector("#calculatorAngle");
  var calculatorMemory = document.querySelector("#calculatorMemory");
  var calculatorMemoryValue = 0;
  var calculatorDegrees = true;
  var calculatorJustEvaluated = false;

  function showCalculatorError() { calculatorDisplay.value = "Error"; calculatorJustEvaluated = true; }
  function calculateExpression(expression) {
    var normalized = expression.replace(/π/g, "pi").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\^/g, "**").replace(/%/g, "/100").replace(/\bpi\b/g, "Math.PI").replace(/\be\b/g, "Math.E").replace(/sqrt\(/g, "Math.sqrt(").replace(/log\(/g, "Math.log10(").replace(/ln\(/g, "Math.log(").replace(/sin\(/g, calculatorDegrees ? "Math.sin(Math.PI/180*" : "Math.sin(").replace(/cos\(/g, calculatorDegrees ? "Math.cos(Math.PI/180*" : "Math.cos(").replace(/tan\(/g, calculatorDegrees ? "Math.tan(Math.PI/180*" : "Math.tan(");
    if (!/^[0-9+*/().\sA-Za-z_*-]+$/.test(normalized) || normalized.includes("constructor") || normalized.includes("window")) throw new Error("Invalid expression");
    var result = Function("return (" + normalized + ")")();
    if (!Number.isFinite(result)) throw new Error("Invalid result");
    return Number(result.toPrecision(12));
  }
  function updateCalculatorDisplay(value) {
    if (calculatorJustEvaluated) { calculatorDisplay.value = ""; calculatorJustEvaluated = false; }
    if (calculatorDisplay.value === "0" && !/[+\-*/^%)]/.test(value)) calculatorDisplay.value = value;
    else calculatorDisplay.value += value;
  }
  document.querySelectorAll("[data-calc]").forEach(function (button) { button.addEventListener("click", function () { updateCalculatorDisplay(button.dataset.calc); }); });
  document.querySelector("#calculatorEquals").addEventListener("click", function () { try { calculatorDisplay.value = calculateExpression(calculatorDisplay.value); calculatorJustEvaluated = true; } catch (error) { showCalculatorError(); } });
  document.querySelector("#calculatorClear").addEventListener("click", function () { calculatorDisplay.value = "0"; calculatorJustEvaluated = false; });
  document.querySelector("#calculatorBackspace").addEventListener("click", function () { calculatorDisplay.value = calculatorDisplay.value.length > 1 ? calculatorDisplay.value.slice(0, -1) : "0"; });
  calculatorAngle.addEventListener("click", function () { calculatorDegrees = !calculatorDegrees; calculatorAngle.textContent = calculatorDegrees ? "DEG" : "RAD"; calculatorMode.textContent = calculatorAngle.textContent; });
  document.querySelector("#calculatorMemoryClear").addEventListener("click", function () { calculatorMemoryValue = 0; calculatorMemory.textContent = "M"; });
  document.querySelector("#calculatorMemoryRecall").addEventListener("click", function () { updateCalculatorDisplay(String(calculatorMemoryValue)); });
  document.querySelector("#calculatorMemoryAdd").addEventListener("click", function () { try { calculatorMemoryValue += calculateExpression(calculatorDisplay.value); calculatorMemory.textContent = "M*"; } catch (error) { showCalculatorError(); } });
  document.addEventListener("keydown", function (event) { if (calculator.style.display === "none") return; if (/[0-9.+\-*/%^()]/.test(event.key)) updateCalculatorDisplay(event.key); if (event.key === "Enter") document.querySelector("#calculatorEquals").click(); if (event.key === "Backspace") document.querySelector("#calculatorBackspace").click(); if (event.key === "Escape") document.querySelector("#calculatorClear").click(); });
  calculatorClose.addEventListener("click", function () { closeWindow(calculator); deselectIcon(calculatorOpen); });
  calculatorOpen.addEventListener("click", function () { openWindow(calculator); selectIcon(calculatorOpen); });
}

// Don't even get me started on the music
if (!window.magnosMusicInitialized) {
  window.magnosMusicInitialized = true;
  var music = document.querySelector("#music");
  var musicOpen = document.querySelector("#musicopen");
  var musicClose = document.querySelector("#musicclose");
  var musicAudio = document.querySelector("#musicAudio");
  var musicPlay = document.querySelector("#musicPlay");
  var musicProgress = document.querySelector("#musicProgress");
  var musicCurrentTime = document.querySelector("#musicCurrentTime");
  var musicDuration = document.querySelector("#musicDuration");
  var musicVolume = document.querySelector("#musicVolume");
  var musicMute = document.querySelector("#musicMute");
  var musicLastVolume = musicVolume.value;

  function formatMusicTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
  }

  function updateMusicProgress() {
    musicProgress.value = musicAudio.duration ? (musicAudio.currentTime / musicAudio.duration) * 100 : 0;
    musicCurrentTime.textContent = formatMusicTime(musicAudio.currentTime);
    musicDuration.textContent = formatMusicTime(musicAudio.duration);
  }

  function updateMusicPlayButton() {
    var isPlaying = !musicAudio.paused;
    musicPlay.textContent = isPlaying ? "Ⅱ" : "▶";
    musicPlay.setAttribute("aria-label", isPlaying ? "Pause Magnetic" : "Play Magnetic");
    musicPlay.title = isPlaying ? "Pause" : "Play";
    music.classList.toggle("music-playing", isPlaying);
  }

  musicAudio.volume = Number(musicVolume.value);
  musicPlay.addEventListener("click", function () {
    if (musicAudio.paused) {
      musicAudio.play().catch(function () {});
    } else {
      musicAudio.pause();
    }
  });
  musicAudio.addEventListener("loadedmetadata", updateMusicProgress);
  musicAudio.addEventListener("timeupdate", updateMusicProgress);
  musicAudio.addEventListener("play", updateMusicPlayButton);
  musicAudio.addEventListener("pause", updateMusicPlayButton);
  musicAudio.addEventListener("ended", function () {
    musicAudio.currentTime = 0;
    updateMusicPlayButton();
  });
  musicProgress.addEventListener("input", function () {
    if (musicAudio.duration) musicAudio.currentTime = (Number(musicProgress.value) / 100) * musicAudio.duration;
  });
  document.querySelector("#musicBack").addEventListener("click", function () { musicAudio.currentTime = Math.max(0, musicAudio.currentTime - 10); });
  document.querySelector("#musicForward").addEventListener("click", function () { musicAudio.currentTime = Math.min(musicAudio.duration || 0, musicAudio.currentTime + 10); });
  musicVolume.addEventListener("input", function () {
    musicAudio.volume = Number(musicVolume.value);
    if (musicAudio.volume > 0) musicLastVolume = musicVolume.value;
    musicMute.textContent = musicAudio.volume === 0 ? "🔇" : "🔊";
  });
  musicMute.addEventListener("click", function () {
    if (musicAudio.volume > 0) {
      musicLastVolume = musicVolume.value;
      musicVolume.value = 0;
    } else {
      musicVolume.value = musicLastVolume || 0.75;
    }
    musicVolume.dispatchEvent(new Event("input"));
  });
  musicClose.addEventListener("click", function () { closeWindow(music); deselectIcon(musicOpen); musicAudio.pause(); });
  musicOpen.addEventListener("click", function () { openWindow(music); selectIcon(musicOpen); });
}

if (!window.magnosSearchInitialized) {
  window.magnosSearchInitialized = true;
  var search = document.querySelector("#search");
  var searchOpen = document.querySelector("#searchopen");
  var searchClose = document.querySelector("#searchclose");
  var searchInput = document.querySelector("#searchInput");

  searchClose.addEventListener("click", function () {
    closeWindow(search);
    deselectIcon(searchOpen);
  });
  searchOpen.addEventListener("click", function () {
    openWindow(search);
    selectIcon(searchOpen);
    searchInput.focus();
  });
}

// I used an open-source physics handler to make the filings move independently, and then made them circle the cursor
// This isn't technically accurate to how magnetism works, but it's fun

if (!window.magnosMagZenInitialized) {
  window.magnosMagZenInitialized = true;

  var magzen = document.querySelector("#magzen");
  var magzenOpen = document.querySelector("#magzenopen");
  var magzenClose = document.querySelector("#magzenclose");
  var magzenCanvas = document.querySelector("#magzenCanvas");
  var magzenContext = magzenCanvas.getContext("2d");
  var magzenPause = document.querySelector("#magzenPause");
  var magzenReset = document.querySelector("#magzenReset");
  var magzenFieldLabel = document.querySelector("#magzenFieldLabel");
  var magzenStrength = document.querySelector("#magzenStrength");
  var magzenStrengthValue = document.querySelector("#magzenStrengthValue");
  var magzenParticles = [];
  var magzenWidth = 0;
  var magzenHeight = 0;
  var magzenPointer = { x: 0, y: 0, active: false };
  var magzenMagnet = { x: 0, y: 0 };
  var magzenFrame = 0;
  var magzenRunning = false;
  var magzenRepel = false;
  var magzenForceStrength = Number(magzenStrength.value) / 100;
  var MAGZEN_PARTICLE_COUNT = 200;

  function resetMagZenParticles() {
    magzenParticles = Array.from({ length: MAGZEN_PARTICLE_COUNT }, function () {
      return {
        x: Math.random() * magzenWidth,
        y: Math.random() * magzenHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        length: 2 + Math.random() * 4,
        hue: Math.random() < 0.18 ? 42 + Math.random() * 18 : 185 + Math.random() * 28
      };
    });
    magzenContext.clearRect(0, 0, magzenWidth, magzenHeight);
  }

  function resizeMagZenCanvas() {
    var rect = magzenCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var nextWidth = Math.round(rect.width * ratio);
    var nextHeight = Math.round(rect.height * ratio);
    if (magzenCanvas.width === nextWidth && magzenCanvas.height === nextHeight) return;
    magzenCanvas.width = nextWidth;
    magzenCanvas.height = nextHeight;
    magzenContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    magzenWidth = rect.width;
    magzenHeight = rect.height;
    magzenMagnet.x = magzenWidth / 2;
    magzenMagnet.y = magzenHeight / 2;
    resetMagZenParticles();
  }

  function magZenFieldAt(x, y, centerX, centerY) {
    var dx = x - centerX;
    var dy = y - centerY;
    var radiusSquared = dx * dx + dy * dy + 180;
    var scale = 1 / Math.pow(radiusSquared, 1.5);
    var fieldX = 3 * dx * dy * scale;
    var fieldY = (2 * dy * dy - dx * dx + 180) * scale;
    var magnitude = Math.hypot(fieldX, fieldY) || 1;
    return { x: fieldX / magnitude, y: fieldY / magnitude };
  }

  function renderMagZen(timestamp) {
    if (!magzenRunning) return;
    if (magzen.style.display === "none") {
      magzenFrame = requestAnimationFrame(renderMagZen);
      return;
    }
    if (!magzenWidth || !magzenHeight) resizeMagZenCanvas();
    var centerX = magzenPointer.active ? magzenPointer.x : magzenWidth / 2;
    var centerY = magzenPointer.active ? magzenPointer.y : magzenHeight / 2;
    var frameScale = Math.min((timestamp - (renderMagZen.lastTime || timestamp)) / 16.67, 2);
    renderMagZen.lastTime = timestamp;
    magzenMagnet.x += (centerX - magzenMagnet.x) * 0.12;
    magzenMagnet.y += (centerY - magzenMagnet.y) * 0.12;

    var ctx = magzenContext;
    ctx.fillStyle = "rgba(3, 16, 32, .2)";
    ctx.fillRect(0, 0, magzenWidth, magzenHeight);

    magzenParticles.forEach(function (particle) {
      var dx = magzenMagnet.x - particle.x;
      var dy = magzenMagnet.y - particle.y;
      var distance = Math.hypot(dx, dy) + 0.001;
      var influence = 125 / (distance + 125);
      if (magzenRepel) {
        var repel = 0.07 * magzenForceStrength * influence * frameScale;
        particle.vx -= dx / distance * repel;
        particle.vy -= dy / distance * repel;
      } else {
        var pull = 0.045 * magzenForceStrength * influence * frameScale;
        var swirl = 0.085 * magzenForceStrength * influence * frameScale;
        particle.vx += (dx / distance * pull - dy / distance * swirl);
        particle.vy += (dy / distance * pull + dx / distance * swirl);
      }
      particle.vx *= Math.pow(0.975, frameScale);
      particle.vy *= Math.pow(0.975, frameScale);
      var speed = Math.hypot(particle.vx, particle.vy);
      var maxSpeed = magzenRepel ? 3.2 : 2.6;
      if (speed > maxSpeed) {
        particle.vx = particle.vx / speed * maxSpeed;
        particle.vy = particle.vy / speed * maxSpeed;
      }
      particle.x += particle.vx * frameScale;
      particle.y += particle.vy * frameScale;

      if (particle.x < -8) particle.x = magzenWidth + 4;
      if (particle.x > magzenWidth + 8) particle.x = -4;
      if (particle.y < -8) particle.y = magzenHeight + 4;
      if (particle.y > magzenHeight + 8) particle.y = -4;

      var field = magZenFieldAt(particle.x, particle.y, magzenMagnet.x, magzenMagnet.y);
      var halfLength = particle.length / 2;
      ctx.beginPath();
      ctx.moveTo(particle.x - field.x * halfLength, particle.y - field.y * halfLength);
      ctx.lineTo(particle.x + field.x * halfLength, particle.y + field.y * halfLength);
      ctx.lineWidth = 1 + influence * 0.8;
      ctx.lineCap = "round";
      ctx.strokeStyle = "hsla(" + particle.hue + ", 88%, " + (72 + influence * 18) + "%, " + (0.58 + influence * 0.35) + ")";
      ctx.shadowBlur = influence > 0.3 ? 5 : 1;
      ctx.shadowColor = "hsla(" + particle.hue + ", 100%, 72%, .65)";
      ctx.stroke();
    });
    if (magzenPointer.active) {
      ctx.beginPath();
      ctx.arc(magzenPointer.x, magzenPointer.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ff405b";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ff405b";
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    magzenFrame = requestAnimationFrame(renderMagZen);
  }

  function startMagZen() {
    if (magzenRunning) return;
    resizeMagZenCanvas();
    magzenRunning = true;
    magzenPause.textContent = "Pause";
    magzenPause.setAttribute("aria-pressed", "false");
    magzenFrame = requestAnimationFrame(renderMagZen);
  }

  function pauseMagZen() {
    magzenRunning = false;
    cancelAnimationFrame(magzenFrame);
    magzenPause.textContent = "Resume";
    magzenPause.setAttribute("aria-pressed", "true");
  }

  function setMagZenPointer(event) {
    var rect = magzenCanvas.getBoundingClientRect();
    magzenPointer.x = event.clientX - rect.left;
    magzenPointer.y = event.clientY - rect.top;
    magzenPointer.active = true;
  }

  magzenCanvas.addEventListener("click", function (event) {
    setMagZenPointer(event);
    magzenMagnet.x = magzenPointer.x;
    magzenMagnet.y = magzenPointer.y;
    magzenRepel = !magzenRepel;
    magzenFieldLabel.textContent = magzenRepel ? "Repel Mode" : "Attract Mode";
    magzenFieldLabel.parentElement.classList.toggle("magzen-repelling", magzenRepel);
    if (magzenRepel) {
      magzenParticles.forEach(function (particle) {
        var dx = particle.x - magzenMagnet.x;
        var dy = particle.y - magzenMagnet.y;
        var distance = Math.hypot(dx, dy) + 0.001;
        var burst = 1.5 * magzenForceStrength * 180 / (distance + 180);
        particle.vx += dx / distance * burst;
        particle.vy += dy / distance * burst;
      });
    }
  });
  magzenCanvas.addEventListener("pointermove", setMagZenPointer);
  magzenCanvas.addEventListener("pointerdown", setMagZenPointer);
  magzenCanvas.addEventListener("pointerleave", function () { magzenPointer.active = false; });
  magzenCanvas.addEventListener("pointercancel", function () { magzenPointer.active = false; });
  magzenStrength.addEventListener("input", function () {
    magzenForceStrength = Number(magzenStrength.value) / 100;
    magzenStrengthValue.value = magzenStrength.value + "%";
    magzenStrengthValue.textContent = magzenStrength.value + "%";
    magzenStrength.setAttribute("aria-valuetext", magzenStrength.value + "%");
  });
  magzenPause.addEventListener("click", function () {
    if (magzenRunning) pauseMagZen();
    else startMagZen();
  });
  magzenReset.addEventListener("click", function () {
    resizeMagZenCanvas();
    resetMagZenParticles();
  });
  magzenOpen.addEventListener("click", function () {
    openWindow(magzen);
    selectIcon(magzenOpen);
    startMagZen();
  });
  magzenClose.addEventListener("click", function () {
    closeWindow(magzen);
    deselectIcon(magzenOpen);
    pauseMagZen();
  });

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(resizeMagZenCanvas).observe(document.querySelector(".magzen-stage"));
  } else {
    window.addEventListener("resize", resizeMagZenCanvas);
  }
}

var sketchCanvas = document.querySelector("#sketchCanvas");
var sketchColorInput = document.querySelector("#sketchColor");
var sketchSizeInput = document.querySelector("#sketchSize");
var sketchWipeButton = document.querySelector("#sketchWipe");

if (sketchCanvas) {
  var context = sketchCanvas.getContext("2d");
  var isDrawing = false;

  function resizeCanvas() {
    var canvasRect = sketchCanvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    sketchCanvas.width = Math.floor(canvasRect.width * ratio);
    sketchCanvas.height = Math.floor((canvasRect.height || 280) * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
  }

  function getPointFromEvent(event) {
    var rect = sketchCanvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }


  function startSketch(event) {
    event.preventDefault();
    isDrawing = true;
    var point = getPointFromEvent(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.strokeStyle = sketchColorInput.value;
    context.lineWidth = sketchSizeInput.value;
  }


  function drawSketch(event) {
    if (!isDrawing) {
      return;
    }

    event.preventDefault();
    var point = getPointFromEvent(event);
    context.lineTo(point.x, point.y);
    context.strokeStyle = sketchColorInput.value;
    context.lineWidth = sketchSizeInput.value;
    context.stroke();
  }

  function stopSketch() {
    isDrawing = false;
    context.beginPath();
  }

  sketchCanvas.addEventListener("pointerdown", startSketch);
  sketchCanvas.addEventListener("pointermove", drawSketch);
  sketchCanvas.addEventListener("pointerup", stopSketch);
  sketchCanvas.addEventListener("pointerleave", stopSketch);
  sketchCanvas.addEventListener("pointercancel", stopSketch);

  sketchWipeButton.addEventListener("click", function () {
    context.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
    resizeCanvas();
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  
}

// Magnetism
// Every window has a polarity, which is a red or blue outline
// opposite  poles that touch do a cool snap white glow and click together and move as one
// I'm genuinely Patrick Jane for this

if (!window.magnosMagnetInitialized) {
  window.magnosMagnetInitialized = true;

  var MAGNET_IDS = ["welcome", "notes", "sketch", "calculator", "music", "search", "magzen"];
  var SNAP_DISTANCE = 22;    // px - how close touching edges must be to link
  var ALIGN_THRESHOLD = 6;   // px - tight tolerance for smart-guide alignment
  var REPEL_GAP = 8;         // px - minimum breathing room enforced between like poles
  var REPEL_KICK = 26;       // px - extra "clear away" distance on top of the gap
  var SNAP_SOUND_START = 0.57;

  var magnetColors = {};
  var magnetAttachments = {};
  // smash 6 when??
  var switchsnap = new Audio("./snap.mp3");
  switchsnap.preload = "auto";
  switchsnap.load();

  MAGNET_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    magnetAttachments[id] = new Set();
    magnetColors[id] = el.dataset.color === "red" ? "red" : "blue";
  });

  function setWindowColor(id, color) {
    var el = document.getElementById(id);
    if (!el || magnetColors[id] === color) return;
    magnetColors[id] = color;
    el.dataset.color = color;

    // Same colour as an attached neighbour now = detach (opposite poles only).
    Array.from(magnetAttachments[id]).forEach(function (otherId) {
      if (magnetColors[otherId] === color) {
        magnetAttachments[id].delete(otherId);
        magnetAttachments[otherId].delete(id);
      }
    });
  }

  MAGNET_IDS.forEach(function (id) {
    var toggle = document.querySelector("#" + id + " .color-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var next = magnetColors[id] === "red" ? "blue" : "red";
      setWindowColor(id, next);
    });
  });

  
  function linkWindows(a, b) {
    magnetAttachments[a].add(b);
    magnetAttachments[b].add(a);
    switchsnap.currentTime = SNAP_SOUND_START;
    switchsnap.play().catch(function () {});
    [a, b].forEach(function (id) {
      var el = document.getElementById(id);
      el.classList.remove("magnet-linked");
      void el.offsetWidth; // restart the pulse animation
      el.classList.add("magnet-linked");
      setTimeout(function () { el.classList.remove("magnet-linked"); }, 500);
    });
  }

  // Every window is linked to startId so this way repelling doesnt slime out the group connection
  function getAttachedGroup(startId) {
    var visited = new Set([startId]);
    var queue = Array.from(magnetAttachments[startId]);
    var group = [];
    while (queue.length) {
      var gid = queue.shift();
      if (visited.has(gid)) continue;
      visited.add(gid);
      group.push(gid);
      magnetAttachments[gid].forEach(function (nextId) {
        if (!visited.has(nextId)) queue.push(nextId);
      });
    }
    return group;
  }

  window.magnetConstrainDrag = function (element, dx, dy) {
    if (MAGNET_IDS.indexOf(element.id) === -1) return { dx: dx, dy: dy };

    var group = [element].concat(getAttachedGroup(element.id).map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean));
    var minDeltaX = -Infinity;
    var maxDeltaX = Infinity;
    var minDeltaY = -Infinity;
    var maxDeltaY = Infinity;

    group.forEach(function (member) {
      var rect = member.getBoundingClientRect();
      minDeltaX = Math.max(minDeltaX, 1 - rect.left);
      maxDeltaX = Math.min(maxDeltaX, window.innerWidth - 1 - rect.right);
      minDeltaY = Math.max(minDeltaY, 1 - rect.top);
      maxDeltaY = Math.min(maxDeltaY, window.innerHeight - 1 - rect.bottom);
    });

    var moveX = minDeltaX > maxDeltaX ? 0 : Math.max(minDeltaX, Math.min(maxDeltaX, -dx));
    var moveY = minDeltaY > maxDeltaY ? 0 : Math.max(minDeltaY, Math.min(maxDeltaY, -dy));
    return { dx: -moveX, dy: -moveY };
  };

  // Smart aligning: the edges and centres can both align
  function checkAlignment(id) {
    var el = document.getElementById(id);
    if (!el || el.style.display === "none") return [];

    var taskbarEl = document.getElementById("taskbar");
    var floorY = taskbarEl ? taskbarEl.getBoundingClientRect().top : window.innerHeight;

    var rect = el.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;

    var bestX = null; 
    var bestY = null;

    function considerX(a, b, targetLeft) {
      var diff = a - b;
      if (Math.abs(diff) < ALIGN_THRESHOLD && (bestX === null || Math.abs(diff) < Math.abs(bestX.diff))) {
        bestX = { diff: diff, targetLeft: targetLeft, coord: b };
      }
    }
    function considerY(a, b, targetTop) {
      var diff = a - b;
      if (Math.abs(diff) < ALIGN_THRESHOLD && (bestY === null || Math.abs(diff) < Math.abs(bestY.diff))) {
        bestY = { diff: diff, targetTop: targetTop, coord: b };
      }
    }

    MAGNET_IDS.forEach(function (otherId) {
      if (otherId === id) return;
      var otherEl = document.getElementById(otherId);
      if (!otherEl || otherEl.style.display === "none") return;
      var otherRect = otherEl.getBoundingClientRect();
      var otherCenterX = otherRect.left + otherRect.width / 2;
      var otherCenterY = otherRect.top + otherRect.height / 2;

      considerX(rect.left, otherRect.left, otherRect.left);
      considerX(rect.right, otherRect.right, otherRect.right - rect.width);
      considerX(centerX, otherCenterX, otherCenterX - rect.width / 2);

      considerY(rect.top, otherRect.top, otherRect.top);
      considerY(rect.bottom, otherRect.bottom, otherRect.bottom - rect.height);
      considerY(centerY, otherCenterY, otherCenterY - rect.height / 2);
    });

    // This is to make the windows snap to edges of screen
    considerX(rect.left, 0, 0);
    considerX(rect.right, window.innerWidth, window.innerWidth - rect.width);
    considerX(centerX, window.innerWidth / 2, window.innerWidth / 2 - rect.width / 2);

    considerY(rect.top, 0, 0);
    considerY(rect.bottom, floorY, floorY - rect.height);
    considerY(centerY, floorY / 2, floorY / 2 - rect.height / 2);

    var guides = [];
    if (bestX) {
      setWindowPosition(el, el.offsetLeft + (bestX.targetLeft - rect.left), el.offsetTop);
      guides.push({ type: "v", coord: bestX.coord });
    }
    if (bestY) {
      setWindowPosition(el, el.offsetLeft, el.offsetTop + (bestY.targetTop - rect.top));
      guides.push({ type: "h", coord: bestY.coord });
    }
    return guides;
  }

  // Opposite poles: snap together and make their position things almost the same
  function checkForSnap(id) {
    var el = document.getElementById(id);
    if (!el || el.style.display === "none") return;
    var rect = el.getBoundingClientRect();
    var color = magnetColors[id];

    MAGNET_IDS.forEach(function (otherId) {
      if (otherId === id) return;
      if (magnetColors[otherId] === color) return; 
      if (magnetAttachments[id].has(otherId)) return; 

      var otherEl = document.getElementById(otherId);
      if (!otherEl || otherEl.style.display === "none") return;
      var otherRect = otherEl.getBoundingClientRect();

      var verticalOverlap = Math.min(rect.bottom, otherRect.bottom) - Math.max(rect.top, otherRect.top);
      var horizontalOverlap = Math.min(rect.right, otherRect.right) - Math.max(rect.left, otherRect.left);

      var snapDX = null;
      var snapDY = null;

      if (verticalOverlap > 0) {
        if (Math.abs(rect.right - otherRect.left) < SNAP_DISTANCE) {
          snapDX = otherRect.left - rect.right;
        } else if (Math.abs(rect.left - otherRect.right) < SNAP_DISTANCE) {
          snapDX = otherRect.right - rect.left;
        }
      }

      if (horizontalOverlap > 0) {
        if (Math.abs(rect.bottom - otherRect.top) < SNAP_DISTANCE) {
          snapDY = otherRect.top - rect.bottom;
        } else if (Math.abs(rect.top - otherRect.bottom) < SNAP_DISTANCE) {
          snapDY = otherRect.bottom - rect.top;
        }
      }

      if (snapDX !== null || snapDY !== null) {
        setWindowPosition(el, el.offsetLeft + (snapDX || 0), el.offsetTop + (snapDY || 0));
        rect = el.getBoundingClientRect();
        linkWindows(id, otherId);
      }
    });
  }

 
  // Like poles the instant their position would be same, one flies away
  // I tried making them push back but spawning might still be a bit jank
  // Every time I tried to fix it it just ended up making them not even spawn when the icon is pressed
  function checkRepel(id) {
    var el = document.getElementById(id);
    if (!el || el.style.display === "none") return;
    var color = magnetColors[id];

    MAGNET_IDS.forEach(function (otherId) {
      if (otherId === id) return;
      if (magnetColors[otherId] !== color) return; // only like poles repel
      var otherEl = document.getElementById(otherId);
      if (!otherEl || otherEl.style.display === "none") return;

      var rect = el.getBoundingClientRect();
      var otherRect = otherEl.getBoundingClientRect();

      var overlapX = Math.min(rect.right, otherRect.right) - Math.max(rect.left, otherRect.left);
      var overlapY = Math.min(rect.bottom, otherRect.bottom) - Math.max(rect.top, otherRect.top);

      var axis = null;     // x or y 
      var pushDir = 0;     
      var overlapAmount = 0;

      // If they're already overlapping...
      if (overlapX > 0 && overlapY > 0) {
        overlapAmount = Math.min(overlapX, overlapY);
        if (overlapX < overlapY) {
          axis = "x";
          pushDir = (otherRect.left + otherRect.width / 2) < (rect.left + rect.width / 2) ? -1 : 1;
        } else {
          axis = "y";
          pushDir = (otherRect.top + otherRect.height / 2) < (rect.top + rect.height / 2) ? -1 : 1;
        }
        // ...send them away!
      } else if (overlapY > 0 && Math.abs(rect.right - otherRect.left) < SNAP_DISTANCE) {
        axis = "x"; pushDir = 1;  
      } else if (overlapY > 0 && Math.abs(rect.left - otherRect.right) < SNAP_DISTANCE) {
        axis = "x"; pushDir = -1; 
      } else if (overlapX > 0 && Math.abs(rect.bottom - otherRect.top) < SNAP_DISTANCE) {
        axis = "y"; pushDir = 1;  
      } else if (overlapX > 0 && Math.abs(rect.top - otherRect.bottom) < SNAP_DISTANCE) {
        axis = "y"; pushDir = -1; 
      }

      if (!axis) return; // not close enough to repel

      var kick = overlapAmount + REPEL_GAP + REPEL_KICK;
      var deltaLeft = axis === "x" ? pushDir * kick : 0;
      var deltaTop = axis === "y" ? pushDir * kick : 0;

      // Move the repelled window and it's buddy window so an existing bond doesn't get ripped apart by the third wheel
      [otherId].concat(getAttachedGroup(otherId)).forEach(function (gid) {
        var gEl = document.getElementById(gid);
        if (!gEl) return;
        gEl.classList.add("magnet-repelled");
        setWindowPosition(gEl, gEl.offsetLeft + deltaLeft, gEl.offsetTop + deltaTop);
        setTimeout(function () { gEl.classList.remove("magnet-repelled"); }, 320);
      });
    });
  }

  window.magnetHandleDrag = function (element, dx, dy) {
    if (MAGNET_IDS.indexOf(element.id) === -1) return;

    // This just carries along everything linked to this window
    var visited = new Set([element.id]);
    var queue = Array.from(magnetAttachments[element.id]);
    while (queue.length) {
      var id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      var partnerEl = document.getElementById(id);
      if (partnerEl) {
        setWindowPosition(partnerEl, partnerEl.offsetLeft - dx, partnerEl.offsetTop - dy);
      }
      magnetAttachments[id].forEach(function (nextId) {
        if (!visited.has(nextId)) queue.push(nextId);
      });
    }

    checkAlignment(element.id);
    checkForSnap(element.id);
    checkRepel(element.id);
  };
}

if (!window.magnosResizeInitialized) {
  window.magnosResizeInitialized = true;

  var RESIZE_MIN_W = 260;
  var RESIZE_MIN_H = 180;
// never eat soggy wheat
// this below code does the resizing of windows, it was inspired by the guide originally asking me to make a handle to drag???
// i thought that was bad for just dragging and made the whole window draggable, but resizing needs the corners to be handles
  document.querySelectorAll(".window").forEach(function (win) {
    ["nw", "ne", "sw", "se"].forEach(function (dir) {
      var handle = document.createElement("div");
      handle.className = "resize-handle resize-" + dir;
      win.appendChild(handle);

      handle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof handleWindowTap === "function") handleWindowTap(win);

        var rect = win.getBoundingClientRect();
        win.style.transform = "none";
        win.style.left = rect.left + "px";
        win.style.top = rect.top + "px";

        var startX = e.clientX;
        var startY = e.clientY;
        var startW = win.offsetWidth;
        var startH = win.offsetHeight;
        var startLeft = win.offsetLeft;
        var startTop = win.offsetTop;
        var maxW = window.innerWidth - 24;
        var maxH = window.innerHeight - 100;

        function move(ev) {
          var dx = ev.clientX - startX;
          var dy = ev.clientY - startY;
          var w = startW;
          var h = startH;

          if (dir === "se") { w = startW + dx; h = startH + dy; }
          if (dir === "sw") { w = startW - dx; h = startH + dy; }
          if (dir === "ne") { w = startW + dx; h = startH - dy; }
          if (dir === "nw") { w = startW - dx; h = startH - dy; }

          w = Math.max(RESIZE_MIN_W, Math.min(maxW, w));
          h = Math.max(RESIZE_MIN_H, Math.min(maxH, h));

          var left = startLeft;
          var top = startTop;
          if (dir === "sw" || dir === "nw") left = startLeft + (startW - w);
          if (dir === "nw" || dir === "ne") top = startTop + (startH - h);

          win.style.width = w + "px";
          win.style.height = h + "px";
          setWindowPosition(win, left, top);

          if (win.id === "sketch" && typeof resizeCanvas === "function") resizeCanvas();
        }

        function up() {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      });
    });
  });
}

// Splashes inspired by Minecraft... or Terraria?
const splashes = [
  "Opposites attract!",
  "Why so negative?",
  "Right-hand rule!",
  "From the North Pole.",
  "See what sticks.",
  "Electron-ic Boogaloo!",
  "Sticky situations ahoy!",
  "It's a polarizing subject.",
  "Things could go south from here.",
  "Like attracts unlike.",
  "Zip Zap Zop!",
  "Buff magnet rise!"
];
document.title = splashes[Math.floor(Math.random() * splashes.length)];