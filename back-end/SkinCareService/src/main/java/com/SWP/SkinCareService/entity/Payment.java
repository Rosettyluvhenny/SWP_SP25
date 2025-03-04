package com.SWP.SkinCareService.entity;

import jakarta.persistence.*;
import kotlin.text.UStringsKt;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String name;
}
