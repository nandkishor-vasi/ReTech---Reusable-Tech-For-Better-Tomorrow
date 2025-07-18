package com.example.CepDemo1.service;

import com.example.CepDemo1.model.BeneficiaryModel;
import com.example.CepDemo1.model.DonorModel;
import com.example.CepDemo1.model.UserModel;
import com.example.CepDemo1.repo.BeneficiaryRepo;
import com.example.CepDemo1.repo.DonorRepo;
import com.example.CepDemo1.repo.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.ILoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepo repo;

    @Autowired
    private DonorRepo donorRepo;

    @Autowired
    private BeneficiaryRepo beneficiaryRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${smtp_email}")
    private String ADMIN_EMAIL;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserModel saveUser(UserModel user) {
        user.setPassword(encoder.encode(user.getPassword()));
        UserModel savedUser =  repo.save(user);

        if(user.getRole() == UserModel.Role.DONOR){
            DonorModel donor = new DonorModel();
            donor.setUser(user);
            donorRepo.save(donor);
        } else if (user.getRole()==UserModel.Role.BENEFICIARY){
            BeneficiaryModel beneficiary = new BeneficiaryModel();
            beneficiary.setUser(user);
            beneficiary.setStatus(BeneficiaryModel.BeneficiaryStatus.PENDING);
            beneficiaryRepo.save(beneficiary);

            sendApprovalEmail(user, beneficiary);
        }

        return savedUser;
    }

    public List<UserModel> getAllUsers() {
        return repo.findAll();
    }

    public UserModel getUserByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }


    private void sendApprovalEmail(UserModel user, BeneficiaryModel beneficiary) {
        String approveLink = "http://localhost:8080/api/beneficiary/approve/" + beneficiary.getId();
        String rejectLink = "http://localhost:8080/api/beneficiary/reject/" + beneficiary.getId();

        String emailContent = "<p>A new beneficiary has signed up:</p>"
                + "<p><strong>Name:</strong> " + user.getName() + "</p>"
                + "<p><strong>Email:</strong> " + user.getEmail() + "</p>"
                + "<p>Click below to take action:</p>"
                + "<p><a href='" + approveLink + "' style='color:green;'>✅ Approve</a></p>"
                + "<p><a href='" + rejectLink + "' style='color:red;'>❌ Reject</a></p>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,true);

            helper.setTo(ADMIN_EMAIL);
            helper.setSubject("New Beneficiary Signup - Approval Needed");
            helper.setText(emailContent, true);

            mailSender.send(message);
            log.info("Approval email sent to {}", ADMIN_EMAIL);

        } catch (MessagingException e){
            log.error("Failed to send approval email to admin", e);
        }
    }

    public boolean isBeneficiaryApproved(String username) {
        Optional<UserModel> userOptional = repo.findByUsername(username);

        if (userOptional.isPresent() && userOptional.get().getRole() == UserModel.Role.BENEFICIARY) {
            BeneficiaryModel beneficiary = beneficiaryRepo.findByUser(userOptional.get());
            return beneficiary != null && beneficiary.getStatus() == BeneficiaryModel.BeneficiaryStatus.APPROVED;
        }
        return true;
    }

}
