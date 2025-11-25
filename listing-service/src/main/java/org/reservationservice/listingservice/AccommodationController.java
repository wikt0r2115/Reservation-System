package org.reservationservice.listingservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/accommodations")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class AccommodationController {

    private final AccommodationRepository accommodationRepository;

    public AccommodationController(AccommodationRepository accommodationRepository) {
        this.accommodationRepository = accommodationRepository;
    }

    // GET /accommodations - lista wszystkich
    @GetMapping
    public List<Accommodation> getAll() {
        return accommodationRepository.findAll();
    }

    // GET /accommodations/ {id} - szczegóły jednego
    @GetMapping("/{id}")
    public ResponseEntity<Accommodation> getById(@PathVariable Long id) {
        return accommodationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /accommodations - dodanie nowego
    @PostMapping
    public ResponseEntity<Accommodation> create(@Valid @RequestBody Accommodation accommodation) {
        Accommodation saved = accommodationRepository.save(accommodation);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // (opcjonalnie) DELETE /accommodations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!accommodationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accommodationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
