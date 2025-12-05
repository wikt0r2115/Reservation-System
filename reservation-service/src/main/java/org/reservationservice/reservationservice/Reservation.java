package org.reservationservice.reservationservice;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long accommodationId;

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalDate createdAt;
    private String status;

    @Column(name="location_name")
    private String locationName;

    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public void setUserId(Long userId){
        this.userId = userId;
    }
    public Long getUserId(){
        return this.userId;
    }
    public Long getAccommodationId(){
        return this.accommodationId;
    }
    public void setAccommodationId(Long accommodationId){
        this.accommodationId = accommodationId;
    }
    public LocalDate getStartDate(){
        return this.startDate;
    }
    public void setStartDate(LocalDate startDate){
        this.startDate = startDate;
    }
    public LocalDate getEndDate(){
        return this.endDate;
    }
    public void setEndDate(LocalDate endDate){
        this.endDate = endDate;
    }
    public LocalDate getCreatedAt(){
        return this.createdAt;
    }
    public void setCreatedAt(LocalDate createdAt){
        this.createdAt = createdAt;
    }
    public String getStatus(){
        return this.status;
    }
    public void setStatus(String status){
        this.status = status;
    }
    public String getLocationName(){
        return this.locationName;
    }
    public void setLocationName(String locationName){
        this.locationName = locationName;
    }
}
