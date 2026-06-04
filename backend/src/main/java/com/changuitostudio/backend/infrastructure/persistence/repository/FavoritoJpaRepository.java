package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.FavoritoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoJpaRepository extends JpaRepository<FavoritoEntity, Integer> {
    List<FavoritoEntity> findByIdCli(Integer idCli);
    Optional<FavoritoEntity> findByIdCliAndIdMue(Integer idCli, Integer idMue);
    void deleteByIdCliAndIdMue(Integer idCli, Integer idMue);
}
