package entities

import "math/rand"

type Deck []Card

func NewDeck(startSuit, endSuit Suit, startValue, endValue Value, jokers int) Deck {
	deck := Deck{}
	for s := startSuit; s >= endSuit; s-- {
		for v := startValue; v >= endValue; v-- {
			deck = append(deck, Card{Suit: s, Value: v})
		}
	}
	for j := 0; j < jokers; j++ {
		deck = append(deck, Card{Suit: Joker})
	}
	return deck
}

func (d *Deck) Shuffle() {
	rand.Shuffle(len(*d), func(i, j int) { (*d)[i], (*d)[j] = (*d)[j], (*d)[i] })
}

func (d *Deck) GetHand(card1, card2 Card) (hand []Card, ok bool) {
	handIndices := make([]int, 0, 2)
	for i, card := range *d {
		if card == card1 || card == card2 {
			hand = append(hand, card)
			handIndices = append(handIndices, i)
			if len(hand) == 2 {
				break
			}
		}
	}

	if len(hand) < 2 {
		return nil, false
	}

	for i, index := range handIndices {
		*d = append((*d)[:index-i], (*d)[index-i+1:]...)
	}

	return hand, true
}
