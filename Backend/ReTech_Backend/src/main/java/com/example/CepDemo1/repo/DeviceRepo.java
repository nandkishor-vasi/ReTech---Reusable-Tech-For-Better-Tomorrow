package com.example.CepDemo1.repo;

import com.example.CepDemo1.model.DeviceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepo extends JpaRepository<DeviceModel, Long> {
    List<DeviceModel> findByDonorId(Long donorId);
    List<DeviceModel> findByBeneficiaryId(Long beneficiaryId);

    List<DeviceModel> findByStatus(String pending);

    @Query("SELECT COUNT(d) FROM DeviceModel d WHERE d.beneficiary.id = :beneficiaryId")
    int findDonationRecievedCount(@Param("beneficiaryId") Long beneficiaryId);


}
