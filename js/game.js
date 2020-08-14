function createCard(type) {
	let container = document.createElement('DIV'),
		back = document.createElement('IMG'),
		front = document.createElement('IMG');

	container.setAttribute('class', 'memory-card');
	container.setAttribute('data-framework', type);

	back.setAttribute('class', 'back-face');
	back.setAttribute('src', 'img/js-badge.svg');
	back.setAttribute('alt', 'Default');

	front.setAttribute('class', 'front-face');
	front.setAttribute('src', `img/${type}.svg`);
	front.setAttribute('alt', type);

	container.appendChild(back);
	container.appendChild(front);
	return container;
}

function createCards(level) {
	const types = ['aurelia', 'vue', 'angular', 'ember', 'backbone', 'react', 'meteor', 'mithril', 'polymer', 'svelte'].slice(0, 4 + 2 * level);
	const container = document.querySelector('.memory-game');
	
	while(container.firstChild) {
		console.log('Removing', container.firstChild);
		container.removeChild(container.firstChild);
	}
	
	types.map((type) => {
		container.appendChild(createCard(type));
		container.appendChild(createCard(type));
	})
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function startGame() {
	const cards = document.querySelectorAll('.memory-card');

	(function shuffle() {
	cards.forEach(card => {
		let randomPos = Math.floor(Math.random() * cards.length);
		card.style.order = randomPos;
	});
	})();

	cards.forEach(card => card.addEventListener('click', flipCard));
}

for (let button of document.querySelectorAll('.level')) {
	button.onclick = () => {
		document.querySelector('.level-chooser').classList.add('hidden');
		createCards(Number(button.dataset.level));
		startGame();
	}
}
