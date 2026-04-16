/* --- STATE MANAGEMENT --- */
const defaultCards = [
  { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello' },
  { hanzi: '谢谢', pinyin: 'xiè xie', meaning: 'Thank you' },
  { hanzi: '猫', pinyin: 'māo', meaning: 'Cat' },
  { hanzi: '水', pinyin: 'shuǐ', meaning: 'Water' }
];

let state = {
  flashcards: JSON.parse(localStorage.getItem('cards')) || defaultCards,
  coins: parseInt(localStorage.getItem('coins')) || 0,
  pet: localStorage.getItem('pet') || 'hamster',
  petXp: parseInt(localStorage.getItem('petXp')) || 0,
  theme: localStorage.getItem('theme') || 'pink'
};
// Migrate old state
if(state.pet === 'mouse') state.pet = 'hamster';

function saveState() {
  localStorage.setItem('cards', JSON.stringify(state.flashcards));
  localStorage.setItem('coins', state.coins);
  localStorage.setItem('pet', state.pet);
  localStorage.setItem('petXp', state.petXp);
  localStorage.setItem('theme', state.theme);
  updateGlobalUI();
}

/* --- UI HELPERS --- */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function updateGlobalUI() {
  // Update Coins Header (Add small jump animation)
  const coinsDisplay = document.getElementById('global-coins');
  coinsDisplay.textContent = `🪙 ${state.coins}`;
  coinsDisplay.style.transform = 'scale(1.2)';
  setTimeout(() => coinsDisplay.style.transform = 'scale(1)', 200);

  // Set Theme Colors
  document.documentElement.setAttribute('data-theme', state.theme);
  
  // Update Pet Room UI
  const petSprite = document.getElementById('pet-sprite');
  petSprite.className = `sprite-${state.pet}`;
  
  // Calculate level (1 level per 100 XP)
  const level = Math.floor(state.petXp / 100) + 1;
  const currentXp = state.petXp % 100;
  
  document.getElementById('pet-level-text').textContent = `Lv ${level}`;
  document.getElementById('pet-xp-fill').style.width = `${currentXp}%`;

  // Update Dictionary Word Count
  const countEl = document.getElementById('total-words-count');
  if(countEl) countEl.textContent = state.flashcards.length;
}

/* --- NAVIGATION / VIEW ROUTING --- */
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Hide all
    navBtns.forEach(b => b.classList.remove('active'));
    views.forEach(v => v.classList.remove('active'));
    
    // Show active
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

/* --- FLASHCARDS LOGIC --- */
let currentIndex = 0;
const cardEl = document.querySelector('.flashcard');
const btnFlip = document.getElementById('btn-flip');
const guessButtons = document.getElementById('guess-buttons');

function updateCard() {
  cardEl.classList.remove('flipped');
  btnFlip.classList.remove('hidden');
  guessButtons.classList.add('hidden');
  
  setTimeout(() => {
    if(state.flashcards.length === 0) {
      document.getElementById('card-hanzi').textContent = 'Empty';
      document.getElementById('card-pinyin').textContent = 'Please import';
      document.getElementById('card-meaning').textContent = 'cards in setup.';
      return;
    }
    const card = state.flashcards[currentIndex];
    document.getElementById('card-hanzi').textContent = card.hanzi;
    document.getElementById('card-pinyin').textContent = card.pinyin;
    document.getElementById('card-meaning').textContent = card.meaning;
  }, 150); // delay ensures CSS flip animation completes before text changes
}

btnFlip.addEventListener('click', () => {
  if(state.flashcards.length === 0) return;
  cardEl.classList.add('flipped');
  btnFlip.classList.add('hidden');
  guessButtons.classList.remove('hidden');
});

cardEl.addEventListener('click', (e) => {
    // Only flip via card click if it's not already flipped and we aren't clicking the listen button
    if (!cardEl.classList.contains('flipped') && e.target.id !== 'btn-listen') {
        btnFlip.click();
    }
});

// "Knew It" grants 1 coin and goes exactly to the next card.
document.getElementById('btn-right').addEventListener('click', () => {
  state.coins += 1;
  saveState();
  showToast('+1 🪙');
  nextCard();
});

// "Didn't Know" gives no coins.
document.getElementById('btn-wrong').addEventListener('click', () => nextCard());

function nextCard() {
  if(state.flashcards.length === 0) return;
  // Pick random next card (or sequential, here we use sequential for simplicity)
  currentIndex = (currentIndex + 1) % state.flashcards.length;
  updateCard();
}

// Pronunciation via Web Speech API
document.getElementById('btn-listen').addEventListener('click', (e) => {
  e.stopPropagation(); // don't flip card
  if(state.flashcards.length === 0) return;
  const word = state.flashcards[currentIndex].hanzi;
  
  const synthesis = window.speechSynthesis;
  // Cancel previous
  if(synthesis.speaking) { synthesis.cancel(); }
  
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'zh-CN'; // Force Chinese locale
  utterance.rate = 0.9;     // Speak slightly slower for learning
  synthesis.speak(utterance);
});

/* --- PET & SHOP LOGIC --- */
document.querySelectorAll('.shop-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    const isMatcha = btn.dataset.food === 'matcha';
    const xpGain = isMatcha ? 10 : 40;
    
    if (state.coins >= cost) {
      state.coins -= cost;
      state.petXp += xpGain;
      saveState(); // will automatically update UI level bar
      
      // Trigger eating animation
      const sprite = document.getElementById('pet-sprite');
      sprite.classList.remove('pet-eating');
      void sprite.offsetWidth; // force browser layout recalculation
      sprite.classList.add('pet-eating');
      
      showToast(`Fed ${isMatcha ? 'Matcha🍵' : 'Cake🍰'} (+${xpGain} XP)`);
    } else {
      showToast('Not enough coins! Practice more cards.');
    }
  });
});

