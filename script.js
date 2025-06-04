// Matrix Digital Rain Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Characters to use in the rain
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

// Draw the digital rain
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 33);

const gameState = {
  score: 0,
  currentChallenge: 0,
  challenges: [
    {
      text: "HELLO WORLD THIS IS A SUBSTITUTION CIPHER CHALLENGE",
      solution: "HELLO WORLD THIS IS A SUBSTITUTION CIPHER CHALLENGE",
      hint: "The most common letter in English is 'E'. Look for patterns in the text."
    },
    {
      text: "KVJYY PYKBW ZJKW KW H LGHQLKZKZKON WKRYJY QJZJYYFJ",
      solution: "HELLO WORLD THIS IS A SUBSTITUTION CIPHER CHALLENGE",
      hint: "Try mapping 'K' to 'H' and see if that helps identify other letters."
    },
    {
      text: "XZWWM VMWJI GZMW MW Z HMWLZGZGZGZM XWMVZW TWMVWZM",
      solution: "HELLO WORLD THIS IS A SUBSTITUTION CIPHER CHALLENGE",
      hint: "Look for repeated words like 'IS' and 'A' which are common in English."
    }
  ],
  scoreboard: []
};

// Letter mappings with Proxy for reactivity
const letterMappings = new Proxy({}, {
  set(target, key, value) {
    target[key] = value;
    const inputField = document.getElementById(`map${key}`);
    if (inputField) {
      inputField.value = value;
    }
    return true;
  }
});

// Word frequencies with Proxy for reactivity
const wordFrequencies = new Proxy({}, {
  set(target, key, value) {
    target[key] = value;
    updateFrequencyTable();
    return true;
  }
});

// Initialize the game
function initGame() {
  generateLetterMappings();
  loadChallenge(gameState.currentChallenge);
  updateScore();
}

// Generate letter mapping table
function generateLetterMappings() {
  const tbody = document.querySelector('#letterMappings tbody');
  tbody.innerHTML = '';

  // CHANGE #2: Instead of random letters, start all mappings blank
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Create a single row for all letters
  const row = document.createElement('tr');
  
  for (let i = 0; i < 26; i++) {
    const letter = alphabet[i];
    
    const cell = document.createElement('td');
    cell.classList.add('letter-mapping-cell');
    
    const letterDisplay = document.createElement('div');
    letterDisplay.classList.add('letter-display');
    letterDisplay.textContent = letter;
    
    const input = document.createElement('input');
    input.classList.add('letter-mapping');
    input.id = `map${letter}`;
    input.maxLength = 1;
    input.addEventListener('input', function () {
      letterMappings[letter] = input.value.toUpperCase();
    });
    
    cell.appendChild(letterDisplay);
    cell.appendChild(input);
    row.appendChild(cell);

    // NO default mapping: set to blank
    letterMappings[letter] = "";
    input.value = "";
  }
  
  tbody.appendChild(row);
}

