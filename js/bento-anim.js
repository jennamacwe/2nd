// Hero words replay setiap kali section hero masuk viewport
const heroSection = document.querySelector('.hero');
const heroWords = document.querySelectorAll('.hero-content .word');
if (heroSection && heroWords.length) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        heroWords.forEach((el) => {
          el.style.animation = 'none';
          el.offsetHeight; // force reflow
          el.style.animation = '';
        });
      }
    });
  }, { threshold: 0.3 });
  heroObserver.observe(heroSection);
}

const bentoItems = document.querySelectorAll('.card-beginning, .card-counter, .bento-row-bottom');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

bentoItems.forEach((el) => observer.observe(el));

// word-scroll di luar section yang punya replay — trigger sekali saja
const replaySelectors = '.aq-text .word-scroll, .memories-text .word-scroll, .healed-header .word-scroll, .lf-left .word-scroll';
document.querySelectorAll(`.word-scroll:not(${replaySelectors})`).forEach((el) => {
  const wordScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        wordScrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
  wordScrollObserver.observe(el);
});

// Helper: reset word-scroll animation — disable transition first so the
// opacity:0 state is applied instantly, then re-enable and add visible.
function replayWordScroll(words) {
  words.forEach((el) => {
    el.style.transition = 'none';
    el.classList.remove('visible');
  });
  // One rAF to let the browser paint the opacity:0 / translateX(-18px) state
  requestAnimationFrame(() => {
    words.forEach((el) => {
      el.style.transition = '';   // restore CSS transition (including delay)
    });
    // Second rAF so the transition is active before we add visible
    requestAnimationFrame(() => {
      words.forEach((el) => el.classList.add('visible'));
    });
  });
}

// aq-card: slide in from right once on first entry
const aqCard = document.querySelector('#aqCard');
if (aqCard) {
  const aqCardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aqCard.classList.add('visible');
        aqCardObserver.unobserve(aqCard);
      }
    });
  }, { threshold: 0.2 });
  aqCardObserver.observe(aqCard);
}

// about-quiz section words replay setiap kali masuk viewport
const aboutQuizSection = document.querySelector('.about-quiz');
const aqWords = document.querySelectorAll('.aq-text .word-scroll');
if (aboutQuizSection && aqWords.length) {
  const aqObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) replayWordScroll(aqWords);
    });
  }, { threshold: 0.1 });
  aqObserver.observe(aboutQuizSection);
}

// memories-text is position:absolute so observe the parent section instead
const memoriesSection = document.querySelector('.memories');
const memoriesWords = document.querySelectorAll('.memories-text .word-scroll');
if (memoriesSection && memoriesWords.length) {
  const memoriesObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) replayWordScroll(memoriesWords);
    });
  }, { threshold: 0.1 });
  memoriesObserver.observe(memoriesSection);
}

// healed-section words replay setiap kali masuk viewport
const healedSection = document.querySelector('.healed-section');
const healedWords = document.querySelectorAll('.healed-header .word-scroll');
if (healedSection && healedWords.length) {
  const healedObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) replayWordScroll(healedWords);
    });
  }, { threshold: 0.1 });
  healedObserver.observe(healedSection);
}

// lf-section words replay setiap kali masuk viewport
const lfSection = document.querySelector('.lf-section');
const lfWords = document.querySelectorAll('.lf-left .word-scroll');
if (lfSection && lfWords.length) {
  const lfObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) replayWordScroll(lfWords);
    });
  }, { threshold: 0.1 });
  lfObserver.observe(lfSection);
}

// lf-checklist items: fade in from left one by one, replay on re-entry
function replayChecklistItems(items) {
  items.forEach((el) => {
    el.style.transition = 'none';
    el.classList.remove('visible');
  });
  requestAnimationFrame(() => {
    items.forEach((el) => { el.style.transition = ''; });
    requestAnimationFrame(() => {
      items.forEach((el) => el.classList.add('visible'));
    });
  });
}

const lfChecklistItems = document.querySelectorAll('.lf-item');
if (lfSection && lfChecklistItems.length) {
  const lfItemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) replayChecklistItems(lfChecklistItems);
    });
  }, { threshold: 0.1 });
  lfItemObserver.observe(lfSection);
}
