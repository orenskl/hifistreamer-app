VER=$(awk -F "=" '/version/ {print $2}' setup.cfg | tr -d ' ')
echo hifistreamer-app-${VER}
tar --exclude hifistreamer-app-${VER}.tar.gz \
    --exclude __pycache__ \
    --exclude .git \
    --exclude .DS_Store \
    --exclude venv \
    --exclude frontend/node_modules \
    -czvf hifistreamer-app-${VER}.tar.gz .