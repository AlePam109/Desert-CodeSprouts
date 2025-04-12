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
    // Semi-transparent black background to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop to top when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Animate the rain
setInterval(drawMatrix, 33);

// Game state
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
  hintsUsed: 0,
  scoreboard: [] // Array to store completed challenges
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
  
  // Start with a random mapping instead of reversed alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
  
  // Create a single row for all letters
  const row = document.createElement('tr');
  
  // Create cells for each letter
  for (let i = 0; i < 26; i++) {
    const letter = alphabet[i];
    
    // Create a cell for each letter
    const cell = document.createElement('td');
    cell.classList.add('letter-mapping-cell');
    
    // Create the letter display
    const letterDisplay = document.createElement('div');
    letterDisplay.classList.add('letter-display');
    letterDisplay.textContent = letter;
    
    // Create the input field
    const input = document.createElement('input');
    input.classList.add('letter-mapping');
    input.id = `map${letter}`;
    input.maxLength = 1;
    input.addEventListener('input', function () {
      letterMappings[letter] = input.value.toUpperCase();
    });
    
    // Add elements to the cell
    cell.appendChild(letterDisplay);
    cell.appendChild(input);
    row.appendChild(cell);
    
    // Initialize with random mapping
    letterMappings[letter] = shuffled[i];
    input.value = shuffled[i];
  }
  
  // Add the row to the table
  tbody.appendChild(row);
}

// Load a challenge
function loadChallenge(index) {
  if (index >= gameState.challenges.length) {
    // Game completed
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
  document.getElementById('outputText').value = '';
  
  // Reset letter mappings for new challenge
  generateLetterMappings();
  
  // Hide next challenge button until solved
  document.getElementById('nextChallenge').classList.add('hidden');
  
  // Reset hints
  gameState.hintsUsed = 0;
  document.getElementById('hintText').classList.add('hidden');
}

// Update word frequency table
function updateFrequencyTable() {
  const tbody = document.querySelector("#wordFrequency tbody");
  tbody.innerHTML = ''; // Clear existing rows
  
  const sortedEntries = Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1]);
    
  sortedEntries.forEach(([word, count]) => {
    if(count > 0) { // Show all words, not just those with count > 1
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
  
  // Remove existing highlights
  challengeText.innerHTML = text;
  
  // Add new highlights
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  challengeText.innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

// Encrypt text using current mappings
function encrypt() {
  const textArea = document.getElementById("inputText");
  let input = textArea.value.toUpperCase();
  let output = "";
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (isLetter(char)) {
      const mapped = letterMappings[char] || char;
      output += mapped;
    } else {
      output += char;
    }
  }
  
  document.getElementById("outputText").value = output;
  analyzeFrequency(output);
}

// Decrypt text using current mappings
function decrypt() {
  const textArea = document.getElementById("inputText");
  let input = textArea.value.toUpperCase();
  let output = "";
  
  // Create reverse mapping
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
  
  document.getElementById("outputText").value = output;
  analyzeFrequency(output);
}

// Analyze word frequency in text
function analyzeFrequency(text = document.getElementById("inputText").value) {
  // Reset frequencies
  for (const key in wordFrequencies) {
    delete wordFrequencies[key];
  }
  
  // Count word frequencies
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

// Show a hint
function showHint() {
  const hintText = document.getElementById('hintText');
  const hint = gameState.challenges[gameState.currentChallenge].hint;
  
  hintText.textContent = hint;
  hintText.classList.remove('hidden');
  
  // Increment hints used and update score
  gameState.hintsUsed++;
  updateScore();
}

// Update score display
function updateScore() {
  document.getElementById('score').textContent = gameState.score;
}

// Show scoreboard
function showScoreboard() {
  const scoreboardContainer = document.getElementById('scoreboardContainer');
  if (!scoreboardContainer) {
    // Create scoreboard container if it doesn't exist
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
    
    // Insert after the hint container
    const hintContainer = document.querySelector('.hint-container');
    hintContainer.parentNode.insertBefore(container, hintContainer.nextSibling);
  }
  
  // Update scoreboard content
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
  gameState.hintsUsed = 0;
  gameState.scoreboard = []; // Clear scoreboard
  
  // Remove scoreboard if it exists
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
    // Toggle visibility
    leaderboardContainer.style.display = leaderboardContainer.style.display === 'block' ? 'none' : 'block';
  } else {
    // Create leaderboard container if it doesn't exist
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
    
    // Insert after the scoreboard container
    const scoreboardContainer = document.getElementById('scoreboardContainer');
    scoreboardContainer.parentNode.insertBefore(container, scoreboardContainer.nextSibling);
    
    // Initially display the leaderboard
    container.style.display = 'block';
  }
  
  // Update leaderboard content
  updateLeaderboard();
}

// Update leaderboard content
function updateLeaderboard() {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Sort scores in descending order
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

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);

// Hashing function
function generateHash(input) {
  let freq = {};
  for(let i = 0; i < 26; i++) {
    let letter = String.fromCharCode(97 + i);
    freq[letter] = 0;
  }

  for(let i = 0; i < input.length; i++) {
    if(isLetter(input[i]))
      freq[input[i].toLowerCase()]++;
  }

  let hash = "";
  for(let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97+i);
    if(freq[letter] > 0)                
      hash += letter + freq[letter];
  }

  return hash;
}

// Event listener for hash input
document.getElementById("hashInput").addEventListener("input", function() {
  const input = this.value;
  document.getElementById("hashOutput").value = generateHash(input);
});

// Add event listeners for real-time frequency analysis
document.getElementById("inputText").addEventListener("input", function() {
  analyzeFrequency(this.value);
});

// Initialize frequency analysis on page load
document.addEventListener('DOMContentLoaded', function() {
  analyzeFrequency();
}); 