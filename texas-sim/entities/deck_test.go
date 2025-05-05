package entities

import (
	"reflect"
	"testing"
)

func TestNewDeck(t *testing.T) {
	// Test case 1: Create a deck with all suits and values, without jokers
	deck := NewDeck(Spades, Clubs, Ace, Two, 0)
	expectedLength := 52
	if len(deck) != expectedLength {
		t.Errorf("Expected deck length to be %d, but got %d", expectedLength, len(deck))
	}

	// Test case 2: Create a deck with only hearts and diamonds, from 2 to 10, with 2 jokers
	deck = NewDeck(Hearts, Diamonds, Ten, Two, 2)
	expectedLength = 20
	if len(deck) != expectedLength {
		t.Errorf("Expected deck length to be %d, but got %d", expectedLength, len(deck))
	}
}

func TestShuffle(t *testing.T) {
	// Test case 1: Shuffle a deck with all suits and values
	deck := NewDeck(Spades, Clubs, Ace, Two, 0)
	originalDeck := make(Deck, len(deck))
	copy(originalDeck, deck)

	deck.Shuffle()

	if len(deck) != len(originalDeck) {
		t.Errorf("Expected shuffled deck length to be %d, but got %d", len(originalDeck), len(deck))
	}

	if reflect.DeepEqual(deck, originalDeck) {
		t.Error("Expected shuffled deck to be different from the original deck")
	}
}

func TestGetHand(t *testing.T) {
	// Test case 1: Get a hand with two specific cards from a deck
	deck := NewDeck(Spades, Clubs, Ace, Two, 0)
	card1 := Card{Suit: Spades, Value: King}
	card2 := Card{Suit: Clubs, Value: Ace}

	hand, ok := deck.GetHand(card1, card2)

	if !ok {
		t.Error("Expected to get a hand, but ok is false")
	}

	if len(hand) != 2 {
		t.Errorf("Expected hand length to be 2, but got %d", len(hand))
	}

	if hand[0] != card1 || hand[1] != card2 {
		t.Error("Expected hand to contain the specified cards")
	}

	if len(deck) != 50 {
		t.Errorf("Expected deck length to be 50, but got %d", len(deck))
	}

	// Test case 2: Get a hand with two specific cards that are not in the deck anymore
	card1 = Card{Suit: Clubs, Value: Ace}
	card2 = Card{Suit: Spades, Value: King}

	hand, ok = deck.GetHand(card1, card2)

	if ok {
		t.Error("Expected not to get a hand, but ok is true")
	}

	if len(hand) != 0 {
		t.Errorf("Expected hand length to be 0, but got %d", len(hand))
	}
}
