package game

import (
	"reflect"
	"testing"

	"example.com/entities"
)

func TestFindFlush(t *testing.T) {
	tests := []struct {
		name string
		hand []entities.Card
		want []entities.Card
	}{
		{
			name: "Test 1: Flush found",
			hand: []entities.Card{
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Ace, Suit: entities.Hearts},
			},
			want: []entities.Card{
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Ace, Suit: entities.Hearts},
			},
		},
		{
			name: "Test 2: No flush",
			hand: []entities.Card{
				{Value: entities.Jack, Suit: entities.Hearts},
				{Value: entities.King, Suit: entities.Diamonds},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Six, Suit: entities.Clubs},
			},
			want: nil,
		},
		{
			name: "Test 3: Flush Found get suit cards only",
			hand: []entities.Card{
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Spades},
				{Value: entities.Ace, Suit: entities.Hearts},
				{Value: entities.Ten, Suit: entities.Hearts},
				{Value: entities.Queen, Suit: entities.Clubs},
				{Value: entities.Jack, Suit: entities.Hearts},
			},
			want: []entities.Card{
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Ace, Suit: entities.Hearts},
				{Value: entities.Ten, Suit: entities.Hearts},
				{Value: entities.Jack, Suit: entities.Hearts},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := findFlush(tt.hand)
			if got != nil {
				if tt.want == nil {
					t.Errorf("findFlush() = %v, want nil", got)
				} else {
					if !reflect.DeepEqual(got, tt.want) {
						t.Errorf("findFlush().Cards = %v, want %v", got, tt.want)
					}
				}
			}
			if got == nil && tt.want != nil {
				t.Errorf("findFlush() = nil, want %v", tt.want)
			}
		})
	}
}

