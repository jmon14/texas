package com.quickview_ai.entities;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Card {
  @NotNull private CardValue value;

  @NotNull private CardSuit suit;
}
