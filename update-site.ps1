$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot
$catalogPath = Join-Path $PSScriptRoot 'all-projects\projects.json'
$projects = Get-Content -Raw $catalogPath | ConvertFrom-Json
$missingProjects = @(
  $projects | ForEach-Object {
    if (-not (Test-Path (Join-Path $PSScriptRoot (Join-Path 'all-projects' $_.directory)))) {
      $_.directory
    }
  }
)

if ($missingProjects.Count -gt 0) {
  throw "Project directories listed in projects.json were not found: $($missingProjects -join ', ')"
}

Write-Host "Validated $($projects.Count) projects. Deploying company site..."
firebase deploy --only hosting
