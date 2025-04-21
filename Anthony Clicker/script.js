// defines variables 
let startTime = Date.now();
let timePlayed = 0; // in seconds

let currentImageIndex = 0;
let effectsMuted = false;

let farts = 0;
let totalFarts = 0;

let fpcBought = 0;
let burritosBought = 0;
let toiletsBought = 0;
let bathroomsBought = 0;
let tacoStandsBought = 0;
let moreIngredients = false;
let improvedSeats = false;
let doubleFlush = false;

let burrito = 0;
let costOfBurrito = 10;

let fpc = 1;
let costOfFpc = 10;

let toilets = 0;
let costOfToilets = 10000;

let bathrooms = 0;
let costOfBathroom = 25000;

let tacoStands = 0;
let costOfTacoStands = 100000;

let globalProductionMultiplier = 1;
let clickProductionMultiplier = 1;
let passiveProductionMultiplier = 1;
let fpcMultiplier = 1;
let burritoMultiplier = 1;
let toiletMultiplier = 1;
let bathroomMultiplier = 1;
let tacoStandsMultiplier = 1;


// updates ui of current values
function update() {
  document.getElementById('farts').innerHTML = "Farts: " + farts.toString();
  fps = ((getProductionAmount("burrito") + getProductionAmount("toilet") + getProductionAmount("bathroom") + getProductionAmount("tacoStand")) * globalProductionMultiplier);
  document.getElementById('fpc').innerHTML = "Farts per Click: " + fpc;
  document.getElementById('fps').innerHTML = "Farts per Second: " + fps;
  document.getElementById('buyFpcBtn').innerText = `Buy (Placeholder) (${costOfFpc} farts)`;
  document.getElementById('buyBurritoBtn').innerText = `Buy Burrito (${costOfBurrito} farts)`;  
  document.getElementById('buyToiletBtn').innerText = `Buy Toilet (${costOfToilets} farts)`;
  document.getElementById('buyBathroomBtn').innerText = `Buy Bathroom (${costOfBathroom} farts)`;
  document.getElementById('buyTacoStandBtn').innerText = `Buy Taco Stand (${costOfTacoStands} farts)`;

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  }
  
  document.getElementById('timePlayed').innerHTML = `Time Wasted: ${formatTime(timePlayed)}`;
  checkToiletUnlock();
  checkBathroomUnlock();
  checkTacoStandUnlock();
}

// logic for upgrade buttons 
function getProductionAmount(which) { 
  if (which === "burrito") { // if burrito is pressd 
    return Math.floor(1 * (burritosBought * burritoMultiplier * passiveProductionMultiplier)); // return burrito bought * burrito multiplier
  } else if (which === "fpc") { // if fpc is pressed 
    return Math.floor(1 * ((fpcBought + 1) * fpcMultiplier * clickProductionMultiplier)); // return fpc bought * fpc multiplier
  } else if (which === "toilet") { // if toilet is pressed 
    return Math.floor(100 * (toiletsBought * toiletMultiplier * passiveProductionMultiplier)); // return toilets bought * toilet multiplier
  } else if (which === "bathroom") { // if bathroom is pressed
    return Math.floor(250 * (bathroomsBought * bathroomMultiplier * passiveProductionMultiplier));  // return bathrooms bought * bathroom multiplier
  } else if (which === "tacoStand") { // if taco stand is pressed
    return Math.floor(750 * (tacoStandsBought * tacoStandsMultiplier * passiveProductionMultiplier)); // return taco stands bought * taco stand multiplier
  }
  return 0; // fallback to prevent an error from being flagged 
}

// logic to buy buildings
function buyFpc() {
  if (farts >= costOfFpc) {
    fpc += 1;
    farts -= costOfFpc;
    costOfFpc = increasePrice("fpc");
  }
  update();
}
// logic to buy burritos 
function buyBurrito() {
  if (farts >= costOfBurrito) {
    burrito += 1;
    farts -= costOfBurrito;
    costOfBurrito = increasePrice("burrito");
  }
  update();
}
// logic to buy toilets
function buyToilet() {
  if (farts >= costOfToilets) {
    toilets += 1;
    farts -= costOfToilets;
    costOfToilets = increasePrice("toilet");
  }
  update();
}
// logic to buy bathrooms 
function buyBathroom() {
  if (farts >= costOfBathroom) {
    bathrooms += 1;
    farts -= costOfBathroom;
    costOfBathroom = increasePrice("bathroom");
  }
  update();
}
// logic to buy taco stands
function buyTacoStand() {
  if (farts >= costOfTacoStands) {
    tacoStands += 1;
    farts -= costOfTacoStands;
    costOfTacoStands = increasePrice("tacoStand");
  }
  update();
}

