package com.SWP.SkinCareService.service;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Blob;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
@Service
public class FirebaseService {
    public String uploadFile(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        Blob blob = StorageClient.getInstance().bucket().create(fileName, file.getInputStream(), file.getContentType());
        return blob.getMediaLink(); // Trả về đường link để truy cập file
    }
}
