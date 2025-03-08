package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.request.Room.RoomUpdateRequest;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.entity.Room;
import com.SWP.SkinCareService.entity.Services;
import org.mapstruct.*;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoomMapper {

    @Mapping(target = "services", ignore = true)
    Room toRoom(RoomRequest request);

    @Named("servicesToIds")
    default List<Integer> servicesToIds(List<Services> services) {
        if (services == null) return new ArrayList<>();
        return services.stream()
                .map(Services::getId)
                .collect(Collectors.toList());
    }

    @Named("servicesToNames")
    default List<String> servicesToNames(List<Services> services) {
        if (services == null) return new ArrayList<>();
        return services.stream()
                .map(Services::getName)
                .collect(Collectors.toList());
    }

    @Mapping(target = "services", ignore = true)
    RoomResponse toResponse(Room room);

//    @Mapping(target = "services", ignore = true)
    void update(@MappingTarget Room room, RoomUpdateRequest request);
} 