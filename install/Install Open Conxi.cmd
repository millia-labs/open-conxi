@echo off
rem Double-click installer for Windows. Copies the thirteen Open Conxi skills into
rem %USERPROFILE%\.claude\skills, where Claude Code finds them.
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "DEST=%USERPROFILE%\.claude\skills"
set /p VERSION=<VERSION
if not exist "%DEST%" mkdir "%DEST%"
set DONE=0
set SKIPPED=
for %%s in (hotel-setup hotel-dashboard morning-flash review-replies guest-messages turnover-board work-orders rate-check group-displacement staff-roster ota-reconciliation owner-report hotel-routine) do call :one %%s
echo.
echo Open Conxi %VERSION%: installed !DONE! of 13 skills into %DEST%
if defined SKIPPED echo Left alone, you already have your own skill with this name:!SKIPPED!
echo.
echo Next: quit and reopen Claude Code, then type: set up my hotel
echo.
pause
exit /b 0

:one
if not exist "%~1\SKILL.md" (echo This folder is missing %~1. Download the installer zip again. & pause & exit 1)
if exist "%DEST%\%~1" if not exist "%DEST%\%~1\.open-conxi" (set "SKIPPED=!SKIPPED! %~1" & exit /b 0)
if exist "%DEST%\%~1" rmdir /s /q "%DEST%\%~1"
xcopy "%~1" "%DEST%\%~1\" /e /i /q /y >nul
> "%DEST%\%~1\.open-conxi" echo %VERSION%
set /a DONE+=1
exit /b 0
