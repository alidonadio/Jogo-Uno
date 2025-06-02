const colors = ["red", "green", "blue", "yellow"];
let deck = [];
let playerHand = [];
let currentCard = null;
let status = document.getElementById("status");

function createDeck() {
  deck = [];

  for (let color of colors) {
    for (let i = 0; i <= 9; i++) {
      deck.push({ color, number: i });
    }

    // Adiciona cartas especiais para cada cor
    deck.push({ color, special: "+2" });
    deck.push({ color, special: "bloquear" });
    deck.push({ color, special: "inverter" });
  }

  // Adiciona curingas
  for (let i = 0; i < 4; i++) {
    deck.push({ color: "wild", special: "curinga" });
  }

  deck = shuffle(deck);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function drawCard(forPlayer = true) {
  if (deck.length === 0) {
    status.textContent = "Baralho acabou!";
    return;
  }
  const card = deck.pop();
  if (forPlayer) {
    playerHand.push(card);
    renderPlayerHand();
    status.textContent = "Você comprou uma carta.";
  } else {
    // computador joga automaticamente
    if (canPlay(card, currentCard)) {
      currentCard = card;
      updateTopCard();
      status.textContent = "O computador jogou: " + card.color + " " + card.number;
    } else {
      status.textContent = "O computador comprou carta e passou.";
    }
  }
}

function canPlay(card, topCard) {
  return (
    card.color === topCard.color ||
    card.number === topCard.number ||
    card.special === topCard.special ||
    card.color === "wild"
  );
}

function playCard(index) {
  const card = playerHand[index];
  if (!canPlay(card, currentCard)) {
    status.textContent = "Você não pode jogar essa carta!";
    return;
  }

  playerHand.splice(index, 1);
  renderPlayerHand();
  currentCard = card;
  updateTopCard();

  if (playerHand.length === 0) {
    alert("🎉 Você venceu!");
    init();
    return;
  }

  // Aplicar efeitos de carta especial
  if (card.special) {
    if (card.special === "+2") {
      status.textContent = "Você jogou +2! O computador compra 2!";
      drawCard(false);
      drawCard(false);
      return; // computador perde a vez
    }

    if (card.special === "bloquear") {
      status.textContent = "Você bloqueou o computador!";
      return; // computador perde a vez
    }

    if (card.special === "inverter") {
      status.textContent = "Inverter jogado! Você joga novamente.";
      return; // jogador joga novamente
    }

    if (card.special === "curinga") {
      const newColor = prompt("Escolha uma cor: red, green, blue ou yellow");
      if (colors.includes(newColor)) {
        currentCard.color = newColor;
        status.textContent = "Você jogou curinga e escolheu a cor " + newColor;
        setTimeout(() => drawCard(false), 1000);
        return;
      } else {
        status.textContent = "Cor inválida. Perdeu a vez.";
        setTimeout(() => drawCard(false), 1000);
        return;
      }
    }
  }

  // Próximo turno: computador joga
  setTimeout(() => drawCard(false), 1000);
}


function renderPlayerHand() {
  const hand = document.getElementById("player-hand");
  hand.innerHTML = "";
  playerHand.forEach((card, i) => {
    const cardEl = document.createElement("div");
    cardEl.className = `card ${card.color}`;
    cardEl.textContent = card.number;
    cardEl.onclick = () => playCard(i);
    hand.appendChild(cardEl);
  });
}

function updateTopCard() {
  const topCard = document.getElementById("top-card");
  topCard.className = `card ${currentCard.color}`;
  topCard.textContent = currentCard.number || currentCard.special;
}


function passTurn() {
  status.textContent = "Você passou a vez.";
  setTimeout(() => drawCard(false), 1000);
}

function init() {
  createDeck();
  playerHand = [];
  for (let i = 0; i < 5; i++) drawCard(true);
  currentCard = deck.pop();
  updateTopCard();
  status.textContent = "Jogo iniciado!";
}

init();