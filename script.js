
    setInterval(function () {
  document.querySelector("#timeElement").innerHTML = "<strong>" + new Date().toLocaleString("en-CA") + "</strong>" }, 1000);

  // Make the DIV element draggable:
dragElement(document.getElementById("welcome"));  
dragElement(document.getElementById("notes"));
dragElement(document.getElementById("notesopen"));

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

    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
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
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  element.style.top = "50%"
  element.style.left = "50%"
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

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
}

