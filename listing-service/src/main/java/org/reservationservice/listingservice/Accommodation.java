package org.reservationservice.listingservice;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // nazwa lokalizacji
    @NotBlank
    private String locationName;

    // liczba miejsc do spania
    @Min(1)
    private int beds;

    // liczba pokoi
    @Min(1)
    private int rooms;

    // opis
    private String description;

    // cena
    @NotNull
    private BigDecimal price;

    public Accommodation() {
    }

    public Accommodation(String locationName, int beds, int rooms, String description, BigDecimal price) {
        this.locationName = locationName;
        this.beds = beds;
        this.rooms = rooms;
        this.description = description;
        this.price = price;
    }

    // --- gettery i settery ---

    public Long getId() {
        return id;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public int getBeds() {
        return beds;
    }

    public void setBeds(int beds) {
        this.beds = beds;
    }

    public int getRooms() {
        return rooms;
    }

    public void setRooms(int rooms) {
        this.rooms = rooms;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
