'use strict';
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
if (menuButton && navigation) {
  function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('is-open', !expanded);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  window.matchMedia('(min-width: 1000px)').addEventListener('change', () => closeMenu());
}
const packageSelect = document.querySelector('#package');
const playersInput = document.querySelector('#players');
if (packageSelect && playersInput) {
  const rates = {
    own: { name: 'Уже в теме — свой комплект', price: 3500 },
    rental: { name: 'Первый выход — с прокатом', price: 7500 },
    private: { name: 'Своя миссия — частная группа', price: 7500 }
  };
  const format = new Intl.NumberFormat('ru-KZ');
  const total = document.querySelector('#total');
  const detail = document.querySelector('#cost-detail');
  const emailLink = document.querySelector('#email-request');
  const decrease = document.querySelector('#decrease');
  const increase = document.querySelector('#increase');
  function playerCount() {
    const value = Number(playersInput.value);
    return Number.isFinite(value) ? Math.min(30, Math.max(1, Math.floor(value))) : 1;
  }
  function update() {
    const valid = playersInput.value !== '' && playersInput.validity.valid;
    playersInput.setAttribute('aria-invalid', String(!valid));
    emailLink.setAttribute('aria-disabled', String(!valid));
    if (!valid) {
      total.textContent = '—';
      detail.textContent = 'Введите целое число игроков от 1 до 30.';
      emailLink.removeAttribute('href');
      decrease.disabled = true;
      increase.disabled = true;
      return;
    }
    const count = playerCount();
    const key = packageSelect.value;
    const selected = rates[key];
    const amount = (key === 'private' ? Math.max(10, count) : count) * selected.price;
    total.textContent = `${format.format(amount)} ₸`;
    detail.textContent = key === 'private' && count <= 10
      ? 'Базовая цена за группу до 10 человек · 2 часа'
      : `${count} × ${format.format(selected.price)} ₸ · 2 часа`;
    decrease.disabled = count <= 1;
    increase.disabled = count >= 30;
    const body = [
      'Здравствуйте! Хочу уточнить возможность игры.',
      '',
      `Формат: ${selected.name}`,
      `Количество игроков: ${count}`,
      `Ориентировочная сумма по сайту: ${format.format(amount)} ₸`,
      'Желаемая дата и время: ',
      '',
      'Подтвердите, пожалуйста, наличие игры, место встречи, состав пакета и итоговую стоимость.'
    ].join('\n');
    emailLink.href = `mailto:airsoftkaz@gmail.com?subject=${encodeURIComponent('Запрос на игру — ' + selected.name)}&body=${encodeURIComponent(body)}`;
  }
  playersInput.addEventListener('input', update);
  playersInput.addEventListener('change', update);
  packageSelect.addEventListener('change', update);
  decrease.addEventListener('click', () => { playersInput.value = Math.max(1, playerCount() - 1); update(); });
  increase.addEventListener('click', () => { playersInput.value = Math.min(30, playerCount() + 1); update(); });
  document.querySelectorAll('[data-package]').forEach((link) => {
    link.addEventListener('click', () => {
      packageSelect.value = link.dataset.package;
      if (link.dataset.package === 'private' && playerCount() < 10) playersInput.value = 10;
      update();
    });
  });
  update();
}
