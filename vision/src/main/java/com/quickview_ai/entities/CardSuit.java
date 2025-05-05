package com.quickview_ai.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CardSuit {
    CLUBS("clubs"),
    DIAMONDS("diamonds"),
    HEARTS("hearts"),
    SPADES("spades");

    private final String value;

    CardSuit(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CardSuit fromString(String value) {
        for (CardSuit cardSuit : values()) {
            if (cardSuit.value.equalsIgnoreCase(value)) {
                return cardSuit;
            }
        }
        throw new IllegalArgumentException("Unknown card suit " + value);
    }
}