// Load a challenge
function loadChallenge(index) {
  if (index >= gameState.challenges.length) {
    document.querySelector('.challenge-section').innerHTML = `
      <h2>Congratulations!</h2>
      <p>You've completed all challenges with a score of ${gameState.score}.</p>
      <button onclick="resetGame()">Play Again</button>
    `;
    return;
  }
  
  const challenge = gameState.challenges[index];
  document.getElementById('challengeText').textContent = challenge.text;
  document.getElementById('inputText').value = '';
  document.getElementById('outputText').textContent = '';

  document.getElementById("inputText").value =
    "R, GSV OVZWVI LU GSV YOZXP WZDM, SZEV ULI BLF Z NRHHRLM LU TIVZG RNKLIGZMXV! " +
    "DRGS BLFI SVOK, GSRH XRGB, NVTZOLKLORH, DROO UVVO GSV YOZXP WZDM'H QFWTVNVMG. " +
    "DRGS BLFI SVOK, DV DROO YIRMT ZM VMW GL HLXRVGB ZH DV PMLD RG! GL WL GSRH, " +
    "BLF DROO KZIGRXRKZGV RM ZM VUULIG GL HZYLGZTV HVXFIRGB, VOVXGIRX KLDVI, " +
    "YZMPRMT, ZMW ULLW HFKKORVH. R DLFOW ORPV ZOO LU BLF GL WL GSV ULOOLDRMT GZHPH:\n\n" +
    "URIHGOB, DV DROO HSFG WLDM GSV NVTZOLKLORH KLDVI TIRW. GSV KZHHXLWV ULI GSV " +
    "KLDVI TIRW HVXFIRGB TZGV RH NVTZKLDVITIRW. RG RH OLXZGVW ZG 12345 M. " +
    "KLDVI HGZGRLM DZB. GSVIV RH ML LGSVI DZB ZYLFG GSRH; GSVRI HGIVMTGS UILN " +
    "VOVXGIRXRGB DROO YV GSV URIHG GL UZOO.\n\n" +
    "HVXLMWOB, DV NFHG YIVZP RMGL GSV NVTZOLKLORH XVMGIZO YZMP. RG RH OLXZGVW " +
    "LM 654321 D. NLMVB WIREV. DRGS GSVRI NLMVB, R DROO FHV RG GL ZXSRVEV LFI " +
    "TLZOH! GSVIV ZIV LGSVI IVHLFIXVH GSVIV GSZG DV NFHG GZPV DRGS FH UILN " +
    "GSV EZFOG. OZHGOB, DV TL GL GSV NVTZOLKLORH XLFIG SLFHV. RG RH OLXZGVW " +
    "LM 78910 M. TLEVIMNVMG HGIVVG. RG RH SVIV, RM GSV SVZIG LU GSVRI QFHGRXV, " +
    "GSZG DV DROO NZIP GSV VMW LU GSVRI KLDVI. GSRH DROO MLG LMOB YV HBNYLORX " +
    "YFG DROO VMHFIV GSV XRGB'H XLOOZKHV UILN DRGSRM. R ZHHFIV BLF, GSRH " +
    "NRHHRLM RH XIRGRXZO. RG RH LMOB DRGS BLFI XLFIZTV GSZG DV SZEV GSV XSZMXV " +
    "GL HFXXVVW. YFG IVNVNYVI, GSVIV DROO YV XSZOOVMTVH GSZG BLF NFHG LEVIXLNV. " +
    "RG RH GSV VMW ULI NVTZOLKLORH YFG GSV YVTRMMRMT ULI FH!";
  generateLetterMappings();
  document.getElementById('nextChallenge').classList.add('hidden');
}

// Update word frequency table
function updateFrequencyTable() {
  const tbody = document.querySelector("#wordFrequency tbody");
  tbody.innerHTML = '';

  const sortedEntries = Object.entries(wordFrequencies).sort((a, b) => b[1] - a[1]);
  sortedEntries.forEach(([word, count]) => {
    if(count > 3) {
      const row = document.createElement("tr");
      const wordCell = document.createElement("td");
      wordCell.textContent = word;
      wordCell.classList.add("clickable");
      wordCell.onclick = () => highlightWord(word);
      
      const countCell = document.createElement("td");
      countCell.textContent = count;
      
      row.appendChild(wordCell);
      row.appendChild(countCell);
      tbody.appendChild(row);
    }
  });
}

// Highlight word occurrences in the challenge text
function highlightWord(word) {
  const challengeText = document.getElementById('challengeText');
  const text = challengeText.textContent;
  
  challengeText.innerHTML = text;
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  challengeText.innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

// Encrypt text using current mappings
function encrypt() {
  const textArea = document.getElementById("inputText");
  let input = textArea.value.toUpperCase();
  let output = "";
  let changedIndices = [];
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (isLetter(char)) {
      const mapped = letterMappings[char] || char;
      output += mapped;
      if (mapped !== char) {
        changedIndices.push(i);
      }
    } else {
      output += char;
    }
  }
  
  // Create HTML with highlighted changed characters
  let highlightedOutput = "";
  for (let i = 0; i < output.length; i++) {
    if (changedIndices.includes(i)) {
      highlightedOutput += `<span class="highlight">${output[i]}</span>`;
    } else {
      highlightedOutput += output[i];
    }
  }
  
  document.getElementById("outputText").innerHTML = highlightedOutput;
  analyzeFrequency(output);
}

