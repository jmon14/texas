package game

import (
	"fmt"

	"example.com/entities"
)

func HeadsUp() int {
	// Create a new deck of cards
	deck := entities.NewDeck(entities.Spades, entities.Clubs, entities.Ace, entities.Two, 0)

	player1, ok := deck.GetHand(entities.Card{Suit: entities.Spades, Value: entities.Ace}, entities.Card{Suit: entities.Spades, Value: entities.King})
	if !ok {
		fmt.Println("Could not get hand")
		return 0
	}
	player2, ok := deck.GetHand(entities.Card{Suit: entities.Hearts, Value: entities.Two}, entities.Card{Suit: entities.Diamonds, Value: entities.Two})
	if !ok {
		fmt.Println("Could not get hand")
		return 0
	}

	deck.Shuffle()

	var communityCards []entities.Card

	// Burn one card
	deck = deck[1:]

	// The flop
	flop := deck[:3]

	// Burn one card
	deck = deck[4:]

	// The turn
	turn := deck[0]

	// Burn one card
	deck = deck[2:]

	// The river
	river := deck[0]

	communityCards = append(communityCards, flop[0], flop[1], flop[2], turn, river)

	fmt.Println("Player 1's hand:", player1)
	fmt.Println("Player 2's hand:", player2)
	fmt.Println("Community cards:", communityCards)

	allCards1 := append(player1, communityCards...)
	allCards2 := append(player2, communityCards...)

	player1Hand := rankHand(allCards1)
	player2Hand := rankHand(allCards2)

	fmt.Println("Player 1's hand rank:", player1Hand.Rank)
	fmt.Println("Player 1's hand:", player1Hand.Cards)
	fmt.Println("Player 2's hand cards:", player2Hand.Rank)
	fmt.Println("Player 2's hand:", player2Hand.Cards)

	if player1Hand.Rank > player2Hand.Rank {
		fmt.Println("Player 1 wins!")
		return 1
	}

	if player1Hand.Rank < player2Hand.Rank {
		fmt.Println("Player 2 wins!")
		return 2
	}

	// If the ranks are the same, compare the cards
	for i := 0; i < 5; i++ {
		if player1Hand.Cards[i].Value > player2Hand.Cards[i].Value {
			fmt.Println("Player 1 wins!")
			return 1
		}

		if player1Hand.Cards[i].Value < player2Hand.Cards[i].Value {
			fmt.Println("Player 2 wins!")
			return 2
		}
	}

	fmt.Println("Its a tie!")
	return 0
}
