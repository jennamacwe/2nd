document.addEventListener('DOMContentLoaded', () => {

  const card = document.getElementById('aqCard');
  let currentStep = 0;
  let score = 0;

  const questions = {
    4: 'Kapan mas merasa paling dicintai oleh aku?',
    5: 'Apa hal yang ingin mas lakukan bersamaku di masa depan?',
  };

  function showStep(step) {
    const current = card.querySelector('.aq-step.active');
    const next = card.querySelector(`.aq-step[data-step="${step}"]`);
    if (!next) return;

    // Card "pull from stack" bounce
    card.classList.remove('pulling');
    card.offsetHeight;
    card.classList.add('pulling');
    card.addEventListener('animationend', () => card.classList.remove('pulling'), { once: true });

    if (current && current !== next) {
      current.classList.add('exit');
      current.addEventListener('animationend', () => {
        current.classList.remove('active', 'exit');
        next.classList.add('active');
        currentStep = step;
      }, { once: true });
    } else {
      next.classList.add('active');
      currentStep = step;
    }
  }

  document.getElementById('btnStart').addEventListener('click', () => showStep(1));

  /* Multiple choice */
  card.addEventListener('click', e => {
    const opt = e.target.closest('.aq-opt');
    if (!opt) return;

    const opts = opt.closest('.aq-options').querySelectorAll('.aq-opt');
    opts.forEach(o => {
      o.disabled = true;
      if (o.dataset.correct === 'true') o.classList.add('correct');
    });

    if (opt.dataset.correct === 'true') {
      score += 20;
    } else {
      opt.classList.add('wrong');
    }

    const nextStep = parseInt(opt.closest('.aq-step').dataset.step) + 1;
    setTimeout(() => showStep(nextStep), 900);
  });

  /* Clear error state when user types */
  card.addEventListener('input', e => {
    if (e.target.classList.contains('aq-input')) {
      e.target.classList.remove('error');
    }
  });

  /* Submit text answers */
  card.addEventListener('click', e => {
    const btn = e.target.closest('.aq-btn-submit');
    if (!btn) return;

    const step     = parseInt(btn.dataset.step);
    const textarea = btn.closest('.aq-step').querySelector('.aq-input');
    const answer   = textarea ? textarea.value.trim() : '';

    if (!answer) {
      if (textarea) {
        textarea.classList.add('error');
        textarea.classList.remove('shake');
        textarea.offsetHeight;
        textarea.classList.add('shake');
        textarea.addEventListener('animationend', () => textarea.classList.remove('shake'), { once: true });
        textarea.focus();
      }
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Mengirim…';

    emailjs.send('service_6kwvnic', 'template_dysmmug', {
      question_num: step,
      question:     questions[step],
      answer:       answer,
      score:        score + '/100',
      from_name:    'Bubu Quiz',
    }).then(() => {
      if (step === 4) {
        showStep(5);
      } else {
        showStep('final');
        card.querySelector('.aq-final-score').textContent = score;
        card.querySelector('.aq-final-score-inline').textContent = score;
      }
    }).catch(() => {
      btn.disabled = false;
      btn.textContent = 'Kirim →';
      alert('Gagal mengirim, coba lagi ya 🙏');
    });
  });

});
