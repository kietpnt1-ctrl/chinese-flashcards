/* --- STATE MANAGEMENT --- */
const defaultCards = {
  hsk1: [
    { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello' },
    { hanzi: '谢谢', pinyin: 'xiè xie', meaning: 'Thank you' },
    { hanzi: '猫', pinyin: 'māo', meaning: 'Cat' },
    { hanzi: '水', pinyin: 'shuǐ', meaning: 'Water' },
    { hanzi: '我', pinyin: 'wǒ', meaning: 'I, me' },
    { hanzi: '你', pinyin: 'nǐ', meaning: 'You' },
    { hanzi: '是', pinyin: 'shì', meaning: 'To be, yes' },
    { hanzi: '有', pinyin: 'yǒu', meaning: 'To have' },
    { hanzi: '和', pinyin: 'hé', meaning: 'And' },
    { hanzi: '好', pinyin: 'hǎo', meaning: 'Good' }
  ],
  hsk2: [
    { hanzi: '准备', pinyin: 'zhǔn bèi', meaning: 'Prepare' },
    { hanzi: '事情', pinyin: 'shì qing', meaning: 'Thing, matter' },
    { hanzi: '但是', pinyin: 'dàn shì', meaning: 'But, however' },
    { hanzi: '希望', pinyin: 'xī wàng', meaning: 'Hope, wish' },
    { hanzi: '问题', pinyin: 'wèn tí', meaning: 'Question, problem' },
    { hanzi: '因为', pinyin: 'yīn wèi', meaning: 'Because' },
    { hanzi: '所以', pinyin: 'suǒ yǐ', meaning: 'Therefore' },
    { hanzi: '可能', pinyin: 'kě néng', meaning: 'Maybe, possible' },
    { hanzi: '觉得', pinyin: 'jué de', meaning: 'To feel, think' },
    { hanzi: '找到', pinyin: 'zhǎo dào', meaning: 'To find' }
  ],
  hsk3: [
    { hanzi: '虽然', pinyin: 'suī rán', meaning: 'Although' },
    { hanzi: '当然', pinyin: 'dāng rán', meaning: 'Of course' },
    { hanzi: '注意', pinyin: 'zhù yì', meaning: 'Pay attention' },
    { hanzi: '影响', pinyin: 'yǐng xiǎng', meaning: 'Influence, affect' },
    { hanzi: '发现', pinyin: 'fā xiàn', meaning: 'To discover' },
    { hanzi: '过去', pinyin: 'guò qù', meaning: 'Past' },
    { hanzi: '如果', pinyin: 'rú guǒ', meaning: 'If' },
    { hanzi: '必须', pinyin: 'bì xū', meaning: 'Must' },
    { hanzi: '认为', pinyin: 'rèn wéi', meaning: 'To think' },
    { hanzi: '习惯', pinyin: 'xí guàn', meaning: 'Habit' }
  ],
  hsk4: [
    { hanzi: '负责', pinyin: 'fù zé', meaning: 'Responsible for' },
    { hanzi: '继续', pinyin: 'jì xù', meaning: 'To continue' },
    { hanzi: '完全', pinyin: 'wán quán', meaning: 'Completely' },
    { hanzi: '确实', pinyin: 'què shí', meaning: 'Indeed, really' },
    { hanzi: '否则', pinyin: 'fǒu zé', meaning: 'Otherwise' },
    { hanzi: '甚至', pinyin: 'shèn zhì', meaning: 'Even' },
    { hanzi: '大概', pinyin: 'dà gài', meaning: 'Probably' },
    { hanzi: '经验', pinyin: 'jīng yàn', meaning: 'Experience' },
    { hanzi: '由于', pinyin: 'yóu yú', meaning: 'Due to' },
    { hanzi: '调查', pinyin: 'diào chá', meaning: 'Investigate' }
  ],
  hsk5: [
    { hanzi: '尽量', pinyin: 'jǐn liàng', meaning: 'As much as possible' },
    { hanzi: '偶尔', pinyin: 'ǒu ěr', meaning: 'Occasionally' },
    { hanzi: '仿佛', pinyin: 'fǎng fú', meaning: 'As if' },
    { hanzi: '把握', pinyin: 'bǎ wò', meaning: 'Grasp, seize' },
    { hanzi: '依然', pinyin: 'yī rán', meaning: 'Still, as before' },
    { hanzi: '难道', pinyin: 'nán dào', meaning: 'Don\'t tell me...' },
    { hanzi: '简直', pinyin: 'jiǎn zhí', meaning: 'Simply' },
    { hanzi: '亲自', pinyin: 'qīn zì', meaning: 'Personally' },
    { hanzi: '究竟', pinyin: 'jiū jìng', meaning: 'After all' },
    { hanzi: '逐渐', pinyin: 'zhú jiàn', meaning: 'Gradually' }
  ],
  hsk6: [
    { hanzi: '渊博', pinyin: 'yuān bó', meaning: 'Profound (knowledge)' },
    { hanzi: '蕴藏', pinyin: 'yùn cáng', meaning: 'Contain, hold' },
    { hanzi: '琢磨', pinyin: 'zhuó mó', meaning: 'Ponder, think over' },
    { hanzi: '致力于', pinyin: 'zhì lì yú', meaning: 'Devote oneself to' },
    { hanzi: '妥善', pinyin: 'tuǒ shàn', meaning: 'Appropriate, proper' },
    { hanzi: '茫茫', pinyin: 'máng máng', meaning: 'Boundless, vast' },
    { hanzi: '徘徊', pinyin: 'pái huái', meaning: 'Pace back and forth' },
    { hanzi: '敏锐', pinyin: 'mǐn ruì', meaning: 'Keen, sharp' },
    { hanzi: '凝聚', pinyin: 'níng jù', meaning: 'Coagulate' },
    { hanzi: '领略', pinyin: 'lǐng luè', meaning: 'Realize, taste' }
  ],
  custom: []
};

let state = {
  decks: JSON.parse(localStorage.getItem('decks')) || defaultCards,
  activeDeck: localStorage.getItem('activeDeck') || 'all',
  coins: parseInt(localStorage.getItem('coins')) || 0,
  pet: localStorage.getItem('pet') || 'hamster',
  petXp: parseInt(localStorage.getItem('petXp')) || 0,
  theme: localStorage.getItem('theme') || 'pink'
};

// Migrate old state
if(state.pet === 'mouse') state.pet = 'hamster';
if(state.pet === 'bird') state.pet = 'penguin';

// Migrate existing v1 cards to decks
if(localStorage.getItem('cards') && !localStorage.getItem('decks')) {
  state.decks.custom = JSON.parse(localStorage.getItem('cards'));
  localStorage.removeItem('cards');
}

function getCurrentCards() {
  if(state.activeDeck === 'all') return Object.values(state.decks).flat();
  return state.decks[state.activeDeck] || [];
}

const deckSelect = document.getElementById('deck-select');
deckSelect.addEventListener('change', (e) => {
  state.activeDeck = e.target.value;
  saveState();
  currentIndex = 0;
  updateCard();
  // Restart active minigames context
  if(!document.getElementById('mg-match-em').classList.contains('hidden')) startMinigame();
  if(!document.getElementById('mg-listen').classList.contains('hidden')) startListenGame();
});

function saveState() {
  localStorage.setItem('decks', JSON.stringify(state.decks));
  localStorage.setItem('activeDeck', state.activeDeck);
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
  const coinsDisplay = document.getElementById('coin-counter');
  if(coinsDisplay) {
    coinsDisplay.textContent = state.coins;
    coinsDisplay.parentElement.style.transform = 'scale(1.2)';
    setTimeout(() => coinsDisplay.parentElement.style.transform = 'scale(1)', 200);
  }

  // Set Theme Colors
  document.documentElement.setAttribute('data-theme', state.theme);
  
  // Update Pet Room UI
  const petSprite = document.getElementById('pet-sprite');
  if(petSprite) {
    petSprite.className = `sprite-${state.pet}`;
  }
  
  // Calculate level (1 level per 100 XP)
  const level = Math.floor(state.petXp / 100) + 1;
  const currentXp = state.petXp % 100;
  
  const lvlText = document.getElementById('pet-level-text');
  if(lvlText) lvlText.textContent = `Lv ${level}`;
  
  const xpFill = document.getElementById('pet-xp-fill');
  if(xpFill) xpFill.style.width = `${currentXp}%`;

  // Update Dictionary Word Count
  const countEl = document.getElementById('total-words-count');
  if(countEl) countEl.textContent = getCurrentCards().length;
  
  if(document.getElementById('deck-select')) {
    document.getElementById('deck-select').value = state.activeDeck;
  }
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
    const cards = getCurrentCards();
    if(cards.length === 0) {
      document.getElementById('card-hanzi').textContent = 'Empty';
      document.getElementById('card-pinyin').textContent = 'Please import';
      document.getElementById('card-meaning').textContent = 'cards in setup.';
      return;
    }
    const card = cards[currentIndex];
    document.getElementById('card-hanzi').textContent = card.hanzi;
    document.getElementById('card-pinyin').textContent = card.pinyin;
    document.getElementById('card-meaning').textContent = card.meaning;
  }, 150); // delay ensures CSS flip animation completes before text changes
}

