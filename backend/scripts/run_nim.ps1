$NGC_API_KEY = "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"
$LOCAL_NIM_CACHE = "$HOME\.cache\nim"
if (-not (Test-Path $LOCAL_NIM_CACHE)) {
    New-Item -ItemType Directory -Force -Path $LOCAL_NIM_CACHE
}

Write-Host "Logging into NVIDIA Container Registry..." -ForegroundColor Cyan
echo $NGC_API_KEY | docker login nvcr.io -u `$oauthtoken --password-stdin

Write-Host "Starting Mistral NIM..." -ForegroundColor Cyan
docker run -it --rm `
    --gpus all `
    --ipc host `
    --shm-size=32GB `
    -e NGC_API_KEY=$NGC_API_KEY `
    -v "$LOCAL_NIM_CACHE:/opt/nim/.cache" `
    -p 8000:8000 `
    nvcr.io/nim/mistralai/mistral-medium-3.5-128b:latest
