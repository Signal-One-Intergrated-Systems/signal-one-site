"use client";
import { useEffect } from "react";
export function OfflineShell() { useEffect(() => { if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") { navigator.serviceWorker.register("/sw.js").catch(() => { /* Online page remains usable; no offline promise in the UI. */ }); } }, []); return null; }
