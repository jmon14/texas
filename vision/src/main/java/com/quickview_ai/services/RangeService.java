package com.quickview_ai.services;

import com.quickview_ai.entities.Range;

import java.util.List;

public interface RangeService {
    void saveRange(Range range);

    Range getRange(String id);

    List<Range> getAllRanges();

    void deleteRange(String id);
}