// logic to buy upgrades
function buyBurritoUpgrade() {
  if (farts >= 2500 && !moreIngredients) {
    farts -= 2500;
    burritoMultiplier = 2;
    moreIngredients = true;
    document.getElementById("upgradeBurritoBtn").remove();
    update();
  }
}
function buyToiletUpgrade() {
  if (farts >= 250000 && !improvedSeats) {
    farts -= 250000;
    toiletMultiplier = 2;
    improvedSeats = true;
    document.getElementById("upgradeToiletBtn").remove();
    update();
  }
}

function buyDoubleFlush() {
  if (farts >= 1000000 && !doubleFlush) {
    farts -= 1000000;
    globalProductionMultiplier *= 2;
    doubleFlush = true;
    document.getElementById("upgradeDoubleFlush").remove();
    update();
  }
}

// making anthony jiggle
async function moreU() {
  const icon = document.getElementById('clickericon');
  if (!effectsMuted) {
    const sounds = [
      document.getElementById('fart1'),
      document.getElementById('fart2'),
      document.getElementById('fart3')
    ];
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    sound.currentTime = 0;
    sound.play();
  }

  icon.style.transform = 'scale(0.95)';
  await new Promise(resolve => setTimeout(resolve, 100));
  icon.style.transform = 'scale(1)';
  
  // Update farts based on farts per click (fpc)
  farts += getProductionAmount("fpc"); // Ensure this returns the correct value
  totalFarts += getProductionAmount("fpc"); // Update total farts
  update(); // Update the UI
}
// checks to see if sounds are muted
document.getElementById('muteButton').addEventListener('click', () => {
  effectsMuted = !effectsMuted;
  document.getElementById('muteButton').textContent = effectsMuted ? '🔇 Unmute Farts' : '🔊 Mute Farts';
});

// change anthony icon 
const imageSources = [
  "Anthony Clicker/Pictures/anthony.jpg",
  "Anthony Clicker/Pictures/anthony2.jpg",
  "Anthony Clicker/Pictures/anthony3.jpg",
  "Anthony Clicker/Pictures/anthony4.jpg"
];
function cycleImage() {
  currentImageIndex = (currentImageIndex + 1) % imageSources.length;
  document.getElementById('clickericon').src = imageSources[currentImageIndex];
}

// golden ball
function spawnGoldenBall() {
  const goldenBall = document.getElementById('goldenBall');
  const maxX = window.innerWidth - 60;
  const maxY = window.innerHeight - 60;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  goldenBall.style.left = `${x}px`;
  goldenBall.style.top = `${y}px`;
  goldenBall.classList.remove('hidden', 'spin');
  goldenBall.classList.add('show', 'spin');

  // Fade out after 10s
  setTimeout(() => {
    goldenBall.classList.remove('show', 'spin');
  }, 10000);

  // Hide fully after fade-out completes
  setTimeout(() => {
    goldenBall.classList.add('hidden');
  }, 10500);
}


function activateGoldenBall() { // When clicked
  document.getElementById('bowlingSound').play();
  document.getElementById('goldenBall').classList.add('hidden');
  
  if (Math.random() < 0.2) { //  20% chance of giving 3x boost 
    activateProductionBoost();
    showBonusText("🔥 3x Production Boost!");
  } else {
    giveFartBonus(); // else give bonus farts 
    showBonusText("💨 Bonus Farts!");
  }
}
function showBonusText(message) {
  const bonusText = document.getElementById('bonusText');
  bonusText.textContent = message;

  // Fade in
  bonusText.classList.remove('hidden'); // Ensure it's visible before fading in
  bonusText.classList.remove('fade-out'); // Ensure it's not fading out before
  bonusText.classList.add('show'); // Trigger the fade-in

  // Fade out after a short delay
  setTimeout(() => {
    bonusText.classList.add('fade-out'); // Start fading out
  }, 2000); // Fade out after 2 seconds
}
function activateProductionBoost() {
  globalProductionMultiplier *= 3;
  update();
  setTimeout(() => {
    globalProductionMultiplier /= 3;
    update();
  }, 60000);
}

