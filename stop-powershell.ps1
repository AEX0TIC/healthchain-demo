Write-Host "Stopping all Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "Done! All Node.js processes have been terminated."
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 