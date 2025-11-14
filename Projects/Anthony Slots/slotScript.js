const symbols = ['💨', '💩', '👨‍❤️‍💋‍👨', '🍆', '🚿', '💎', '🐄', '7️'];
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
const result = document.getElementById('result');
const coinsDisplay = document.getElementById('coins');
const spinBtn = document.getElementById('spinBtn');
const betInput = document.getElementById('bet');
const betValue = document.getElementById('betValue');
const freeCoinBtn = document.getElementById('freeCoinBtn');
const autoSpinBtn = document.getElementById('autoSpinBtn');
const buyAutoSpinBtn = document.getElementById('buyAutoSpinBtn');
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
const sparkOrigin = document.querySelector('.spark-letter');
const flickerI = document.getElementById('flicker-i');
const letters = document.querySelectorAll('.sign-letter');
const dustCanvas = document.getElementById('dustCanvas');
const dctx = dustCanvas.getContext('2d');
const volumeSlider = document.getElementById('volumeSlider');
const betSlider = document.getElementById("bet");
const betDisplay = document.getElementById("betValue"); // UI for current bet
const toggleBtn = document.getElementById("betModeToggle");
const buyFourthSlotBtn = document.getElementById("buyFourthSlotBtn");
const slot4 = document.getElementById("slot4");


let coins = parseInt(localStorage.getItem('slotCoins') || '10');
let totalSpent = parseInt(localStorage.getItem('totalSpent') || '0');
let autoSpinUnlocked = localStorage.getItem('autoSpinUnlocked') === 'true';
let autoSpinEnabled = false;
let confettiPieces = [];
let intenseFlickerTimeout;
let isSpinning = false;
let isPercentMode = false; // false = fixed amount, true = percentage
let fourthSlotUnlocked = localStorage.getItem('fourthSlotUnlocked') === 'true';


coinsDisplay.textContent = formatNumber(coins);
betInput.max = coins;
betValue.textContent = betInput.value;

betInput.addEventListener('input', () => {
  betValue.textContent = formatNumber(betInput.value);
});

if (fourthSlotUnlocked) {
  slot4.style.display = 'flex';
  buyFourthSlotBtn.style.display = 'none';
}


