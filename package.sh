VER=$(awk -F "=" '/version/ {print $2}' setup.cfg | tr -d ' ')
tar --exclude __pycache__ \
    --exclude .git \
    --exclude .DS_Store \
    --exclude venv \
    --exclude frontend/node_modules \
    --transform "s/^./hifistreamer-app-${VER}/" \
    -czvf /tmp/hifistreamer-app-${VER}.tar.gz .