// Decrypt text using current mappings
function decrypt() {
  const textArea = document.getElementById("inputText");
  let input = textArea.value.toUpperCase();
  let output = "";

  const reverseMapping = {};
  for (const [key, value] of Object.entries(letterMappings)) {
    reverseMapping[value] = key;
  }
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (isLetter(char)) {
      const mapped = reverseMapping[char] || char;
      output += mapped;
    } else {
      output += char;
    }
  }
  
  document.getElementById("outputText").textContent = output;
  analyzeFrequency(output);
}

// Analyze word frequency in text
function analyzeFrequency(text = document.getElementById("inputText").value) {
  for (const key in wordFrequencies) {
    delete wordFrequencies[key];
  }
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  words.forEach(word => {
    if (word.length > 0) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
    }
  });
  
  updateFrequencyTable();
}

// Move to next challenge
function nextChallenge() {
  gameState.currentChallenge++;
  loadChallenge(gameState.currentChallenge);
}

// Update score display
function updateScore() {
  const el = document.getElementById('score');
  if (el) el.textContent = gameState.score;
}

// Show scoreboard
function showScoreboard() {
  const scoreboardContainer = document.getElementById('scoreboardContainer');
  if (!scoreboardContainer) {
    const container = document.createElement('div');
    container.id = 'scoreboardContainer';
    container.className = 'scoreboard-container';
    
    const header = document.createElement('h3');
    header.textContent = 'Scoreboard';
    
    const table = document.createElement('table');
    table.id = 'scoreboardTable';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Challenge</th>
        <th>Score</th>
        <th>Hints Used</th>
        <th>Time</th>
      </tr>
    `;
    
    const tbody = document.createElement('tbody');
    tbody.id = 'scoreboardBody';
    
    table.appendChild(thead);
    table.appendChild(tbody);
    
    container.appendChild(header);
    container.appendChild(table);
    
    const hintContainer = document.querySelector('.hint-container');
    hintContainer.parentNode.insertBefore(container, hintContainer.nextSibling);
  }
  
  updateScoreboard();
}

// Update scoreboard content
function updateScoreboard() {
  const tbody = document.getElementById('scoreboardBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  gameState.scoreboard.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>Challenge ${entry.challenge}</td>
      <td>${entry.score}</td>
      <td>${entry.hintsUsed}</td>
      <td>${entry.timestamp}</td>
    `;
    tbody.appendChild(row);
  });
}

// Reset the game
function resetGame() {
  gameState.score = 0;
  gameState.currentChallenge = 0;
  gameState.scoreboard = [];
  
  const scoreboardContainer = document.getElementById('scoreboardContainer');
  if (scoreboardContainer) {
    scoreboardContainer.remove();
  }
  
  updateScore();
  loadChallenge(0);
}

// Helper functions
function isUpperCase(letter) {
  const code = letter.charCodeAt(0);
  return code >= 65 && code <= 90;
}

