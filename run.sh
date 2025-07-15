VER=$(awk -F "=" '/version/ {print $2}' setup.cfg | tr -d ' ')
cd frontend
npm run build
cd ..
./package.sh ..
scp ../hifistreamer-app-${VER}.tar.gz root@hifistreamer:/storage
ssh root@hifistreamer "tar xzvf hifistreamer-app-${VER}.tar.gz"
ssh root@hifistreamer "pkill -f hifistreamer_app"
ssh root@hifistreamer "PYTHONPATH=/storage/hifistreamer-app-${VER} python3 -m hifistreamer_app"