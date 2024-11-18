package com.greenballot.voting.repository;

import com.greenballot.voting.model.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface CityRepository extends JpaRepository<City, Integer> {
    Page<City> findByCityContainingIgnoreCase(String city, Pageable pageable);

}
