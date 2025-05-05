package entities

import (
	"testing"
)

func TestCardString(t *testing.T) {
	card := Card{Suit: Hearts, Value: Ace}
	expected := "Ace of Hearts"
	if card.String() != expected {
		t.Errorf("Expected card string to be %s, but got %s", expected, card.String())
	}
}

func TestCardEquality(t *testing.T) {
	card1 := Card{Suit: Spades, Value: Ace}
	card2 := Card{Suit: Spades, Value: Ace}
	if card1 != card2 {
		t.Errorf("Expected card1 and card2 to be equal, but they are not")
	}

	card3 := Card{Suit: Hearts, Value: King}
	if card1 == card3 {
		t.Errorf("Expected card1 and card3 to be different, but they are equal")
	}
}

func TestSortCards(t *testing.T) {
	cards := []Card{
		{Suit: Hearts, Value: Ace},
		{Suit: Spades, Value: King},
		{Suit: Diamonds, Value: Queen},
		{Suit: Clubs, Value: Jack},
	}

	sortedCards := SortCards(cards)
	expectedSortedCards := []Card{
		{Suit: Hearts, Value: Ace},
		{Suit: Spades, Value: King},
		{Suit: Diamonds, Value: Queen},
		{Suit: Clubs, Value: Jack},
	}

	for i := range sortedCards {
		if sortedCards[i] != expectedSortedCards[i] {
			t.Errorf("Expected card at index %d to be %s, but got %s", i, expectedSortedCards[i].String(), sortedCards[i].String())
		}
	}
}

func TestUniqueCardValues(t *testing.T) {
	cards := []Card{
		{Suit: Clubs, Value: Ace},
		{Suit: Diamonds, Value: Ace},
		{Suit: Hearts, Value: King},
		{Suit: Spades, Value: King},
		{Suit: Clubs, Value: Queen},
		{Suit: Diamonds, Value: Queen},
	}

	uniqueCards := UniqueCardValues(cards)
	expectedUniqueCards := []Card{
		{Suit: Clubs, Value: Ace},
		{Suit: Hearts, Value: King},
		{Suit: Clubs, Value: Queen},
	}

	for i := range uniqueCards {
		if uniqueCards[i] != expectedUniqueCards[i] {
			t.Errorf("Expected unique card at index %d to be %s, but got %s", i, expectedUniqueCards[i].String(), uniqueCards[i].String())
		}
	}
}

func TestGetCardsWithValue(t *testing.T) {
	allCards := []Card{
		{Suit: Clubs, Value: Ace},
		{Suit: Diamonds, Value: Ace},
		{Suit: Hearts, Value: King},
		{Suit: Spades, Value: King},
		{Suit: Clubs, Value: Queen},
		{Suit: Diamonds, Value: Queen},
	}

	valueToFind := Ace
	matchingCards, remainingCards := GetCardsWithValue(allCards, valueToFind)
	expectedMatchingCards := []Card{
		{Suit: Clubs, Value: Ace},
		{Suit: Diamonds, Value: Ace},
	}
	expectedRemainingCards := []Card{
		{Suit: Hearts, Value: King},
		{Suit: Spades, Value: King},
		{Suit: Clubs, Value: Queen},
		{Suit: Diamonds, Value: Queen},
	}

	for i := range matchingCards {
		if matchingCards[i] != expectedMatchingCards[i] {
			t.Errorf("Expected matching card at index %d to be %s, but got %s", i, expectedMatchingCards[i].String(), matchingCards[i].String())
		}
	}

	for i := range remainingCards {
		if remainingCards[i] != expectedRemainingCards[i] {
			t.Errorf("Expected remaining card at index %d to be %s, but got %s", i, expectedRemainingCards[i].String(), remainingCards[i].String())
		}
	}
}
