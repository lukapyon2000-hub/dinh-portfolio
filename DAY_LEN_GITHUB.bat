@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==============================================
echo   DAY PROJECT LEN GITHUB (repo moi)
echo ==============================================
echo.
git --version >nul 2>&1
if errorlevel 1 (
  echo CHUA CAI GIT. Tai tai: https://git-scm.com/download/win
  echo Cai xong, chay lai file nay.
  pause
  exit /b
)
echo Dan link repo moi (vi du: https://github.com/ten-ban/ten-repo.git)
set /p REPO=Link repo: 
if "%REPO%"=="" (
  echo Ban chua nhap link. Chay lai file va dan link repo.
  pause
  exit /b
)
for /f "delims=" %%i in ('git config user.name') do set GUN=%%i
for /f "delims=" %%i in ('git config user.email') do set GUE=%%i
if "%GUN%"=="" git config --global user.name "Dinh Dinh"
if "%GUE%"=="" (
  set /p MAIL=Nhap email GitHub cua ban: 
  call git config --global user.email "%MAIL%"
)
if exist .git rmdir /s /q .git
git init
git add -A
git commit -m "interactive portfolio"
git branch -M main
git remote add origin %REPO%
git push -u origin main --force
echo.
echo ==============================================
echo Neu khong co loi do o tren: vao GitHub
echo  1. Settings - Pages - Source: chon "GitHub Actions"
echo  2. Tab Actions - cho dau tich xanh
echo  3. Link web nam o Settings - Pages
echo ==============================================
pause
