# Init Vault
curl --request POST --data '{"secret_shares": 1, "secret_threshold": 1}' ${VAULT_ADDR}/v1/sys/init > init.json

# Retrieve root token and unseal key
token=$(cat init.json | jq .root_token | tr -d '"')
unseal_key=$(cat init.json | jq .keys | jq .[0])
rm init.json

# Unseal Vault
curl --request POST --data '{"key": '${unseal_key}'}' ${VAULT_ADDR}/v1/sys/unseal

# Enable secret engine
curl --header "X-Vault-Token: ${token}" --request POST \
        --data '{"type": "kv-v2", "config": {"force_no_cache": true} }' \
    ${VAULT_ADDR}/v1/sys/mounts/secret

# Store root token in a file so it can be shared with other services throug volume
mkdir -p /vault/token
touch /vault/token/.vault-token
echo $token > /vault/token/.vault-token
