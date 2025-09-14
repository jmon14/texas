package com.quickview_ai.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.quickview_ai.entities.Range;

public interface RangeRepository extends MongoRepository<Range, String> {
  List<Range> findByUserId(String userId);
}
