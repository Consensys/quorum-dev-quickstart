backend "file" {
    path            = "/vault/file"
}

listener "tcp" {
    address         = "vault:8200"
    tls_disable     = true
}

default_lease_ttl   = "168h",
max_lease_ttl       = "720h"

log_level = "Info"
