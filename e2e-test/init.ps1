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

# Install cypress-mailosaur via npm
npm install cypress-mailosaur --save-dev

# add your API key to your tests
$JSON = @'
{  
  "env": {
    "MAILOSAUR_API_KEY": "NwAmFOYXPVp6JAr3"
  }
}
'@ | ConvertFrom-JSON
$pathToJson = "cypress.json"
$a = Get-Content $pathToJson -raw | ConvertFrom-Json
$a = $JSON
$a | ConvertTo-Json | set-content $pathToJson

# register the commands by appending an import statement to the cypress/support/commands.js file, within your project folder:
Add-Content -Path .\cypress\support\commands.js -Value "import 'cypress-mailosaur'"
