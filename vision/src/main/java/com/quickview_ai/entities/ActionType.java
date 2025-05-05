package com.quickview_ai.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActionType {
    FOLD("fold"),
    CALL("call"),
    RAISE("raise"),
    CHECK("check");

    private final String value;

    ActionType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ActionType forValue(String value) {
        for (ActionType actionType : values()) {
            if (actionType.value.equalsIgnoreCase(value)) {
                return actionType;
            }
        }
        throw new IllegalArgumentException("Unknown action type: " + value);
    }
}
