const CORRECT_PIN = '0306';
const MAX_LENGTH = 4;

let currentPin = '';

function pressKey(digit) {
  if (currentPin.length >= MAX_LENGTH) return;
  clearError();

  currentPin += digit;
  updateDots();

  if (currentPin.length === MAX_LENGTH) {
    setTimeout(verifyPin, 120);
  }
}

function deleteLast() {
  if (currentPin.length === 0) return;
  clearError();
  currentPin = currentPin.slice(0, -1);
  updateDots();
}

function updateDots() {
  for (let i = 0; i < MAX_LENGTH; i++) {
    const dot = document.getElementById('dot-' + i);
    const filled = i < currentPin.length;
    dot.classList.toggle('filled', filled);
    dot.textContent = filled ? currentPin[i] : '';
  }
}

function verifyPin() {
  if (currentPin === CORRECT_PIN) {
    window.location.href = 'landing.html';
  } else {
    showError('kok salah?!?!?!?!?!????');
    shakeDots();
    setTimeout(resetPin, 700);
  }
}

function resetPin() {
  currentPin = '';
  updateDots();
  for (let i = 0; i < MAX_LENGTH; i++) {
    const dot = document.getElementById('dot-' + i);
    dot.classList.remove('error');
    dot.textContent = '';
  }
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  for (let i = 0; i < MAX_LENGTH; i++) {
    document.getElementById('dot-' + i).classList.add('error');
  }
}

function clearError() {
  document.getElementById('errorMsg').textContent = '';
  for (let i = 0; i < MAX_LENGTH; i++) {
    document.getElementById('dot-' + i).classList.remove('error');
  }
}

function shakeDots() {
  const dots = document.getElementById('pinDots');
  dots.style.animation = 'none';
  dots.offsetHeight;
  dots.style.animation = '';
}

// Keyboard support
document.addEventListener('keydown', function (e) {
  if (e.key >= '0' && e.key <= '9') {
    pressKey(e.key);
  } else if (e.key === 'Backspace') {
    deleteLast();
  }
});