func TestFindStraight(t *testing.T) {
	tests := []struct {
		name string
		hand []entities.Card
		want []entities.Card
	}{
		{
			name: "Five card straight",
			hand: []entities.Card{{Value: entities.Seven}, {Value: entities.Six}, {Value: entities.Five}, {Value: entities.Four}, {Value: entities.Three}, {Value: entities.Two}},
			want: []entities.Card{{Value: entities.Seven}, {Value: entities.Six}, {Value: entities.Five}, {Value: entities.Four}, {Value: entities.Three}},
		},
		{
			name: "Five card straight with Ace low",
			hand: []entities.Card{{Value: entities.Ace}, {Value: entities.King}, {Value: entities.Queen}, {Value: entities.Five}, {Value: entities.Four}, {Value: entities.Three}, {Value: entities.Two}},
			want: []entities.Card{{Value: entities.Five}, {Value: entities.Four}, {Value: entities.Three}, {Value: entities.Two}, {Value: entities.Ace}},
		},
		{
			name: "No straight",
			hand: []entities.Card{{Value: entities.Two}, {Value: entities.Three}, {Value: entities.Four}, {Value: entities.Six}, {Value: entities.Seven}},
			want: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := findStraight(tt.hand)
			if got != nil && tt.want != nil {
				if !reflect.DeepEqual(got, tt.want) {
					t.Errorf("findStraight() = %v, want %v", got, tt.want)
				}
			} else if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("findStraight() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetStraightAndOrFlushRank(t *testing.T) {
	tests := []struct {
		name string
		hand []entities.Card
		want *Hand
	}{
		{
			name: "Test 1: Straight flush found",
			hand: []entities.Card{
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Hearts},
			},
			want: &Hand{
				Rank: StraightFlushRank,
				Cards: []entities.Card{
					{Value: entities.Six, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Hearts},
					{Value: entities.Four, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 2: Straight found",
			hand: []entities.Card{
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Five, Suit: entities.Spades},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Diamonds},
			},
			want: &Hand{
				Rank: StraightRank,
				Cards: []entities.Card{
					{Value: entities.Six, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Spades},
					{Value: entities.Four, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Diamonds},
				},
			},
		},
		{
			name: "Five card straight with Ace low",
			hand: []entities.Card{{Value: entities.Ace}, {Value: entities.King}, {Value: entities.Queen}, {Value: entities.Five}, {Value: entities.Four}, {Value: entities.Three}, {Value: entities.Two}},
			want: &Hand{
				Rank: StraightRank,
				Cards: []entities.Card{
					{Value: entities.Five}, {Value: entities.Four}, {Value: entities.Three}, {Value: entities.Two}, {Value: entities.Ace},
				},
			},
		},
		{
			name: "Test 3: Flush found",
			hand: []entities.Card{
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Seven, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Spades},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Hearts},
			},
			want: &Hand{
				Rank: FlushRank,
				Cards: []entities.Card{
					{Value: entities.Eight, Suit: entities.Hearts},
					{Value: entities.Seven, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Hearts},
					{Value: entities.Four, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Hearts},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := getStraightAndOrFlushRank(tt.hand)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("findStraightFlush() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetTimesOfKindRank(t *testing.T) {
	tests := []struct {
		name string
		hand []entities.Card
		want *Hand
	}{
		{
			name: "Test 1: Four of a kind",
			hand: []entities.Card{
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Diamonds},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: FourOfAKindRank,
				Cards: []entities.Card{
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Diamonds},
					{Value: entities.Two, Suit: entities.Clubs},
					{Value: entities.Five, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 2: Full house",
			hand: []entities.Card{
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Spades},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Clubs},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Diamonds},
			},
			want: &Hand{
				Rank: FullHouseRank,
				Cards: []entities.Card{
					{Value: entities.Three, Suit: entities.Spades},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Clubs},
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 3: Test full house 2",
			hand: []entities.Card{
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Spades},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: FullHouseRank,
				Cards: []entities.Card{
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Clubs},
					{Value: entities.Three, Suit: entities.Spades},
					{Value: entities.Three, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 4: Three of a kind",
			hand: []entities.Card{
				{Value: entities.Ten, Suit: entities.Spades},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: ThreeOfAKindRank,
				Cards: []entities.Card{
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Clubs},
					{Value: entities.Ten, Suit: entities.Spades},
					{Value: entities.Five, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 5: Two pair",
			hand: []entities.Card{
				{Value: entities.Ten, Suit: entities.Spades},
				{Value: entities.Ten, Suit: entities.Hearts},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Spades},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: TwoPairRank,
				Cards: []entities.Card{
					{Value: entities.Ten, Suit: entities.Spades},
					{Value: entities.Ten, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Spades},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Hearts},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := getTimesOfKindRank(tt.hand)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getTimesOfKindRank() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRankHand(t *testing.T) {
	tests := []struct {
		name string
		hand []entities.Card
		want *Hand
	}{
		{
			name: "Test 1: Straight flush",
			hand: []entities.Card{
				{Value: entities.Ace, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Ace, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: StraightFlushRank,
				Cards: []entities.Card{
					{Value: entities.Six, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Hearts},
					{Value: entities.Four, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 2: Four of a kind",
			hand: []entities.Card{
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Five, Suit: entities.Spades},
				{Value: entities.Five, Suit: entities.Clubs},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Diamonds},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: FourOfAKindRank,
				Cards: []entities.Card{
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Diamonds},
					{Value: entities.Two, Suit: entities.Clubs},
					{Value: entities.Five, Suit: entities.Spades},
				},
			},
		},
		{
			name: "Test 3: Full house",
			hand: []entities.Card{
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Spades},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Clubs},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Diamonds},
			},
			want: &Hand{
				Rank: FullHouseRank,
				Cards: []entities.Card{
					{Value: entities.Three, Suit: entities.Spades},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Clubs},
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 4: Flush",
			hand: []entities.Card{
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Seven, Suit: entities.Hearts},
				{Value: entities.Six, Suit: entities.Spades},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Hearts},
			},
			want: &Hand{
				Rank: FlushRank,
				Cards: []entities.Card{
					{Value: entities.Eight, Suit: entities.Hearts},
					{Value: entities.Seven, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Hearts},
					{Value: entities.Four, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 5: Straight",
			hand: []entities.Card{
				{Value: entities.Seven},
				{Value: entities.Six},
				{Value: entities.Five},
				{Value: entities.Four},
				{Value: entities.Three},
				{Value: entities.Two},
			},
			want: &Hand{
				Rank: StraightRank,
				Cards: []entities.Card{
					{Value: entities.Seven},
					{Value: entities.Six},
					{Value: entities.Five},
					{Value: entities.Four},
					{Value: entities.Three},
				},
			},
		},
		{
			name: "Test 6: Three of a kind",
			hand: []entities.Card{
				{Value: entities.Ten, Suit: entities.Spades},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Spades},
				{Value: entities.Two, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: ThreeOfAKindRank,
				Cards: []entities.Card{
					{Value: entities.Two, Suit: entities.Spades},
					{Value: entities.Two, Suit: entities.Hearts},
					{Value: entities.Two, Suit: entities.Clubs},
					{Value: entities.Ten, Suit: entities.Spades},
					{Value: entities.Five, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 7: Two pair",
			hand: []entities.Card{
				{Value: entities.Ten, Suit: entities.Spades},
				{Value: entities.Ten, Suit: entities.Hearts},
				{Value: entities.Five, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Spades},
				{Value: entities.Three, Suit: entities.Hearts},
				{Value: entities.Two, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: TwoPairRank,
				Cards: []entities.Card{
					{Value: entities.Ten, Suit: entities.Spades},
					{Value: entities.Ten, Suit: entities.Hearts},
					{Value: entities.Three, Suit: entities.Spades},
					{Value: entities.Three, Suit: entities.Hearts},
					{Value: entities.Five, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 8: One pair",
			hand: []entities.Card{
				{Value: entities.Ten, Suit: entities.Spades},
				{Value: entities.Ten, Suit: entities.Hearts},
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Seven, Suit: entities.Spades},
				{Value: entities.Six, Suit: entities.Hearts},
				{Value: entities.Four, Suit: entities.Hearts},
				{Value: entities.Three, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: OnePairRank,
				Cards: []entities.Card{
					{Value: entities.Ten, Suit: entities.Spades},
					{Value: entities.Ten, Suit: entities.Hearts},
					{Value: entities.Eight, Suit: entities.Hearts},
					{Value: entities.Seven, Suit: entities.Spades},
					{Value: entities.Six, Suit: entities.Hearts},
				},
			},
		},
		{
			name: "Test 9: High card",
			hand: []entities.Card{
				{Value: entities.Ace, Suit: entities.Spades},
				{Value: entities.King, Suit: entities.Hearts},
				{Value: entities.Queen, Suit: entities.Hearts},
				{Value: entities.Jack, Suit: entities.Spades},
				{Value: entities.Nine, Suit: entities.Hearts},
				{Value: entities.Eight, Suit: entities.Hearts},
				{Value: entities.Seven, Suit: entities.Clubs},
			},
			want: &Hand{
				Rank: HighCardRank,
				Cards: []entities.Card{
					{Value: entities.Ace, Suit: entities.Spades},
					{Value: entities.King, Suit: entities.Hearts},
					{Value: entities.Queen, Suit: entities.Hearts},
					{Value: entities.Jack, Suit: entities.Spades},
					{Value: entities.Nine, Suit: entities.Hearts},
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := rankHand(tt.hand)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("rankHand() = %v, want %v", got, tt.want)
			}
		})
	}
}
