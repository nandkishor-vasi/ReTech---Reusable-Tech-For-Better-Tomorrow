package com.example.CepDemo1.controller;

import com.example.CepDemo1.model.BeneficiaryModel;
import com.example.CepDemo1.model.DeviceModel;
import com.example.CepDemo1.model.DonorModel;
import com.example.CepDemo1.service.BeneficiaryService;
import com.example.CepDemo1.service.DeviceService;
import com.example.CepDemo1.service.JwtService;
import com.example.CepDemo1.service.RequestService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/beneficiary")
@CrossOrigin(origins = "http://localhost:3000")
public class BeneficiaryController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private BeneficiaryService beneficiaryService;

    @Autowired
    private RequestService requestService;

    @Autowired
    private DeviceService deviceService;
    
    @PreAuthorize("hasRole('BENEFICIARY')")
    @GetMapping("/{beneficiaryId}")
    public ResponseEntity<BeneficiaryModel> getBeneficiary(@PathVariable Long beneficiaryId, @RequestHeader("Authorization") String token){
        String username = jwtService.extractUserName(token.substring(7));
        BeneficiaryModel beneficiary = beneficiaryService.getBeneficiaryById(beneficiaryId);
        int donationReceivedCount = deviceService.getDonationReceivedCount(beneficiaryId);
        beneficiary.setDonationsReceived(donationReceivedCount);
        return ResponseEntity.ok(beneficiary);
    }

    @PreAuthorize("hasRole('BENEFICIARY')")
    @GetMapping("/{beneficiaryId}/history")
    public ResponseEntity<List<DeviceModel>> getReceivedDevices(@PathVariable long beneficiaryId, @RequestHeader("Authorization") String token){
        String username = jwtService.extractUserName(token.substring(7));
        BeneficiaryModel beneficiary = beneficiaryService.getBeneficiaryById(beneficiaryId);

        List<DeviceModel> receivedDevices = deviceService.getDevicesByBeneficiaryId(beneficiaryId);
        return ResponseEntity.ok(receivedDevices);
    }

    @PreAuthorize("hasRole('BENEFICIARY')")
    @PutMapping("/{beneficiaryId}/updateImage")
    public ResponseEntity<BeneficiaryModel> updateImageUrl(@PathVariable Long beneficiaryId, @RequestBody Map<String, String> request){
        BeneficiaryModel beneficiary = beneficiaryService.getBeneficiaryById(beneficiaryId);
        if (beneficiary == null) {
            return ResponseEntity.notFound().build();
        }
        beneficiary.setProfileImageUrl(request.get("profileImageUrl"));
        BeneficiaryModel updatedBeneficiary = beneficiaryService.updateImageUrl(beneficiary);
        return ResponseEntity.ok(updatedBeneficiary);
    }

    @PutMapping("/{beneficiaryId}/profile")
    public ResponseEntity<BeneficiaryModel> updateProfile(@PathVariable Long beneficiaryId, @RequestBody BeneficiaryModel updatedBeneficiary){
        BeneficiaryModel beneficiary = beneficiaryService.getBeneficiaryById(beneficiaryId);
        if (beneficiary == null) {
            System.out.println("Beneficiary not found for ID: " + beneficiaryId);
            return ResponseEntity.notFound().build();
        }

        if (updatedBeneficiary.getCity() != null) beneficiary.setCity(updatedBeneficiary.getCity());
        if (updatedBeneficiary.getState() != null) beneficiary.setState(updatedBeneficiary.getState());
        if (updatedBeneficiary.getCountry() != null) beneficiary.setCountry(updatedBeneficiary.getCountry());
        if (updatedBeneficiary.getStatus() != null) beneficiary.setStatus(updatedBeneficiary.getStatus());
        if (updatedBeneficiary.getNeedDescription() != null) beneficiary.setNeedDescription(updatedBeneficiary.getNeedDescription());

        BeneficiaryModel savedBeneficiary = beneficiaryService.updateProfile(beneficiary);
        System.out.println("Updated Beneficiary: " + savedBeneficiary);
        return ResponseEntity.ok(savedBeneficiary);
    }

    @GetMapping("/approve/{id}")
    public ResponseEntity<?> approveBeneficiary(@PathVariable Long id) {
        Optional<BeneficiaryModel> optionalBeneficiary = beneficiaryService.findById(id);

        if (optionalBeneficiary.isPresent()) {
            BeneficiaryModel beneficiary = optionalBeneficiary.get();
            beneficiary.setStatus(BeneficiaryModel.BeneficiaryStatus.APPROVED);
            return ResponseEntity.ok(beneficiaryService.save(beneficiary));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Beneficiary not found");
        }
    }

    @GetMapping("/reject/{id}")
    public ResponseEntity<?> rejectBeneficiary(@PathVariable Long id) {
        Optional<BeneficiaryModel> optionalBeneficiary = beneficiaryService.findById(id);

        if (optionalBeneficiary.isPresent()) {
            BeneficiaryModel beneficiary = optionalBeneficiary.get();
            beneficiary.setStatus(BeneficiaryModel.BeneficiaryStatus.REJECTED);

            return ResponseEntity.ok(beneficiaryService.save(beneficiary));
        } else {
            return ResponseEntity.badRequest().body("❌ Beneficiary Not Found");
        }
    }

}
