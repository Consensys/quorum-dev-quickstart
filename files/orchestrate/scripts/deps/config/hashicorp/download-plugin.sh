# Download vault pluging assets

TOKEN="${GITHUB_TOKEN}"
REPO="ConsenSys/orchestrate-hashicorp-vault-plugin"
FILES="orchestrate-hashicorp-vault-plugin SHA256SUM"
VERSION="${PLUGIN_VERSION}"
FILE_PATH="${PLUGINS_PATH}"
GITHUB_URL="https://api.github.com"

echo "Installing orchestrate-hashicorp-vault-plugin version '$version'"
for FILE in ${FILES}; do
  if [ "$VERSION" = "latest" ]; then
    # Github should return the latest release first.
    parser=".[0].assets | map(select(.name == \"$FILE\"))[0].id"
  else
    parser=". | map(select(.tag_name == \"$VERSION\"))[0].assets | map(select(.name == \"$FILE\"))[0].id"
  fi;

  echo "Obtaining asset_id of $FILE..."
  asset_id=`/usr/bin/wget -q --auth-no-challenge --proxy off --header="Authorization: token $TOKEN" --header="Accept: application/vnd.github.v3.raw" $GITHUB_URL/repos/$REPO/releases -O - | /usr/bin/jq "$parser"`
  if [ "$asset_id" = "null" ]; then
    errcho "ERROR: version $VERSION not found asset $FILE"
    exit 1
  fi;

  echo "Downloading $FILE(ID:$asset_id)..."
  echo "https://$TOKEN:@api.github.com/repos/$REPO/releases/assets/$asset_id"
  /usr/bin/wget -q --auth-no-challenge --proxy off --header='Accept:application/octet-stream' \
    https://$TOKEN:@api.github.com/repos/$REPO/releases/assets/$asset_id \
    -O "${FILE_PATH}/${FILE}"

  echo "File at ${FILE_PATH}/${FILE}..."
done