function isLetter(letter) {
  const code = letter.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

// Hash function implementation
function simpleHash(input) {
  // Convert to lowercase for case-insensitive counting
  const str = input.toUpperCase();
  const charCount = {};
  
  // Count each character
  for (let char of str) {
    if (isLetter(char)) {
      if(charCount[char]) {
        charCount[char]++;
      } else {
        charCount[char] = 1;
      }
    }
  }
  
  // Sort characters alphabetically
  const sortedChars = Object.keys(charCount).sort();
  
  // Build the hash string
  let hash = '';
  for (let char of sortedChars) {
    hash += char + charCount[char];
  }
  
  return hash;
}

// Target hash for collision game
const TARGET_HASH = 'A59B17C34D23E125F20G24H54I89J2K10L65M24N45O89P20R62S62T110U34V7W39Y24';

// Check hash collision
function checkHashCollision() {
  const input = document.getElementById('hashInput').value;
  const hash = simpleHash(input);
  document.getElementById('hashOutput').textContent = hash;
  
  const resultElement = document.getElementById('hashResult');
  if (hash === TARGET_HASH) {
    resultElement.textContent = 'Congratulations! You found a hash collision!';
    resultElement.style.color = '#33ff33';
    gameState.score += 100;
    updateScore();
  } else {
    resultElement.textContent = 'Not a collision. Try again!';
    resultElement.style.color = '#ff3333';
  }
}

// Check hash collision
function updateHash() {
  const input = document.getElementById('hashInput').value;
  const hash = simpleHash(input);
  document.getElementById('hashOutput').textContent = hash;
}

// Toggle instructions modal
function toggleInstructions() {
  const modal = document.getElementById("instructionsModal");
  modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById("instructionsModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Toggle leaderboard display
function toggleLeaderboard() {
  const leaderboardContainer = document.getElementById('leaderboardContainer');
  if (leaderboardContainer) {
    leaderboardContainer.style.display = leaderboardContainer.style.display === 'block' ? 'none' : 'block';
  } else {
    const container = document.createElement('div');
    container.id = 'leaderboardContainer';
    container.className = 'leaderboard-container';
    
    const header = document.createElement('h3');
    header.textContent = 'Leaderboard';
    
    const table = document.createElement('table');
    table.id = 'leaderboardTable';
    
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Rank</th>
        <th>Score</th>
        <th>Time</th>
      </tr>
    `;
    
    const tbody = document.createElement('tbody');
    tbody.id = 'leaderboardBody';
    
    table.appendChild(thead);
    table.appendChild(tbody);
    
    container.appendChild(header);
    container.appendChild(table);
    
    const scoreboardContainer = document.getElementById('scoreboardContainer');
    scoreboardContainer.parentNode.insertBefore(container, scoreboardContainer.nextSibling);
    container.style.display = 'block';
  }
  
  updateLeaderboard();
}

function updateLeaderboard() {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const sortedScores = [...gameState.scoreboard].sort((a, b) => b.score - a.score);
  
  sortedScores.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.score}</td>
      <td>${entry.timestamp}</td>
    `;
    tbody.appendChild(row);
  });
}

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);

// Initialize Pyodide
let pyodide = null;
let isInitialized = false;

async function initPyodide() {
  if (isInitialized) return;
  
  const sandbox = document.querySelector('.python-sandbox');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = 'Initializing Python environment...';
  sandbox.appendChild(loadingIndicator);
  
  try {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    
    // Define a helper function to make HTTP calls
    // Example usage: 
    // res = await send_http_request("http://localhost/api")
    await pyodide.runPythonAsync(`
      from pyodide.http import pyfetch

      async def send_http_request(url):
          response = await pyfetch(url)  # Await pyfetch directly
          return await response.string()  # Return the string content of the response
    `);
    isInitialized = true;
    loadingIndicator.remove();
  } catch (error) {
    loadingIndicator.textContent = `Error: ${error.message}`;
    loadingIndicator.className = 'error-message';
  }
}

// Run Python code
async function runPythonCode() {
  if (!isInitialized) {
    await initPyodide();
  }
  
  const code = document.getElementById('pythonCode').value;
  const outputDiv = document.getElementById('pythonOutput');
  
  if (!isInitialized) {
    outputDiv.textContent = 'Python environment is still initializing...';
    return;
  }
  
  try {
    // Redirect stdout to our output div
    pyodide.runPython(`
      import sys
      from io import StringIO
      sys.stdout = StringIO()
    `);
    
    // Run the user's code
    await pyodide.runPythonAsync(code);
    
    // Get the output
    const output = pyodide.runPython('sys.stdout.getvalue()');
    outputDiv.textContent = output;
  } catch (error) {
    outputDiv.textContent = `Error: ${error.message}`;
  }
}

// Clear Python output
function clearPythonOutput() {
  document.getElementById('pythonOutput').textContent = '';
}

// Initialize Pyodide when the sandbox is first interacted with
document.getElementById('pythonCode').addEventListener('focus', initPyodide);
document.querySelector('.sandbox-controls button').addEventListener('click', initPyodide); 