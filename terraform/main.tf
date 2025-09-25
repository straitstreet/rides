terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = "straitstreet-rides"
}

variable "region" {
  description = "Google Cloud Region"
  type        = string
  default     = "us-central1"
}

variable "allowed_referrers" {
  description = "Allowed referrers for API key restrictions"
  type        = list(string)
  default = [
    "http://localhost:3000/*",
    "https://localhost:3000/*",
    "https://*.straitstreet-rides.app/*",
    "https://*.rides.ng/*"
  ]
}

# Enable required APIs
resource "google_project_service" "maps_backend" {
  service                    = "maps-backend.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false
}

resource "google_project_service" "maps_embed_backend" {
  service                    = "maps-embed-backend.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false
}

resource "google_project_service" "places_backend" {
  service                    = "places-backend.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false
}

resource "google_project_service" "geocoding_backend" {
  service                    = "geocoding-backend.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false
}

resource "google_project_service" "geolocation" {
  service                    = "geolocation.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false
}

# Wait for APIs to be enabled
resource "time_sleep" "wait_for_apis" {
  depends_on = [
    google_project_service.maps_backend,
    google_project_service.maps_embed_backend,
    google_project_service.places_backend,
    google_project_service.geocoding_backend,
    google_project_service.geolocation,
  ]
  create_duration = "60s"
}

# Create API Key
resource "google_apikeys_key" "maps_api_key" {
  name         = "rides-maps-api-key"
  display_name = "Rides Maps API Key"

  restrictions {
    api_targets {
      service = "maps-backend.googleapis.com"
    }
    api_targets {
      service = "places-backend.googleapis.com"
    }
    api_targets {
      service = "geocoding-backend.googleapis.com"
    }

    browser_key_restrictions {
      allowed_referrers = var.allowed_referrers
    }
  }

  depends_on = [time_sleep.wait_for_apis]
}

# Outputs
output "api_key" {
  description = "Google Maps API Key"
  value       = google_apikeys_key.maps_api_key.key_string
  sensitive   = true
}

output "project_id" {
  description = "Google Cloud Project ID"
  value       = var.project_id
}

output "enabled_apis" {
  description = "List of enabled APIs"
  value = [
    google_project_service.maps_backend.service,
    google_project_service.maps_embed_backend.service,
    google_project_service.places_backend.service,
    google_project_service.geocoding_backend.service,
    google_project_service.geolocation.service,
  ]
}