function giveFartBonus() {
	const bonus = Math.floor(farts * 0.15); // 15% of balance
	farts += bonus;
	update();
}

function scheduleGoldenBall() {
  const delay = 180000 + Math.random() * 120000; // for 3 to 5 minutes should be 180000, 120000
  setTimeout(() => {
    spawnGoldenBall();
    scheduleGoldenBall(); // schedule next one after this
  }, delay);
}

// Call this once on page load
scheduleGoldenBall();

// adds farts every second
async function rec() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Calculate fps based on current production amounts
  let fps = (getProductionAmount("burrito") + getProductionAmount("toilet") + getProductionAmount("bathroom") + getProductionAmount("tacoStand")) * globalProductionMultiplier;

  // Update farts with fps
  farts += fps; // This should correctly add fps to farts
  totalFarts += fps; // Update total farts
  timePlayed += 1; // Increment time played every second

  // Check for upgrades
  if (totalFarts >= 2500 && !moreIngredients) {
    document.getElementById("upgradeBurritoBtn").classList.remove("hidden");
  }
  if (totalFarts >= 250000 && !improvedSeats) {
    document.getElementById("upgradeToiletBtn").classList.remove("hidden");
  }
  if (totalFarts >= 1000000 && !doubleFlush) {
    document.getElementById("upgradeDoubleFlush").classList.remove("hidden");
  }

  update(); // Update the UI
  requestAnimationFrame(rec); // Call rec again for the next second
}

// checks to see if building should be unlocked and unlocks it
function checkToiletUnlock() {
  const toiletBtn = document.getElementById("buyToiletBtn");
  if (totalFarts >= 7500 && toiletBtn.classList.contains("hidden")) {
    toiletBtn.style.display = 'inline-block';
    toiletBtn.classList.remove("hidden");
    toiletBtn.classList.add("fade-in");
  }
}
function checkBathroomUnlock() {
  const bathroomBtn = document.getElementById("buyBathroomBtn");
  if (totalFarts >= 100000 && bathroomBtn.classList.contains("hidden")) {
    bathroomBtn.style.display = 'inline-block';
    bathroomBtn.classList.remove("hidden");
    bathroomBtn.classList.add("fade-in");
  }
}

function checkTacoStandUnlock() {
  const tacoStandBtn = document.getElementById("buyTacoStandBtn");
  if (totalFarts >= 1000000 && tacoStandBtn.classList.contains("hidden")) {
    tacoStandBtn.style.display = 'inline-block';
    tacoStandBtn.classList.remove("hidden");
    tacoStandBtn.classList.add("fade-in");
  }
}

rec(); // dont know what this does but it makes it update smoother?
function getBuildingCost(baseCost, amountOwned, multiplier = 1.1) { // Scales by 10%
  return Math.floor(baseCost * Math.pow(multiplier, amountOwned));
  timePlayed += 1; // Increment time played every second
}

// increasing price gradually by 2%
function increasePrice(which) {
  if (which === "burrito") {
    burritosBought++;
    return getBuildingCost(10, burritosBought, 1.02);
  } else if (which === "fpc") {
    fpcBought++;
    return getBuildingCost(10, fpcBought, 1.02);
  } else if (which === "toilet") {
    toiletsBought++;
    return getBuildingCost(10000, toiletsBought, 1.02);
  } else if (which == "bathroom") {
    bathroomsBought++;
    return getBuildingCost(25000, bathroomsBought, 1.02)
  } else if (which == "tacoStand") {
    tacoStandsBought++;
    return getBuildingCost(100000, tacoStandsBought, 1.02)
  }
}
// time saving function for time played
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

// checks to see if sounds are muted
document.getElementById('muteButton').addEventListener('click', () => {
  effectsMuted = !effectsMuted;
  localStorage.setItem("effectsMuted", JSON.stringify(effectsMuted)); // Persist mute state
  document.getElementById('muteButton').textContent = effectsMuted ? '🔇 Unmute Farts' : '🔊 Mute Farts';
});

