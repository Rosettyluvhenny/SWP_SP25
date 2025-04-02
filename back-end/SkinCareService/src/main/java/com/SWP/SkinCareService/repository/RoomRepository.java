package com.SWP.SkinCareService.repository;

import com.SWP.SkinCareService.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    Page<Room> findAllByServicesId(int serviceId, Pageable pageable);
    boolean existsByName(String name);
    Page<Room> findAll(Pageable pageable);
    List<Room> findAllByServicesId(int serviceId);
    boolean existsByIdAndServices_Id(int id, int serviceId);

}
