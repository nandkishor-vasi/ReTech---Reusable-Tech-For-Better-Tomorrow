package com.example.CepDemo1.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "beneficiary")
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryModel {

    public enum BeneficiaryStatus {
        PENDING,
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        APPROVED,
        REJECTED;


        @JsonCreator
        public static BeneficiaryStatus fromString(String value) {
            return BeneficiaryStatus.valueOf(value.toUpperCase());
        }
    }

    public enum BeneficiaryType{
        INDIVIDUAL,
        ORGANIZATION;

        @JsonCreator
        public static BeneficiaryType fromString(String value) {
            return BeneficiaryType.valueOf(value.toUpperCase());
        }
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"beneficiary"})
    private UserModel user;

    @OneToMany(mappedBy = "beneficiary", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DeviceModel> devices;

    private String city;
    private String state;
    private String country;

    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private BeneficiaryStatus status = BeneficiaryStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private BeneficiaryType beneficiaryType;

    @Column(length = 1000)
    private String needDescription;

    private int donationsReceived;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

    public UserModel getUser() {
        return user;
    }

    public List<DeviceModel> getDevices() {
        return devices;
    }

    public void setDevices(List<DeviceModel> devices) {
        this.devices = devices;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public BeneficiaryStatus getStatus() {
        return status;
    }

    public void setStatus(BeneficiaryStatus status) {
        this.status = status;
    }

    public String getNeedDescription() {
        return needDescription;
    }

    public void setNeedDescription(String needDescription) {
        this.needDescription = needDescription;
    }

    public int getDonationsReceived() {
        return donationsReceived;
    }

    public void setDonationsReceived(int donationsReceived) {
        this.donationsReceived = donationsReceived;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
