module texas-sim

go 1.22.3

replace example.com/game => ./game

replace example.com/entities => ./entities

require example.com/game v0.0.0-00010101000000-000000000000

require example.com/entities v0.0.0-00010101000000-000000000000 // indirect
