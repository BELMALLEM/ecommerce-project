package com.project.ecommerce.dao;

import com.project.ecommerce.entity.State;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;

@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {
    @RestResource(path = "country")
    List<State> findByCountryCode(@Param("code") String code, Pageable pageable);
}