btnFlip.addEventListener('click', () => {
  if(getCurrentCards().length === 0) return;
  cardEl.classList.add('flipped');
  btnFlip.classList.add('hidden');
  guessButtons.classList.remove('hidden');
});

cardEl.addEventListener('click', (e) => {
    if (!cardEl.classList.contains('flipped') && e.target.id !== 'btn-listen') {
        btnFlip.click();
    }
});

document.getElementById('btn-right').addEventListener('click', () => {
  state.coins += 1;
  saveState();
  showToast('+1 🪙');
  nextCard();
});

document.getElementById('btn-wrong').addEventListener('click', () => nextCard());

function nextCard() {
  const cards = getCurrentCards();
  if(cards.length === 0) return;
  
  if (cards.length === 1) {
    currentIndex = 0;
  } else {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * cards.length);
    } while (nextIndex === currentIndex);
    currentIndex = nextIndex;
  }
  updateCard();
}

// Pronunciation via Web Speech API
document.getElementById('btn-listen').addEventListener('click', (e) => {
  e.stopPropagation(); // don't flip card
  const cards = getCurrentCards();
  if(cards.length === 0) return;
  const word = cards[currentIndex].hanzi;
  
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

/* --- MINIGAME LOGIC --- */
const mgMenu = document.getElementById('minigame-menu');
const mgMatchEm = document.getElementById('mg-match-em');
const mgListen = document.getElementById('mg-listen');

document.getElementById('btn-menu-match').addEventListener('click', () => {
  mgMenu.classList.add('hidden');
  mgMatchEm.classList.remove('hidden');
  startMinigame();
});

document.getElementById('btn-menu-listen').addEventListener('click', () => {
  mgMenu.classList.add('hidden');
  mgListen.classList.remove('hidden');
  startListenGame();
});

document.querySelectorAll('.btn-mg-back').forEach(btn => {
  btn.addEventListener('click', () => {
    mgMatchEm.classList.add('hidden');
    mgListen.classList.add('hidden');
    mgMenu.classList.remove('hidden');
    window.speechSynthesis.cancel();
  });
});

/* MATCH-EM */
const mgHanziCol = document.getElementById('mg-col-hanzi');
const mgMeaningCol = document.getElementById('mg-col-meaning');
let mgSelected = null;
let mgMatches = 0;

document.getElementById('btn-restart-match').addEventListener('click', startMinigame);

function startMinigame() {
  const cards = getCurrentCards();
  if (cards.length < 4) {
    showToast("Need at least 4 flashcards to play!");
    return;
  }
  
  document.getElementById('minigame-container').classList.remove('hidden');
  document.getElementById('minigame-results').classList.add('hidden');
  
  mgHanziCol.innerHTML = '';
  mgMeaningCol.innerHTML = '';
  mgMatches = 0;
  mgSelected = null;
  
  const shuffled = [...cards].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  const hanziTiles = [];
  const meaningTiles = [];
  shuffled.forEach((c, idx) => {
    hanziTiles.push({ text: c.hanzi, id: idx });
    meaningTiles.push({ text: c.meaning, id: idx });
  });
  
  hanziTiles.sort(() => 0.5 - Math.random());
  meaningTiles.sort(() => 0.5 - Math.random());
  
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
  if(div.classList.contains('matched')) return;
  
  if (!mgSelected) {
    mgSelected = div;
    div.classList.add('selected');
  } else {
    if (mgSelected !== div && mgSelected.dataset.id === div.dataset.id) {
      mgSelected.classList.remove('selected');
      mgSelected.classList.add('matched');
      div.classList.add('matched');
      
      showToast('Match! +1🪙');
      state.coins += 1;
      saveState();
      
      mgMatches += 1;
      if(mgMatches === 4) {
        setTimeout(() => {
          document.getElementById('minigame-container').classList.add('hidden');
          document.getElementById('minigame-results').classList.remove('hidden');
        }, 500);
      }
    } else {
      mgSelected.classList.remove('selected');
    }
    mgSelected = null;
  }
}

/* LISTEN & TYPE */
let listenTarget = null;
const listenInput = document.getElementById('listen-input');

function startListenGame() {
    const cards = getCurrentCards();
    if(cards.length === 0) {
        showToast("Need flashcards to play!");
        return;
    }
    listenInput.value = '';
    listenTarget = cards[Math.floor(Math.random() * cards.length)];
    playListenAudio();
}

function playListenAudio() {
    if(!listenTarget) return;
    const utterance = new SpeechSynthesisUtterance(listenTarget.hanzi);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

document.getElementById('btn-listen-play').addEventListener('click', playListenAudio);

document.getElementById('btn-listen-submit').addEventListener('click', () => {
    const guess = listenInput.value.trim().toLowerCase();
    if(!guess) return;
    
    const pinyinLower = listenTarget.pinyin.toLowerCase();
    const meaningLower = listenTarget.meaning.toLowerCase();
    
    if(guess === pinyinLower || guess === meaningLower || guess === listenTarget.hanzi) {
        showToast("Correct! +1🪙");
        state.coins += 1;
        saveState();
        startListenGame();
    } else {
        showToast("Oops, try again!");
        playListenAudio();
    }
});

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

// 3. Bulk Import / File Upload Logic

// Handle physical .txt file upload mapping
document.getElementById('file-uploader').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    processImportContent(evt.target.result);
    e.target.value = ''; // reset file input
  };
  reader.readAsText(file);
});

