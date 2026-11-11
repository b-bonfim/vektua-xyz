# Algodão Pesado — release candidate check (Windows PowerShell).
# Run from repository checkout: powershell -ExecutionPolicy Bypass -File scripts/tests/algodao-scroll-release-check.ps1
# Does not merge, publish, change Hostinger settings, or approve the visual/browser gate.
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$expectedBranch = 'perf/algodao-pesado-smoother-scroll-scrub-20261022'
$baseUrl = 'http://127.0.0.1:3000'
$server = $null
$oldHost = $env:HOST
$oldPort = $env:PORT
$oldBaseUrl = $env:BASE_URL
$stdout = [IO.Path]::GetTempFileName()
$stderr = [IO.Path]::GetTempFileName()

function Check-Exit([string] $label) {
    if ($LASTEXITCODE -ne 0) { throw "$label failed (exit $LASTEXITCODE)." }
}

Push-Location $root
try {
    $branch = (& git branch --show-current).Trim()
    Check-Exit 'Git branch'
    if ($branch -ne $expectedBranch) {
        throw "Expected branch $expectedBranch, found $branch. No release check executed."
    }
    $commit = (& git rev-parse HEAD).Trim()
    Check-Exit 'Git SHA'
    Write-Host "Testing branch $branch at $commit" -ForegroundColor Cyan

    & node --version
    Check-Exit 'Node version'
    & npm --version
    Check-Exit 'npm version'
    & npm ci --no-audit --no-fund
    Check-Exit 'npm ci'
    & npm run check:algodao-ui
    Check-Exit 'Algodão UI contract'
    & npx --no-install tsc --noEmit
    Check-Exit 'TypeScript'
    & npm run build:hostinger
    Check-Exit 'Hostinger build'

    if (!(Test-Path 'dist/standalone/server.js')) {
        throw 'Missing dist/standalone/server.js after build.'
    }

    $env:HOST = '127.0.0.1'
    $env:PORT = '3000'
    $server = Start-Process -FilePath 'node' -ArgumentList 'dist/standalone/server.js' -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    $ready = $false
    for ($attempt = 1; $attempt -le 35; $attempt++) {
        if ($server.HasExited) { throw "Standalone server exited early ($($server.ExitCode))." }
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl/congrats/algodao-pesado" -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) { $ready = $true; break }
        } catch { }
        Start-Sleep -Milliseconds 1000
    }
    if (!$ready) { throw "Standalone server did not become ready at $baseUrl." }

    $env:BASE_URL = $baseUrl
    & node scripts/tests/hostinger-http-smoke.mjs
    Check-Exit 'Hostinger HTTP smoke'

    Write-Host "BUILD + CONTRACT + HTTP SMOKE PASSED for $commit" -ForegroundColor Green
    Write-Host 'BROWSER QA REMAINS REQUIRED: desktop slow/fast/reverse scroll; Safari/Chrome; mobile/reduced-motion; mascot playback.' -ForegroundColor Yellow
    Write-Host 'Do not interpret this output as permission to merge or publish automatically.' -ForegroundColor Yellow
} catch {
    Write-Error "Release check FAILED: $_"
    throw
} finally {
    if ($server -and !$server.HasExited) {
        Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    }
    if ((Test-Path $stderr) -and (Get-Item $stderr).Length -gt 0) {
        Write-Host 'Server stderr:' -ForegroundColor Yellow
        Get-Content $stderr | Select-Object -Last 30
    }
    Remove-Item $stdout, $stderr -Force -ErrorAction SilentlyContinue
    $env:HOST = $oldHost
    $env:PORT = $oldPort
    $env:BASE_URL = $oldBaseUrl
    Pop-Location
}