function getActiveSlots() {
  return fourthSlotUnlocked
    ? [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3'), document.getElementById('slot4')]
    : [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
}


function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateCoins(amount) {
  coins += amount;
  localStorage.setItem('slotCoins', coins);
  coinsDisplay.textContent = formatNumber(coins);
  betInput.max = coins > 0 ? coins : 1;
  if (parseInt(betInput.value) > coins) {
    betInput.value = coins;
    betValue.textContent = coins;
  }
}

function animateSlots() {
  const slots = getActiveSlots();
  return new Promise(resolve => {
    let spins = 10;
    let count = 0;
    const interval = setInterval(() => {
      for (let slot of slots) {
        slot.textContent = getRandomSymbol();
      }
      count++;
      if (count >= spins) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

async function spin() {
  if (isSpinning) return;
  const winsound = document.getElementById('winSound');
  const spinSound = document.getElementById('spinSound');
  const bet = parseInt(betInput.value);
  winsound.volume = volumeSlider.value
  spinSound.volume = volumeSlider.value;

  isSpinning = true;
  if (isNaN(bet) || bet <= 0 || bet > coins) {
    result.textContent = "⚠️ Invalid bet amount!";
    return;
  }
  spinSound.play();
  updateCoins(-bet);
  result.textContent = "🔄 Spinning...";
  await animateSlots();
  isSpinning = false;
  
  const slots = getActiveSlots();
  const slotValues = slots.map(slot => slot.textContent);

 const counts = {};
slotValues.forEach(s => counts[s] = (counts[s] || 0) + 1);

const maxCount = Math.max(...Object.values(counts)); // highest number of matches
const unique = Object.keys(counts).length;

// 🎯 Determine win type
if (maxCount === slotValues.length) {
  // All match (Jackpot)
  let symbol = slotValues[0];
  let multiplier = 15;
  if (symbol === '🍆') multiplier = 18;
  else if (symbol === '💎') multiplier = 22;
  else if (symbol === '7️') multiplier = 75;

  startConfetti();
  updateCoins(bet * multiplier);
  result.textContent = `💰 JACKPOT! +${formatNumber(bet * multiplier)} coins`;
  winSound.play();

} else if (maxCount === 3) {
  // 3 of a kind
  const tripleMultiplier = fourthSlotUnlocked ? 8 : 6;
  updateCoins(bet * tripleMultiplier);
  result.textContent = `✨ Triple Win! +${formatNumber(bet * tripleMultiplier)} coins`;
  winSound.play();
  createConfetti();
   let duration = 3000;
   let startTime = performance.now();

   function animateMiniConfetti(time) {
    let elapsed = time - startTime;
    drawConfetti();
    if (elapsed < duration) {
      requestAnimationFrame(animateMiniConfetti);
    } else {
      confettiPieces = [];
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  requestAnimationFrame(animateMiniConfetti);

} else if (maxCount === 2) {
  // 2 of a kind
  const pairMultiplier = fourthSlotUnlocked ? 4 : 3;
  updateCoins(bet * pairMultiplier);
  result.textContent = `🎉 Small Win! +${formatNumber(bet * pairMultiplier)} coins`;
  winSound.play();

} else {
  // No match
  result.textContent = "❌ Try Again!";
}



  checkCoinStatus();
  updateBetDisplay();
}

async function autoSpinLoop() {
  while (autoSpinEnabled && coins > 0) {
    spin();
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}

autoSpinBtn.addEventListener('click', () => {
  autoSpinEnabled = !autoSpinEnabled;
  if (autoSpinEnabled) autoSpinLoop();
});

// confetti animation

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let confetti of confettiPieces) {
    ctx.fillStyle = confetti.color;
    ctx.save();
    ctx.translate(confetti.x, confetti.y);
    ctx.rotate(confetti.rotation * Math.PI / 180);
    ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size);
    ctx.restore();
    confetti.y += confetti.speedY;
    confetti.x += confetti.speedX;
    confetti.rotation += 5;
  }
}

function startConfetti() {
  createConfetti();
  let duration = 15000; // 15 seconds
  let startTime = performance.now();

  function animateConfetti(time) {
    let elapsed = time - startTime;
    drawConfetti();
    if (elapsed < duration) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiPieces = [];
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  requestAnimationFrame(animateConfetti);
}

// Dust animation

function resizeDust() {
  dustCanvas.width = window.innerWidth;
  dustCanvas.height = window.innerHeight;
}
resizeDust();
window.addEventListener('resize', resizeDust);

class DustParticle {
  constructor() {
    this.reset(true); // initialize fully on screen
  }
  reset(fromTop = false) {
    this.x = Math.random() * dustCanvas.width;
    this.size = 2 + Math.random() * 3;
    this.speedY = 0.3 + Math.random() * 0.5;
    this.speedX = (Math.random() - 0.5) * 0.1;
    this.alpha = 0.1 + Math.random() * 0.15;
    this.life = dustCanvas.height / this.speedY + 20;
    this.age = 0;
    if (fromTop) {
      // Start randomly within the screen vertically to keep all visible at start
      this.y = Math.random() * dustCanvas.height;
    } else {
      // Start just above screen for respawn
      this.y = -10 - Math.random() * 50;
    }
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.age++;
    if (this.y > dustCanvas.height) {
      this.reset(false);
    }
  }
  draw() {
    dctx.fillStyle = `rgba(150, 150, 150, ${this.alpha})`;
    dctx.beginPath();
    dctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    dctx.fill();
  }
}

const dustParticles = [];
const maxDust = 30;

for (let i = 0; i < maxDust; i++) {
  dustParticles.push(new DustParticle());
}

function animateDust() {
  dctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
  dustParticles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateDust);
}

animateDust();

// I Flicker animation

function randomFlicker() {
  // Turn "i" off
  const dimLevel = Math.random() * 0.8 + 0.2; // 0.2–1
  flickerI.style.opacity = dimLevel.toFixed(2);

  // Wait a jittery amount of time before next flicker
  const next = Math.random() * 200 + 50; // 50ms to 250ms
  setTimeout(randomFlicker, next);
}
randomFlicker();

// Dim flicker when clicked

flickerI.addEventListener('click', () => {
  // Clear existing flicker loop temporarily
  clearTimeout(intenseFlickerTimeout);

  let flickerCount = 0;
  function intenseFlicker() {
    const dimLevel = Math.random() * 0.6 + 0.1; // More dim range
    flickerI.style.opacity = dimLevel.toFixed(2);

    flickerCount++;
    if (flickerCount < 15) {  
      setTimeout(intenseFlicker, Math.random() * 60 + 30); // Faster flickers
    } 
  }

  intenseFlicker();
});

letters.forEach(letter => {
  letter.addEventListener('click', () => {
    flickerAllLetters();
  });
});

function flickerAllLetters() {
  let flickerCount = 0;

  function intenseFlicker() {
    letters.forEach(letter => {
      const dimLevel = Math.random() * 0.6 + 0.2; // stays dim, not fully off
      letter.style.opacity = dimLevel.toFixed(2);

      letter.style.textShadow = `
        0 0 5px #FFD700,
        0 0 10px #FFD700,
        0 0 20px #FFD700,
        0 0 30px #FFD700,
        0 0 40px #FFD700,
        0 0 70px #FFD700,
        0 0 80px #FFD700;
      `;
    });

    flickerCount++;
    if (flickerCount < 15) {
      setTimeout(intenseFlicker, Math.random() * 70 + 30); // Fast flicker
    } else {
      resetFlicker();
    }
  }

  function resetFlicker() {
    letters.forEach(letter => {
      letter.style.opacity = "1";
      letter.style.textShadow = `
        0 0 5px #FFD700,
        0 0 10px #FFD700,
        0 0 20px #FFD700,
        0 0 30px #FFD700,
        0 0 40px #FFD700,
        0 0 70px #FFD700,
        0 0 80px #FFD700;
      `;
    });
  }

  intenseFlicker();
}

buyAutoSpinBtn.addEventListener('click', () => {
  if (coins >= 1000 && !autoSpinUnlocked) {
    updateCoins(-1000);
    autoSpinUnlocked = true;
    localStorage.setItem('autoSpinUnlocked', 'true');
    result.textContent = "✅ Auto Spin unlocked!";
    buyAutoSpinBtn.style.display = 'none';
    autoSpinBtn.style.display = 'inline-block';
  } else {
    result.textContent = "❌ Not enough coins to unlock Auto Spin!";
  }
});

buyFourthSlotBtn.addEventListener('click', () => {
  if (coins >= 2000 && !fourthSlotUnlocked) {
    updateCoins(-2000);
    fourthSlotUnlocked = true;
    localStorage.setItem('fourthSlotUnlocked', 'true');
    result.textContent = "✅ 4th Slot unlocked! Better odds activated!";
    buyFourthSlotBtn.style.display = 'none';
    slot4.style.display = 'flex';
  } else if (fourthSlotUnlocked) {
    result.textContent = "🎰 You already own the 4th slot!";
  } else {
    result.textContent = "❌ Not enough coins to unlock 4th slot!";
  }
});


freeCoinBtn.addEventListener('click', async () => {
  result.textContent = "📺 Watching ad...";
  freeCoinBtn.disabled = true;
  await new Promise(resolve => setTimeout(resolve, 3000));
  updateCoins(1);
  result.textContent = "You got 1 free coin";
  freeCoinBtn.disabled = false;
  checkCoinStatus();
});

function checkCoinStatus() {
  if (coins <= 0) {
    freeCoinBtn.style.display = 'inline-block';
  } else {
    freeCoinBtn.style.display = 'none';
  }
}


if (autoSpinUnlocked) {
  buyAutoSpinBtn.style.display = 'none';
  autoSpinBtn.style.display = 'inline-block';
}

function formatNumber(num) {
  const suffixes = [
    [1e303, "centillion"],
    [1e300, "novenonagintillion"],
    [1e297, "octononagintillion"],
    [1e294, "septenonagintillion"],
    [1e291, "sexnonagintillion"],
    [1e288, "quinquanonagintillion"],
    [1e285, "quattuornonagintillion"],
    [1e282, "trenonagintillion"],
    [1e279, "duononagintillion"],
    [1e276, "unononagintillion"],
    [1e273, "nonagintillion"],
    [1e270, "novenonagintillion"],
    [1e267, "octooctogintillion"],
    [1e264, "septenoctogintillion"],
    [1e261, "sexoctogintillion"],
    [1e258, "quinquaoctogintillion"],
    [1e255, "quattuoroctogintillion"],
    [1e252, "treoctogintillion"],
    [1e249, "duooctogintillion"],
    [1e246, "unoctogintillion"],
    [1e243, "octogintillion"],
    [1e240, "novenseptuagintillion"],
    [1e237, "octoseptuagintillion"],
    [1e234, "septenseptuagintillion"],
    [1e231, "sexseptuagintillion"],
    [1e228, "quinquaseptuagintillion"],
    [1e225, "quattuorseptuagintillion"],
    [1e222, "treseptuagintillion"],
    [1e219, "duoseptuagintillion"],
    [1e216, "unoseptuagintillion"],
    [1e213, "septuagintillion"],
    [1e210, "novensexagintillion"],
    [1e207, "octosexagintillion"],
    [1e204, "septensexagintillion"],
    [1e201, "sexsexagintillion"],
    [1e198, "quinquasexagintillion"],
    [1e195, "quattuorsexagintillion"],
    [1e192, "tresexagintillion"],
    [1e189, "duosexagintillion"],
    [1e186, "unosexagintillion"],
    [1e183, "sexagintillion"],
    [1e180, "novenquinquagintillion"],
    [1e177, "octoquinquagintillion"],
    [1e174, "septenquinquagintillion"],
    [1e171, "sexquinquagintillion"],
    [1e168, "quinquaquinquagintillion"],
    [1e165, "quattuorquinquagintillion"],
    [1e162, "trequinquagintillion"],
    [1e159, "duoquinquagintillion"],
    [1e156, "unoquinquagintillion"],
    [1e153, "quinquagintillion"],
    [1e150, "novenquadragintillion"],
    [1e147, "octoquadragintillion"],
    [1e144, "septenquadragintillion"],
    [1e141, "sexquadragintillion"],
    [1e138, "quinquaquadragintillion"],
    [1e135, "quattuorquadragintillion"],
    [1e132, "trequadragintillion"],
    [1e129, "duoquadragintillion"],
    [1e126, "unoquadragintillion"],
    [1e123, "quadragintillion"],
    [1e120, "noventrigintillion"],
    [1e117, "octotrigintillion"],
    [1e114, "septentrigintillion"],
    [1e111, "sextrigintillion"],
    [1e108, "quinquatrigintillion"],
    [1e105, "quattuortrigintillion"],
    [1e102, "tretrigintillion"],
    [1e99, "duotrigintillion"],
    [1e96, "unotrigintillion"],
    [1e93, "trigintillion"],
    [1e90, "novemvigintillion"],
    [1e87, "octovigintillion"],
    [1e84, "septenvigintillion"],
    [1e81, "sexvigintillion"],
    [1e78, "quinquavigintillion"],
    [1e75, "quattuorvigintillion"],
    [1e72, "trevigintillion"],
    [1e69, "duovigintillion"],
    [1e66, "unvigintillion"],
    [1e63, "vigintillion"],
    [1e60, "novemdecillion"],
    [1e57, "octodecillion"],
    [1e54, "septendecillion"],
    [1e51, "sexdecillion"],
    [1e48, "quindecillion"],
    [1e45, "quattuordecillion"],
    [1e42, "tredecillion"],
    [1e39, "duodecillion"],
    [1e36, "undecillion"],
    [1e33, "decillion"],
    [1e30, "nonillion"],
    [1e27, "octillion"],
    [1e24, "septillion"],
    [1e21, "sextillion"],
    [1e18, "quintillion"],
    [1e15, "quadrillion"],
    [1e12, "trillion"],
    [1e9, "billion"],
    [1e6, "million"],
    [1e3, "k"]
  ];

  const suffix = suffixes.find(([value]) => num >= value);
  return suffix ? (num / suffix[0]).toFixed(3) + " " + suffix[1] : num.toString();
}



function createSparkBurst() {
  for (let i = 0; i < 3; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.background = Math.random() > 0.5 ? 'orange' : 'yellow';

    // Starting position relative to the letter
    spark.style.left = '5px';
    spark.style.top = '60px';

    // Physics variables
    const angle = Math.random() * 2 * Math.PI; // 360°
    const speed = Math.random() * 3 + 2;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed + 2,  // give it a slight downward push
    };
    let x = 0;
    let y = 0;
    let gravity = 0.15;
    let opacity = 1;

    sparkOrigin.appendChild(spark);

    function animate() {
    velocity.y += gravity;      // accelerate down
    x += velocity.x;
    y += velocity.y;
    opacity -= 0.015;

    spark.style.transform = `translate(${x}px, ${y}px)`;
    spark.style.opacity = opacity;

    if (opacity > 0 && y < window.innerHeight) {
      requestAnimationFrame(animate);
    } else {
      spark.remove();
    }
    }
    requestAnimationFrame(animate);
  }
}

// Trigger every 6 seconds randomly
setInterval(() => {
  if (Math.random() < 0.6) createSparkBurst();
}, 6000);

document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');

  function startMusic() {
    bgMusic.volume = volumeSlider.value
    bgMusic.play().catch(() => {
      // Autoplay was blocked
      console.log("User interaction required to start music.");
    });
    document.removeEventListener('click', startMusic);
  }

  // Start music after first user click
  document.addEventListener('click', startMusic);
});

document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');
  // Set initial volume
  bgMusic.volume = volumeSlider.value;

  // Change volume on slider input
  volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value;
  });

  // Start music after first click (browser autoplay fix)
  function startMusic() {
    bgMusic.play().catch(() => {
      console.log("User interaction required to start music.");
    });
    document.removeEventListener('click', startMusic);
  }

  document.addEventListener('click', startMusic);
});


spinBtn.addEventListener('click', spin);
document.addEventListener('keydown', function(event) {
    // Check if the spacebar was pressed
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling
        spin(); // Call your spin function
    }
});

function updateSliderBounds() {
    if (isPercentMode) {
        betSlider.min = 1;
        betSlider.max = 100;
        betSlider.step = 1;
    } else {
        betSlider.min = 1;
        betSlider.max = coins; // or whatever your coin var is
        betSlider.step = 1;
    }
}

// Update bet amount displayed
function updateBetDisplay() {
  currentBet = parseInt(betSlider.value);
  betDisplay.textContent = `${formatNumber(currentBet)} coins, (${(currentBet / coins * 100).toFixed(2)}%)`;
}

// Listen for slider changes
betSlider.addEventListener("input", updateBetDisplay);


checkCoinStatus();
updateSliderBounds();
updateBetDisplay();
