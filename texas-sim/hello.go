package main

import (
	"fmt"

	"example.com/game"
)

func main() {
	// Number of games to play
	numGames := 100

	// Create a channel to collect results
	results := make(chan int, numGames)

	// Play the games
	for i := 0; i < numGames; i++ {
		go func() {
			results <- game.HeadsUp()
		}()
	}

	// Collect the results
	player1Wins := 0
	player2Wins := 0
	tie := 0
	for i := 0; i < numGames; i++ {
		result := <-results
		if result == 1 {
			player1Wins++
		} else if result == 2 {
			player2Wins++
		} else {
			tie++
		}
	}

	// Print the results
	fmt.Printf("Player 1 won %d times\n", player1Wins)
	fmt.Printf("Player 2 won %d times\n", player2Wins)
	fmt.Printf("There were %d ties\n", tie)
}
