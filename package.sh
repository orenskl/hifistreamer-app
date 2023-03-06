#
# Check for command line arguments
#
if [ "$1" == "" ] || [ $# -gt 1 ]; then
    echo "Please specify output directory"
    exit 1
fi

VER=$(awk -F "=" '/version/ {print $2}' setup.cfg | tr -d ' ')
if [[ $(tar --version | grep bsdtar) ]]; then
    PATH_ARG="-s /^./hifistreamer-app-${VER}/"
else
    PATH_ARG="--transform s/^./hifistreamer-app-${VER}/"
fi
tar --exclude __pycache__ \
    --exclude .git \
    --exclude .DS_Store \
    --exclude venv \
    --exclude frontend/node_modules \
    ${PATH_ARG} \
    -czvf $1/hifistreamer-app-${VER}.tar.gz .
