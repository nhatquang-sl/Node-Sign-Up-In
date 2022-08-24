# Generate package.json
npm init -y

# Install Cypress via npm
npm install cypress --save-dev

$JSON = @'
{
  "scripts": {
    "test": "cypress open"
  }
}
'@ | ConvertFrom-JSON
$pathToPackageJson = "package.json"
$a = Get-Content $pathToPackageJson -raw | ConvertFrom-Json
$a.scripts = $JSON.scripts
$a | ConvertTo-Json | set-content $pathToPackageJson
