package com.SWP.SkinCareService.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    Long roomId;


    @Column(name = "RoomName", nullable = false, unique = true)
    String roomName;


    @Column(name = "Capacity", nullable = false)
    Integer capacity;


    @Column(name = "InUse", nullable = false)
    Integer inUse;
}
