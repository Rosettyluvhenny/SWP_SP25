package com.SWP.SkinCareService.mapper;

import com.SWP.SkinCareService.dto.request.Room.RoomRequest;
import com.SWP.SkinCareService.dto.response.Room.RoomResponse;
import com.SWP.SkinCareService.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Room toRoom(RoomRequest request);

    RoomResponse toRoomResponse(Room room);

    void updateRoom(@MappingTarget Room room, RoomRequest request);
} 