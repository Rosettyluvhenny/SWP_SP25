    package com.SWP.SkinCareService.controller;

    import com.SWP.SkinCareService.entity.ServiceList;
    import com.SWP.SkinCareService.service.ServiceListService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/services")
    public class ServiceListApi {
        @Autowired
        private ServiceListService serviceListService;

        @GetMapping("/all")
        public ResponseEntity<List<ServiceList>> getAllServices() {
            return ResponseEntity.ok(serviceListService.getAllServices());
        }

        @GetMapping("/get")
        public ResponseEntity<ServiceList> getServiceById(@RequestParam Long id) {
            ServiceList service = serviceListService.getServiceById(id);
            return (service != null) ? ResponseEntity.ok(service)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        @PostMapping("/create")
        public ResponseEntity<ServiceList> createService(@RequestBody ServiceList service) {
            return ResponseEntity.status(HttpStatus.CREATED).body(serviceListService.createService(service));
        }

        @PutMapping("/update")
        public ResponseEntity<ServiceList> updateService(@RequestParam Long id, @RequestBody ServiceList updatedService) {
            ServiceList service = serviceListService.updateServiceById(id, updatedService);
            return (service != null) ? ResponseEntity.ok(service)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        @DeleteMapping("/delete")
        public ResponseEntity<String> deleteService(@RequestParam Long id) {
            boolean isDeleted = serviceListService.deleteServiceById(id);
            return isDeleted ? ResponseEntity.ok("Service deleted successfully.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service not found.");
        }
    }
