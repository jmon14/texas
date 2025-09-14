package com.quickview_ai.services;

import java.util.List;

import com.quickview_ai.entities.Range;

public interface RangeService {
  void saveRange(Range range);

  Range getRange(String id);

  List<Range> getAllRanges();

  void deleteRange(String id);

  List<Range> getRangesByUserId(String userId);
}
