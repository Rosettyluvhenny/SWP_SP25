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

    @NotBlank(message = "Tên phòng không được để trống!")
    @Size(max = 50, message = "Tên phòng không được vượt quá 50 ký tự!")
    @Column(name = "RoomName", nullable = false, unique = true)
    String roomName;

    @NotNull(message = "Sức chứa không được để trống!")
    @Min(value = 1, message = "Sức chứa phải lớn hơn hoặc bằng 1!")
    @Column(name = "Capacity", nullable = false)
    Integer capacity;

    @NotNull(message = "Trạng thái sử dụng không được để trống!")
    @Min(value = 0, message = "Giá trị phải từ 0 trở lên!")
    @Column(name = "InUse", nullable = false)
    Integer inUse;
}
