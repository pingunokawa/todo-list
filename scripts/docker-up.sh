#!/bin/bash
echo "Initialize local docker instance"

osType=$(uname)
case "$osType" in
    "Darwin")
    echo "Running on Mac OSX."
    ;;
    "Linux")
    echo "Running on Linux."
    ;;
    *)
    echo "Unknown OS. Probably WSL"
    ;;
esac

docker compose -f docker-compose.yml --env-file config/.env up -d

echo ""
echo "Done!"
echo ""