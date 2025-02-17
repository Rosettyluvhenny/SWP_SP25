package com.SWP.SkinCareService.api;
import com.SWP.SkinCareService.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class FirebaseApi {
    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        String fileUrl = firebaseService.uploadFile(file);
        return ResponseEntity.ok(fileUrl);  // Trả về URL của file đã upload
    }
}
