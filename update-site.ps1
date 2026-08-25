$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot
$projects = Get-Content -Raw projects.json | ConvertFrom-Json
$missingProjects = @(
  $projects | ForEach-Object {
    if (-not (Test-Path (Join-Path (Split-Path $PSScriptRoot -Parent) $_.directory))) {
      $_.directory
    }
  }
)

if ($missingProjects.Count -gt 0) {
  throw "Project directories listed in projects.json were not found: $($missingProjects -join ', ')"
}

Write-Host "Validated $($projects.Count) projects. Deploying company site..."
firebase deploy --only hosting
