#!/bin/bash

# katalog bazowy – ten, w którym jest skrypt
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_service() {
  local name="$1"
  local dir="$2"

  gnome-terminal \
    --tab --title="$name" -- bash -c "
      cd \"$BASE_DIR/$dir\" || exit 1
      echo \"[$name] Startuje mvn spring-boot:run...\"
      mvn spring-boot:run
      echo \"[$name] Zakonczone. Nacisnij Enter, aby zamknac zakladke.\"
      read
    "
}

run_service "listing-service" "listing-service"
run_service "log-service" "log-service"
run_service "reservation-service" "reservation-service"
run_service "gateway" "gateway"
