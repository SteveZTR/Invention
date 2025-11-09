const dayBtn = document.getElementById('day-btn');
const nightBtn = document.getElementById('night-btn');
const body = document.body;

dayBtn.addEventListener('mouseenter', () => body.classList.remove('night'));
nightBtn.addEventListener('mouseenter', () => body.classList.add('night'));
dayBtn.addEventListener('mouseleave', () => body.classList.remove('night'));
nightBtn.addEventListener('mouseleave', () => body.classList.remove('night'));