/* --- MINIGAME LOGIC (MATCH-EM) --- */
const mgContainer = document.getElementById('minigame-container');
const mgHanziCol = document.getElementById('mg-col-hanzi');
const mgMeaningCol = document.getElementById('mg-col-meaning');
let mgSelected = null;
let mgMatches = 0;

document.getElementById('btn-start-game').addEventListener('click', startMinigame);
document.getElementById('btn-restart-game').addEventListener('click', startMinigame);

function startMinigame() {
  if (state.flashcards.length < 4) {
    showToast("Need at least 4 flashcards to play!");
    return;
  }
  
  // Show grid, hide results/start
  mgContainer.classList.remove('hidden');
  document.querySelector('.minigame-header p').classList.add('hidden');
  document.getElementById('btn-start-game').classList.add('hidden');
  document.getElementById('minigame-results').classList.add('hidden');
  
  mgHanziCol.innerHTML = '';
  mgMeaningCol.innerHTML = '';
  mgMatches = 0;
  mgSelected = null;
  
  // Randomize 4 cards
  const shuffled = [...state.flashcards].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  const hanziTiles = [];
  const meaningTiles = [];
  shuffled.forEach((c, idx) => {
    hanziTiles.push({ text: c.hanzi, id: idx });
    meaningTiles.push({ text: c.meaning, id: idx });
  });
  
  // Shuffle all tiles inside their columns
  hanziTiles.sort(() => 0.5 - Math.random());
  meaningTiles.sort(() => 0.5 - Math.random());
  
  // Paint tiles
  hanziTiles.forEach(tile => {
    const div = document.createElement('div');
    div.className = 'mg-card';
    div.textContent = tile.text;
    div.dataset.id = tile.id;
    div.addEventListener('click', () => handleMinigameClick(div));
    mgHanziCol.appendChild(div);
  });

  meaningTiles.forEach(tile => {
    const div = document.createElement('div');
    div.className = 'mg-card';
    div.textContent = tile.text;
    div.dataset.id = tile.id;
    div.addEventListener('click', () => handleMinigameClick(div));
    mgMeaningCol.appendChild(div);
  });
}

function handleMinigameClick(div) {
  if(div.classList.contains('matched')) return; // ignore matched
  
  if (!mgSelected) {
    // First selection
    mgSelected = div;
    div.classList.add('selected');
  } else {
    // Second selection
    if (mgSelected !== div && mgSelected.dataset.id === div.dataset.id) {
      // Correct Match -> Add matched classes
      mgSelected.classList.remove('selected');
      mgSelected.classList.add('matched');
      div.classList.add('matched');
      
      showToast('Match! +1🪙');
      state.coins += 1;
      saveState();
      
      mgMatches += 1;
      // Check Win Condition
      if(mgMatches === 4) {
        setTimeout(() => {
          mgContainer.classList.add('hidden');
          document.getElementById('minigame-results').classList.remove('hidden');
        }, 500);
      }
    } else {
      // Wrong Match
      mgSelected.classList.remove('selected');
      // maybe add a shake animation here if desired
    }
    // reset selection state
    mgSelected = null;
  }
}

/* --- SETTINGS & IMPORT LOGIC --- */

// 1. Theme Selection
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.theme = btn.dataset.theme;
    saveState();
    showToast(`Theme changed!`);
  });
});

// 2. Pet Selection
const petSelect = document.getElementById('pet-select');
petSelect.value = state.pet;
petSelect.addEventListener('change', (e) => {
  state.pet = e.target.value;
  saveState();
  showToast(`Pet changed to ${e.target.value}!`);
});

// 3. Bulk Import Logic
document.getElementById('btn-import').addEventListener('click', () => {
  const text = document.getElementById('import-textarea').value.trim();
  if(!text) return;
  
  const lines = text.split('\n');
  let added = 0;
  
  lines.forEach(line => {
    // Flexible parser: Split by anything connecting ( : or - )
    const delimiters = /[-:]/;
    const parts = line.split(delimiters).map(p => p.trim()).filter(p => p);
    
    if(parts.length >= 2) {
      const hanzi = parts[0];
      let pinyin = '';
      let meaning = '';
      
      // Heuristic: if 3 parts, middle is pinyin. If 2 parts, second is meaning.
      if(parts.length >= 3) {
        pinyin = parts[1];
        meaning = parts[2];
      } else {
        meaning = parts[1];
      }
      
      state.flashcards.push({ hanzi, pinyin, meaning });
      added++;
    }
  });
  
  if (added > 0) {
    saveState();
    showToast(`Successfully added ${added} new cards!`);
    document.getElementById('import-textarea').value = '';
    
    // Jump back to flashcards view automatically
    document.querySelector('.nav-btn[data-target="view-flashcards"]').click();
    
    currentIndex = state.flashcards.length - added; // reset index to start showing new cards
    updateCard(); 
  } else {
    showToast("Format error! Make sure to use - or : as separators.");
  }
});

/* --- INITIALIZATION --- */
init();
function init() {
  updateGlobalUI();
  updateCard();
}
