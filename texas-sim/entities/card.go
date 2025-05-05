package entities

import (
	"sort"
)

type Card struct {
	Suit  Suit
	Value Value
}

func (c Card) String() string {
	return c.Value.String() + " of " + c.Suit.String()
}

type Value int

const (
	Two Value = iota + 2
	Three
	Four
	Five
	Six
	Seven
	Eight
	Nine
	Ten
	Jack
	Queen
	King
	Ace
)

func (v Value) String() string {
	return [...]string{"Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"}[v-2]
}

type Suit int

const (
	Joker Suit = iota
	Clubs
	Diamonds
	Hearts
	Spades
)

func (s Suit) String() string {
	return [...]string{"Joker", "Clubs", "Diamonds", "Hearts", "Spades"}[s]
}

func SortCards(cards []Card) []Card {
	sortedCards := make([]Card, len(cards))
	copy(sortedCards, cards)

	sort.Slice(sortedCards, func(i, j int) bool {
		if sortedCards[i].Value != sortedCards[j].Value {
			return sortedCards[i].Value > sortedCards[j].Value
		}
		return sortedCards[i].Suit > sortedCards[j].Suit
	})

	return sortedCards
}

func UniqueCardValues(cards []Card) []Card {
	uniqueCards := make([]Card, 0, len(cards))
	seen := make(map[Value]bool)
	for _, card := range cards {
		if _, ok := seen[card.Value]; !ok {
			uniqueCards = append(uniqueCards, card)
			seen[card.Value] = true
		}
	}
	return uniqueCards
}

func GetCardsWithValue(allCards []Card, valueToFind Value) ([]Card, []Card) {
	cardsWithValue := make([]Card, 0)
	remainingCards := make([]Card, 0)
	for _, card := range allCards {
		if card.Value == valueToFind {
			cardsWithValue = append(cardsWithValue, card)
		} else {
			remainingCards = append(remainingCards, card)
		}
	}
	return cardsWithValue, remainingCards
}
