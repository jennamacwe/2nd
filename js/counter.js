const START_DATE = new Date('2024-06-03T00:00:00');

function updateCounter() {
  const now = new Date();
  const diff = now - START_DATE;

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById('cnt-days').textContent    = days.toLocaleString('id-ID');
  document.getElementById('cnt-hours').textContent   = hours.toLocaleString('id-ID');
  document.getElementById('cnt-minutes').textContent = minutes.toLocaleString('id-ID');
  document.getElementById('cnt-seconds').textContent = seconds;
}

updateCounter();
setInterval(updateCounter, 1000);
