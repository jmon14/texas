package com.quickview_ai.services;

import com.quickview_ai.entities.Range;
import com.quickview_ai.repositories.RangeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RangeServiceImpl implements RangeService {

    private final RangeRepository rangeRepository;

    public RangeServiceImpl(RangeRepository rangeRepository) {
        this.rangeRepository = rangeRepository;
    }

    public void saveRange(Range range) {
        // Check if user has reached the limit of 10 ranges
        List<Range> userRanges = rangeRepository.findByUserId(range.getUserId());
        if (userRanges.size() >= 10) {
            throw new RuntimeException("User has reached the maximum limit of 10 ranges");
        }
        rangeRepository.save(range);
    }

    public Range getRange(String id) {
        return rangeRepository.findById(id).orElse(null);
    }

    public Range getRangeById(String id) {
        return rangeRepository.findById(id).orElse(null);
    }

    public List<Range> getAllRanges(){
        return rangeRepository.findAll();
    }

    public void deleteRange(String id) {
        rangeRepository.deleteById(id);
    }

    public void updateRange(String id, Range range) {
        rangeRepository.save(range);
    }

    public List<Range> getRangesByUserId(String userId) {
        return rangeRepository.findByUserId(userId);
    }
}
