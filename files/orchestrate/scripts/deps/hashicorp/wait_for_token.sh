TOKEN_PATH=/vault/token/.vault-token
CONTAINER=deps_vault-agent_1
RETRY=10

while true; do
  cmd=$(/bin/ls -la $TOKEN_PATH)
  cmd_code=$(echo $?)

  if [ $RETRY -eq 0 ]; then
    echo "$CONTAINER: Failed to wait for token n path $TOKEN_PATH"
    exit 1
  fi
  if [ $cmd_code -eq 0 ]; then
    echo "$CONTAINER: Token successfully found in path $TOKEN_PATH"
    break
  else
    echo "$CONTAINER: Waiting for token..."
    sleep 1
  fi

  RETRY=$((RETRY-1))
done