// Handle text area manual input
document.getElementById('btn-import').addEventListener('click', () => {
  const text = document.getElementById('import-textarea').value.trim();
  if(!text) return;
  processImportContent(text);
});

function processImportContent(text) {
  const lines = text.split('\n');
  let added = 0;
  let currentTargetDeck = state.activeDeck === 'all' ? 'custom' : state.activeDeck;
  
  lines.forEach(line => {
    line = line.trim();
    if(!line) return;
    
    // Check if it's a bracketed Header (e.g. [HSK 1])
    const headerMatch = line.match(/^\[(.*?)\]$/);
    if(headerMatch) {
       let headerName = headerMatch[1].toLowerCase().replace(/\s/g, ''); // "hsk1"
       if (headerName === 'custom' || headerName.startsWith('hsk')) {
         currentTargetDeck = headerName;
       } else {
         currentTargetDeck = 'custom'; // fallback for unknown brackets
       }
       
       if(!state.decks[currentTargetDeck]) state.decks[currentTargetDeck] = [];
       return;
    }

    // Flexible parser: Split by anything connecting ( : or - )
    const delimiters = /[-:]/;
    const parts = line.split(delimiters).map(p => p.trim()).filter(p => p);
    
    if(parts.length >= 2) {
      const hanzi = parts[0];
      let pinyin = '';
      let meaning = '';
      
      if(parts.length >= 3) {
        pinyin = parts[1];
        meaning = parts[2];
      } else {
        meaning = parts[1];
      }
      
      if(!state.decks[currentTargetDeck]) state.decks[currentTargetDeck] = [];
      state.decks[currentTargetDeck].push({ hanzi, pinyin, meaning });
      added++;
    }
  });
  
  if (added > 0) {
    saveState();
    showToast(`Successfully added ${added} new cards!`);
    document.getElementById('import-textarea').value = '';
    
    // Jump back to flashcards
    document.querySelector('.nav-btn[data-target="view-flashcards"]').click();
    
    const cards = getCurrentCards();
    currentIndex = Math.max(0, cards.length - added);
    updateCard(); 
  } else {
    showToast("Format error! Make sure to use - or : as separators.");
  }
}

/* --- INITIALIZATION --- */
init();
function init() {
  updateGlobalUI();
  updateCard();
}
