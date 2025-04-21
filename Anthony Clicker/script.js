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
let passiveProductionMultiplier = 1;
let fpcMultiplier = 1;
let burritoMultiplier = 1;
let toiletMultiplier = 1;
let bathroomMultiplier = 1;
let tacoStandsMultiplier = 1;


// updates ui of current values
function update() {
  document.getElementById('farts').innerHTML = "Farts: " + farts.toString();
  fps = (getProductionAmount("burrito") + getProductionAmount("toilet") + getProductionAmount("bathroom") + getProductionAmount("tacoStand"));
  document.getElementById('fpc').innerHTML = "Farts per Click: " + fpc;
  document.getElementById('fps').innerHTML = "Farts per Second: " + fps;
  document.getElementById('buyFpcBtn').innerText = `Buy (Placeholder) (${costOfFpc} farts)`;
  document.getElementById('buyBurritoBtn').innerText = `Buy Burrito (${costOfBurrito} farts)`;  
  document.getElementById('buyToiletBtn').innerText = `Buy Toilet (${costOfToilets} farts)`;
  document.getElementById('buyBathroomBtn').innerText = `Buy Bathroom (${costOfBathroom} farts)`;

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  }
  
  document.getElementById('timePlayed').innerHTML = `Time Wasted: ${formatTime(timePlayed)}`;
  checkToiletUnlock();
  checkBathroomUnlock();
  checkDoubleFlushUnlock();
}

// logic for upgrade buttons 
function getProductionAmount(which) { 
  if (which === "burrito") { // if burrito is pressd 
    return Math.floor(burritosBought * burritoMultiplier * passiveProductionMultiplier); // return burrito bought * burrito multiplier
  } else if (which === "fpc") { // if fpc is pressed 
    return Math.floor((fpcBought + 1) * fpcMultiplier); // return fpc bought * fpc multiplier
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
    fpc += getProductionAmount("fpc");
    farts -= costOfFpc;
    costOfFpc = increasePrice("fpc");
  }
  update();
}
// logic to buy burritos 
function buyBurrito() {
  if (farts >= costOfBurrito) {
    burrito += getProductionAmount("burrito");
    farts -= costOfBurrito;
    costOfBurrito = increasePrice("burrito");
  }
  update();
}
 // logic to buy toilets
function buyToilet() {
  if (farts >= costOfToilets) {
    toilets += getProductionAmount("toilet");
    farts -= costOfToilets;
    costOfToilets = increasePrice("toilet");
  }
  update();
}
// logic to buy bathrooms 
function buyBathroom() {
  if (farts >= costOfBathroom) {
    bathrooms += getProductionAmount("bathroom");
    farts -= costOfBathroom;
    costOfBathroom = increasePrice("bathroom");
  }
  update();
}
// logic to buy taco stands
function buyTacoStand() {
  if (farts >= costOfTacoStands) {
    tacoStands += getProductionAmount("tacoStand");
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
    passiveProductionMultiplier *= 2;
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
  farts += getProductionAmount("fpc");
  totalFarts += getProductionAmount("fpc");
  update();
}
// checks to see if sounds are muted
document.getElementById('muteButton').addEventListener('click', () => {
  effectsMuted = !effectsMuted;
  document.getElementById('muteButton').textContent = effectsMuted ? '🔇 Unmute Farts' : '🔊 Mute Farts';
});

// change anthony icon 
const imageSources = [
  "pictures/anthony.jpg",
  "pictures/anthony2.jpg",
  "pictures/anthony3.jpg",
  "pictures/anthony4.jpg"
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
  farts += fps;
  totalFarts += fps;
  timePlayed += 1; // Increment time played every second
  if (totalFarts >= 2500 && !moreIngredients) {
    document.getElementById("upgradeBurritoBtn").classList.remove("hidden");
  }
  if (totalFarts >= 250000 && !improvedSeats) {
    document.getElementById("upgradeToiletBtn").classList.remove("hidden");
  }
  update();
  requestAnimationFrame(rec);
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

function checkDoubleFlushUnlock() {
  const doubleFlushBtn = document.getElementById("upgradeDoubleFlush");
  if (totalFarts >= 1000000 && doubleFlushBtn.classList.contains("hidden")) {
    doubleFlushBtn.style.display = 'inline-block';
    doubleFlushBtn.classList.remove("hidden");
    doubleFlushBtn.classList.add("fade-in");
  }
}

rec(); // dont know what this does but it makes it update smoother
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
    fpc,
    fpcBought,
    burritosBought,
    toiletsBought,
    bathroomsBought,
    costOfFpc,
    costOfBurrito,
    costOfToilets,
    costOfBathroom,
    moreIngredients,
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
  costOfFpc = data.costOfFpc ?? costOfFpc;
  costOfBurrito = data.costOfBurrito ?? costOfBurrito;
  costOfToilets = data.costOfToilets ?? costOfToilets;
  costOfBathroom = data.costOfBathroom ?? costOfBathroom;
  moreIngredients = data.moreIngredients ?? moreIngredients;
  improvedSeats = data.improvedSeats ?? improvedSeats;
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
});

loadGame(); // Load save game on startup