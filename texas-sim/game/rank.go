package game

import (
	"sort"

	"example.com/entities"
)

type HandRank int

const (
	HighCardRank HandRank = iota
	OnePairRank
	TwoPairRank
	ThreeOfAKindRank
	StraightRank
	FlushRank
	FullHouseRank
	FourOfAKindRank
	StraightFlushRank
)

func (r HandRank) String() string {
	return [...]string{"High Card", "One Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush"}[r]
}

type Hand struct {
	Rank  HandRank
	Cards []entities.Card
}

func rankHand(allCards []entities.Card) *Hand {
	// Create copy of all cards to sort
	sortedCards := entities.SortCards(allCards)

	// Check for straight and / or flush
	straightAndOrFlushHand := getStraightAndOrFlushRank(sortedCards)

	// If straight flush, return the hand
	if straightAndOrFlushHand != nil && straightAndOrFlushHand.Rank == StraightFlushRank {
		return straightAndOrFlushHand
	}

	// Check for times of a kind hand
	timesOfAKindHand := getTimesOfKindRank(sortedCards)

	// If quads or full house, return the hand
	if timesOfAKindHand != nil && (timesOfAKindHand.Rank == FourOfAKindRank || timesOfAKindHand.Rank == FullHouseRank) {
		return timesOfAKindHand
	}

	// If there is a flush or straight, return the cards
	if straightAndOrFlushHand != nil {
		return straightAndOrFlushHand
	}

	// If there is a trips or pairs, return the hand
	if timesOfAKindHand != nil {
		return timesOfAKindHand
	}

	return &Hand{
		Rank:  HighCardRank,
		Cards: sortedCards[:5],
	}
}

func findFlush(allCards []entities.Card) []entities.Card {
	// Count the number of cards of each suit
	suitCounts := make(map[entities.Suit]int)
	for _, card := range allCards {
		suitCounts[card.Suit]++
	}

	// Default to Joker if there is no flush
	var flushSuit entities.Suit

	// Find the suit with 5 or more cards
	for suit, count := range suitCounts {
		if count >= 5 {
			flushSuit = suit
			break
		}
	}

	var flushCards []entities.Card
	// If there is a flush, get the flush cards
	if flushSuit != 0 {
		for _, card := range allCards {
			if card.Suit == flushSuit {
				flushCards = append(flushCards, card)
			}
		}

		return flushCards
	}
	return nil
}

func findStraight(allCards []entities.Card) []entities.Card {
	if len(allCards) < 5 {
		return nil
	}

	// Check for a straight
	var straightCards []entities.Card
	for i := 0; i < len(allCards)-4; i++ {
		if allCards[i].Value == allCards[i+1].Value+1 &&
			allCards[i+1].Value == allCards[i+2].Value+1 &&
			allCards[i+2].Value == allCards[i+3].Value+1 &&
			allCards[i+3].Value == allCards[i+4].Value+1 {
			straightCards = allCards[i : i+5]
			break
		}
	}

	// Check for a low ace straight
	allCardsLen := len(allCards)
	if straightCards == nil && allCards[0].Value == entities.Ace &&
		allCards[allCardsLen-4].Value == entities.Five &&
		allCards[allCardsLen-3].Value == entities.Four &&
		allCards[allCardsLen-2].Value == entities.Three &&
		allCards[allCardsLen-1].Value == entities.Two {
		straightCards = allCards[allCardsLen-4:]
		straightCards = append(straightCards, allCards[0])
	}

	// If there is a straight, return the straight cards
	if len(straightCards) == 5 {
		return straightCards
	}

	return nil
}

func getStraightAndOrFlushRank(allCards []entities.Card) *Hand {
	// If there are less than 5 cards, there can't be a straight flush
	if len(allCards) < 5 {
		return nil
	}

	// Find the flush cards
	flushCards := findFlush(allCards)
	if flushCards != nil {
		// Find the straight cards
		straightFlushCards := findStraight(flushCards)
		if straightFlushCards != nil {
			return &Hand{Rank: StraightFlushRank, Cards: straightFlushCards}
		}
		return &Hand{Rank: FlushRank, Cards: flushCards[:5]}
	}

	// Get unique card values
	uniqueCards := entities.UniqueCardValues(allCards)

	// Find the straight cards
	straightCards := findStraight(uniqueCards)

	if straightCards != nil {
		return &Hand{Rank: StraightRank, Cards: straightCards}
	}

	return nil
}

func getTimesOfKindRank(allCards []entities.Card) *Hand {
	// Create a map to count the occurrences of each card value
	valueCounts := make(map[entities.Value]int)
	for _, card := range allCards {
		valueCounts[card.Value]++
	}

	countValues := make(map[int][]entities.Value)
	for value, count := range valueCounts {
		countValues[count] = append(countValues[count], value)
	}

	// Sort the values in countValues
	for count := range countValues {
		sort.Slice(countValues[count], func(i, j int) bool {
			return countValues[count][i] > countValues[count][j]
		})
	}

	if countValues[4] != nil {
		quads, remainingCards := entities.GetCardsWithValue(allCards, countValues[4][0])
		return &Hand{Rank: FourOfAKindRank, Cards: append(quads, remainingCards[0])}
	}

	if countValues[3] != nil {
		if len(countValues[3]) > 1 {
			trips1, remainingCards := entities.GetCardsWithValue(allCards, countValues[3][0])
			trips2, _ := entities.GetCardsWithValue(remainingCards, countValues[3][1])
			return &Hand{Rank: FullHouseRank, Cards: append(trips1, trips2[:2]...)}
		}
		if countValues[2] != nil {
			trips, remainingCards := entities.GetCardsWithValue(allCards, countValues[3][0])
			pair, _ := entities.GetCardsWithValue(remainingCards, countValues[2][0])
			return &Hand{Rank: FullHouseRank, Cards: append(trips, pair[:2]...)}
		}
		trips, remainingCards := entities.GetCardsWithValue(allCards, countValues[3][0])
		return &Hand{Rank: ThreeOfAKindRank, Cards: append(trips, remainingCards[:2]...)}
	}

	if countValues[2] != nil {
		if len(countValues[2]) > 1 {
			pair1, remainingCards1 := entities.GetCardsWithValue(allCards, countValues[2][0])
			pair2, remainingCards2 := entities.GetCardsWithValue(remainingCards1, countValues[2][1])
			return &Hand{Rank: TwoPairRank, Cards: append(pair1, append(pair2, remainingCards2[0])...)}
		}
		pair, remainingCards := entities.GetCardsWithValue(allCards, countValues[2][0])
		return &Hand{Rank: OnePairRank, Cards: append(pair, remainingCards[:3]...)}
	}

	return nil
}
