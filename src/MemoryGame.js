import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
const cards = [...emojis, ...emojis].map((emoji, index) => ({ id: index, emoji, matched: false }));

function MemoryGame() {
  const [cardState, setCardState] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCardState(shuffled.map((card) => ({ ...card, flipped: false })));
  };

  const handleCardClick = (id) => {
    if (flippedCards.length < 2) {
      setCardState((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, flipped: true } : card
        )
      );
      setFlippedCards((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cardState.find((card) => card.id === first);
      const secondCard = cardState.find((card) => card.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        setCardState((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, matched: true }
              : card
          )
        );
      } else {
        setTimeout(() => {
          setCardState((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }

      setMoves((prev) => prev + 1);
      setTimeout(() => setFlippedCards([]), 1000);
    }
  }, [flippedCards]);

  useEffect(() => {
    const allMatched = cardState.every((card) => card.matched);
    if (allMatched && cardState.length > 0) {
      setTimeout(() => {
        alert(`¡Felicidades! Completaste el juego en ${moves} movimientos.`);
        shuffleCards();
        setMoves(0);
      }, 500);
    }
  }, [cardState, moves]);

  return (
    <div className="game-container">
      <h1>Juego de Memoria🎮</h1>
      <p>Movimientos: {moves}</p>
      <div className="card-grid">
        {cardState.map((card) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            onClick={() => !card.matched && handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;
