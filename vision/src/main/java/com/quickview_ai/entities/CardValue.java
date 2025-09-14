package com.quickview_ai.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CardValue {
  TWO("two"),
  THREE("three"),
  FOUR("four"),
  FIVE("five"),
  SIX("six"),
  SEVEN("seven"),
  EIGHT("eight"),
  NINE("nine"),
  TEN("ten"),
  JACK("jack"),
  QUEEN("queen"),
  KING("king"),
  ACE("ace");

  private final String value;

  CardValue(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @JsonCreator
  public static CardValue forValue(String value) {
    for (CardValue cardValue : values()) {
      if (cardValue.value.equalsIgnoreCase(value)) {
        return cardValue;
      }
    }
    throw new IllegalArgumentException("Unknown card value: " + value);
  }
}
