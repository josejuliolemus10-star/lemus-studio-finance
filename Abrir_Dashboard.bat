@echo off
chcp 65001 > nul
title Lemus Studio — Financial Dashboard
cd /d "C:\Users\josej\OneDrive\Desktop\Conta"

echo ========================================================
echo       LEMUS STUDIO — FINANCIAL DASHBOARD PRIVADO
echo ========================================================
echo.
echo [1/2] Abriendo el Dashboard en tu navegador...
start http://localhost:5173/
echo.
echo [2/2] Servidor local activo en http://localhost:5173/
echo Puedes minimizar esta ventana.
echo Para cerrarlo cuando termines, simplemente cierra esta ventana.
echo.
call npm.cmd run dev
pause