// save game function, make sure to add variables to this list if you add more
function saveGame() {
  const saveData = {
    effectsMuted,
    timePlayed,
    currentImageIndex,
    farts,
    totalFarts,
    burrito,
    fpc,
    fpcBought,
    burritosBought,
    toiletsBought,
    bathroomsBought,
    tacoStandsBought,
    costOfFpc,
    costOfBurrito,
    costOfToilets,
    costOfBathroom,
    moreIngredients,
    doubleFlush,
    improvedSeats,
    globalProductionMultiplier,
    burritoMultiplier,
    toiletMultiplier,
    bathroomMultiplier
  };
  localStorage.setItem('fartGameSave', JSON.stringify(saveData));
  const msg = document.getElementById('saveMessage');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 2000); // hides after 2 seconds
}

function loadGame() {
  const save = localStorage.getItem('fartGameSave');
  if (!save) return;
  const data = JSON.parse(save);

  effectsMuted = data.effectsMuted ?? false;
  document.getElementById('muteButton').textContent = effectsMuted ? '🔇 Unmute Farts' : '🔊 Mute Farts';
  timePlayed = data.timePlayed ?? 0;
  currentImageIndex = data.currentImageIndex ?? currentImageIndex;
  document.getElementById('clickericon').src = imageSources[currentImageIndex];
  farts = data.farts ?? farts;
  totalFarts = data.totalFarts ?? totalFarts;
  fpc = data.fpc ?? fpc;
  fpcBought = data.fpcBought ?? fpcBought;
  burritosBought = data.burritosBought ?? burritosBought;
  toiletsBought = data.toiletsBought ?? toiletsBought;
  bathroomsBought = data.bathroomsBought ?? bathroomsBought;
  tacoStandsBought = data.tacoStandsBought ?? tacoStandsBought;
  costOfFpc = data.costOfFpc ?? costOfFpc;
  costOfBurrito = data.costOfBurrito ?? costOfBurrito;
  costOfToilets = data.costOfToilets ?? costOfToilets;
  costOfBathroom = data.costOfBathroom ?? costOfBathroom;
  moreIngredients = data.moreIngredients ?? moreIngredients;
  improvedSeats = data.improvedSeats ?? improvedSeats;
  doubleFlush = data.doubleFlush ?? doubleFlush;
  globalProductionMultiplier = data.globalProductionMultiplier ?? globalProductionMultiplier;
  burritoMultiplier = data.burritoMultiplier ?? burritoMultiplier;
  toiletMultiplier = data.toiletMultiplier ?? toiletMultiplier;
  bathroomMultiplier = data.bathroomMultiplier ?? bathroomMultiplier;

  update();
}


// Call update regularly
setInterval(update, 1000); // Update every second
setInterval(saveGame, 30000); // Auto-save every 30 sec
// Event listeners
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goldenBall').addEventListener('click', activateGoldenBall);
  document.getElementById('clickericon').addEventListener('click', moreU);
  document.getElementById('muteButton').addEventListener('click', () => {
    effectsMuted = !effectsMuted;
    document.getElementById('muteButton').textContent = effectsMuted ? '🔇 Unmute Farts' : '🔊 Mute Farts';
  });
  document.getElementById('saveButton').addEventListener('click', saveGame);
  document.getElementById("deleteSaveButton").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete your save?")) {
      localStorage.removeItem("fartGameSave");
  
      // Reset all relevant variables to their initial values
      farts = 0;
      totalFarts = 0;
      timePlayed = 0;
      currentImageIndex = 0;
      effectsMuted = false;
      burritosBought = 0;
      fpcBought = 0;
      toiletsBought = 0;
      bathroomsBought = 0;
      tacoStandsBought = 0;
      moreIngredients = false;
      improvedSeats = false;
      doubleFlush = false;
      burrito = 0;
      fpc = 1;
      costOfBurrito = 10;
      costOfFpc = 10;
      toilets = 0;
      costOfToilets = 10000;
      bathrooms = 0;
      costOfBathroom = 25000;
      tacoStands = 0;
      costOfTacoStands = 100000;
      globalProductionMultiplier = 1;
      clickProductionMultiplier = 1;
      passiveProductionMultiplier = 1;
      fpcMultiplier = 1;
      burritoMultiplier = 1;
      toiletMultiplier = 1;
      bathroomMultiplier = 1;
      tacoStandsMultiplier = 1;
  
      // Reload the page to reset the game state
      location.reload(); 
    }
  });
  
  document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("bgMusic").play();
  });
});

loadGame(); // Load save game on startup