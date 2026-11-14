# Image transfer, before and after

Before: build of `e0d28c8`. After: build of `150197d`. Local `next start`, Chromium, fresh browser context per load (cold browser cache), second of two passes (server image cache warm). "Images" is every image response after scrolling the whole page; "initial" is before any scroll. LCP times are local and unthrottled.

## 390@3x

| Route | Image requests | Image bytes before | after | delta | Initial-load image bytes before | after | Total bytes before | after | LCP image before (variant, bytes, time) | LCP image after | preloaded / priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 36 -> 36 | 1998 KB | 2025 KB | +27 KB (1%) | 1411 KB | 1438 KB | 2905 KB | 2935 KB | approved-full-scene-guard-chef-2026.png w=1200, 176 KB, 336 ms | approved-full-scene-guard-chef-2026.png w=1200, 176 KB, 292 ms | preload yes / fetchpriority=high |
| /solutions/security | 9 -> 9 | 432 KB | 453 KB | +21 KB (5%) | 401 KB | 422 KB | 1203 KB | 1253 KB | team-briefing.22994cd3.webp w=1200, 43 KB, 332 ms | team-briefing.22994cd3.webp w=1920, 63 KB, 232 ms | preload yes / fetchpriority=high |
| /service | 8 -> 8 | 866 KB | 866 KB | +0 KB (0%) | 866 KB | 866 KB | 1659 KB | 1658 KB | p (text), 296 ms | p (text), 336 ms | - |
| /guard-marketplace | 3 -> 3 | 356 KB | 356 KB | +0 KB (0%) | 356 KB | 356 KB | 1153 KB | 1152 KB | team-briefing.webp, 117 KB, 396 ms | team-briefing.webp, 117 KB, 388 ms | preload no / fetchpriority=null |
| /equipment-marketplace | 4 -> 4 | 431 KB | 431 KB | +0 KB (0%) | 431 KB | 431 KB | 1225 KB | 1224 KB | guard-site-operations.webp, 134 KB, 216 ms | guard-site-operations.webp, 134 KB, 340 ms | preload no / fetchpriority=null |
| /radios-equipment | 8 -> 8 | 445 KB | 445 KB | +0 KB (0%) | 389 KB | 389 KB | 1244 KB | 1243 KB | warehouse-security.c5e25a28.webp w=1200, 66 KB, 520 ms | warehouse-security.c5e25a28.webp w=1200, 66 KB, 524 ms | preload no / fetchpriority=null |
| /guard-patrol-software | 6 -> 6 | 414 KB | 414 KB | +0 KB (0%) | 414 KB | 414 KB | 1135 KB | 1213 KB | checkpoint.ac96c24d.webp w=1200, 31 KB, 188 ms | checkpoint.ac96c24d.webp w=1200, 31 KB, 508 ms | preload no / fetchpriority=null |
| /guard-attendance-software | 5 -> 5 | 375 KB | 375 KB | +0 KB (0%) | 375 KB | 375 KB | 1145 KB | 1168 KB | guard-site-operations.13091e81.webp w=1200, 76 KB, 280 ms | guard-site-operations.13091e81.webp w=1200, 76 KB, 260 ms | preload no / fetchpriority=null |
| /ptt-radio-rental | 5 -> 5 | 324 KB | 350 KB | +26 KB (8%) | 324 KB | 350 KB | 1093 KB | 1143 KB | team-briefing.22994cd3.webp w=1200, 52 KB, 364 ms | team-briefing.22994cd3.webp w=1920, 78 KB, 404 ms | preload no / fetchpriority=null |
| /pricing | 3 -> 3 | 490 KB | 490 KB | +0 KB (0%) | 490 KB | 490 KB | 1285 KB | 1282 KB | p (text), 152 ms | p (text), 304 ms | - |
| /contact | 3 -> 3 | 321 KB | 321 KB | +0 KB (0%) | 321 KB | 321 KB | 1117 KB | 1113 KB | team-briefing.webp w=1200, 52 KB, 564 ms | team-briefing.webp w=1200, 52 KB, 352 ms | preload no / fetchpriority=null |
| /get-started | 3 -> 3 | 446 KB | 446 KB | +0 KB (0%) | 446 KB | 446 KB | 1243 KB | 1240 KB | hero-integrated-security.webp w=1200, 74 KB, 392 ms | hero-integrated-security.webp w=1200, 74 KB, 388 ms | preload no / fetchpriority=null |
| /guards | 5 -> 5 | 361 KB | 361 KB | +0 KB (0%) | 361 KB | 361 KB | 1116 KB | 1092 KB | guard-site-operations.13091e81.webp w=1200, 61 KB, 364 ms | guard-site-operations.13091e81.webp w=1200, 61 KB, 224 ms | preload yes / fetchpriority=high |
| /guards/join | 2 -> 2 | 239 KB | 239 KB | +0 KB (0%) | 239 KB | 239 KB | 1031 KB | 1033 KB | p (text), 356 ms | p (text), 344 ms | - |
| /join/sales | 5 -> 5 | 431 KB | 452 KB | +21 KB (5%) | 431 KB | 452 KB | 1187 KB | 1227 KB | team-briefing.22994cd3.webp w=1200, 43 KB, 224 ms | team-briefing.22994cd3.webp w=1920, 63 KB, 284 ms | preload yes / fetchpriority=high |
| /security-trust | 2 -> 2 | 278 KB | 278 KB | +0 KB (0%) | 278 KB | 278 KB | 1027 KB | 989 KB | div (text), 224 ms | div (text), 184 ms | - |
| /privacy | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 914 KB | 912 KB | div (text), 144 ms | div (text), 356 ms | - |
| /popia | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 917 KB | 912 KB | div (text), 224 ms | div (text), 260 ms | - |
| /terms | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 916 KB | 912 KB | div (text), 200 ms | div (text), 156 ms | - |
| **all 19 routes** | 110 -> 110 | **8575 KB** | **8670 KB** | **+95 KB (1%)** | 7901 KB | 7996 KB | 23514 KB | 23701 KB | | | |

## 820@2x

| Route | Image requests | Image bytes before | after | delta | Initial-load image bytes before | after | Total bytes before | after | LCP image before (variant, bytes, time) | LCP image after | preloaded / priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 36 -> 36 | 1875 KB | 2332 KB | +456 KB (24%) | 1513 KB | 1713 KB | 2785 KB | 3238 KB | approved-full-scene-guard-chef-2026.png w=1920, 239 KB, 676 ms | approved-full-scene-guard-chef-2026.png w=1920, 239 KB, 460 ms | preload yes / fetchpriority=high |
| /solutions/security | 9 -> 9 | 453 KB | 453 KB | +0 KB (0%) | 453 KB | 453 KB | 1254 KB | 1253 KB | team-briefing.22994cd3.webp w=1920, 63 KB, 612 ms | section (text), 117 KB, 784 ms | - |
| /service | 8 -> 8 | 804 KB | 804 KB | +0 KB (0%) | 804 KB | 804 KB | 1597 KB | 1597 KB | section (text), 147 KB, 320 ms | section (text), 147 KB, 364 ms | - |
| /guard-marketplace | 3 -> 3 | 356 KB | 356 KB | +0 KB (0%) | 356 KB | 356 KB | 1153 KB | 1152 KB | section (text), 117 KB, 296 ms | section (text), 117 KB, 444 ms | - |
| /equipment-marketplace | 4 -> 4 | 431 KB | 431 KB | +0 KB (0%) | 431 KB | 431 KB | 1223 KB | 1221 KB | section (text), 91 KB, 300 ms | section (text), 91 KB, 380 ms | - |
| /radios-equipment | 8 -> 8 | 451 KB | 451 KB | +0 KB (0%) | 451 KB | 451 KB | 1251 KB | 1252 KB | warehouse-security.c5e25a28.webp w=1920, 92 KB, 572 ms | warehouse-security.c5e25a28.webp w=1920, 92 KB, 504 ms | preload no / fetchpriority=null |
| /guard-patrol-software | 7 -> 7 | 408 KB | 408 KB | +0 KB (0%) | 408 KB | 408 KB | 1205 KB | 1207 KB | checkpoint.ac96c24d.webp w=1920, 31 KB, 524 ms | checkpoint.ac96c24d.webp w=1920, 31 KB, 548 ms | preload no / fetchpriority=null |
| /guard-attendance-software | 5 -> 5 | 406 KB | 406 KB | +0 KB (0%) | 406 KB | 406 KB | 1200 KB | 1199 KB | guard-site-operations.13091e81.webp w=1920, 107 KB, 692 ms | guard-site-operations.13091e81.webp w=1920, 107 KB, 628 ms | preload no / fetchpriority=null |
| /ptt-radio-rental | 5 -> 5 | 350 KB | 350 KB | +0 KB (0%) | 350 KB | 350 KB | 1145 KB | 1146 KB | team-briefing.22994cd3.webp w=1920, 78 KB, 832 ms | team-briefing.22994cd3.webp w=3840, 78 KB, 712 ms | preload no / fetchpriority=null |
| /pricing | 3 -> 3 | 490 KB | 490 KB | +0 KB (0%) | 490 KB | 490 KB | 1283 KB | 1282 KB | section (text), 117 KB, 324 ms | section (text), 117 KB, 288 ms | - |
| /contact | 3 -> 3 | 347 KB | 347 KB | +0 KB (0%) | 347 KB | 347 KB | 1140 KB | 1138 KB | team-briefing.webp w=1920, 78 KB, 280 ms | team-briefing.webp w=1920, 78 KB, 316 ms | preload no / fetchpriority=null |
| /get-started | 3 -> 3 | 405 KB | 446 KB | +42 KB (10%) | 405 KB | 446 KB | 1201 KB | 1238 KB | hero-integrated-security.webp w=640, 32 KB, 360 ms | hero-integrated-security.webp w=1200, 74 KB, 552 ms | preload no / fetchpriority=null |
| /guards | 5 -> 5 | 385 KB | 385 KB | +0 KB (0%) | 385 KB | 385 KB | 1186 KB | 1180 KB | section (text), 117 KB, 412 ms | section (text), 117 KB, 528 ms | - |
| /guards/join | 2 -> 2 | 239 KB | 239 KB | +0 KB (0%) | 239 KB | 239 KB | 1031 KB | 1032 KB | main (text), 117 KB, 304 ms | main (text), 117 KB, 244 ms | - |
| /join/sales | 5 -> 5 | 452 KB | 452 KB | +0 KB (0%) | 452 KB | 452 KB | 1265 KB | 1264 KB | section (text), 147 KB, 512 ms | none | - |
| /security-trust | 2 -> 2 | 278 KB | 278 KB | +0 KB (0%) | 278 KB | 278 KB | 1070 KB | 1069 KB | div (text), 328 ms | div (text), 264 ms | - |
| /privacy | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 914 KB | 914 KB | div (text), 200 ms | div (text), 164 ms | - |
| /popia | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 914 KB | 914 KB | div (text), 132 ms | div (text), 136 ms | - |
| /terms | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 916 KB | 912 KB | div (text), 196 ms | div (text), 148 ms | - |
| **all 19 routes** | 111 -> 111 | **8497 KB** | **8995 KB** | **+498 KB (6%)** | 8135 KB | 8377 KB | 23732 KB | 24207 KB | | | |

## 1440@1x

| Route | Image requests | Image bytes before | after | delta | Initial-load image bytes before | after | Total bytes before | after | LCP image before (variant, bytes, time) | LCP image after | preloaded / priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 36 -> 36 | 1485 KB | 1508 KB | +23 KB (2%) | 1324 KB | 1341 KB | 2394 KB | 2415 KB | approved-full-scene-guard-chef-2026.png w=1920, 239 KB, 336 ms | approved-full-scene-guard-chef-2026.png w=1920, 239 KB, 440 ms | preload yes / fetchpriority=high |
| /solutions/security | 9 -> 9 | 393 KB | 441 KB | +48 KB (12%) | 393 KB | 441 KB | 1194 KB | 1242 KB | section (text), 117 KB, 1112 ms | section (text), 117 KB, 1060 ms | - |
| /service | 8 -> 8 | 778 KB | 778 KB | +0 KB (0%) | 778 KB | 778 KB | 1572 KB | 1569 KB | section (text), 147 KB, 324 ms | section (text), 147 KB, 1632 ms | - |
| /guard-marketplace | 3 -> 3 | 356 KB | 356 KB | +0 KB (0%) | 356 KB | 356 KB | 1153 KB | 1152 KB | team-briefing.webp, 117 KB, 964 ms | team-briefing.webp, 117 KB, 332 ms | preload no / fetchpriority=null |
| /equipment-marketplace | 4 -> 4 | 431 KB | 431 KB | +0 KB (0%) | 431 KB | 431 KB | 1227 KB | 1223 KB | section (text), 91 KB, 828 ms | section (text), 91 KB, 984 ms | - |
| /radios-equipment | 8 -> 8 | 370 KB | 394 KB | +24 KB (6%) | 370 KB | 394 KB | 1170 KB | 1192 KB | warehouse-security.c5e25a28.webp w=750, 41 KB, 544 ms | warehouse-security.c5e25a28.webp w=750, 41 KB, 724 ms | preload no / fetchpriority=null |
| /guard-patrol-software | 7 -> 7 | 368 KB | 368 KB | +0 KB (0%) | 368 KB | 368 KB | 1166 KB | 1165 KB | checkpoint.ac96c24d.webp w=750, 21 KB, 1124 ms | checkpoint.ac96c24d.webp w=750, 21 KB, 460 ms | preload no / fetchpriority=null |
| /guard-attendance-software | 5 -> 5 | 346 KB | 346 KB | +0 KB (0%) | 346 KB | 346 KB | 1140 KB | 1140 KB | guard-site-operations.13091e81.webp w=750, 47 KB, 604 ms | guard-site-operations.13091e81.webp w=750, 47 KB, 480 ms | preload no / fetchpriority=null |
| /ptt-radio-rental | 5 -> 5 | 303 KB | 319 KB | +15 KB (5%) | 303 KB | 319 KB | 1098 KB | 1112 KB | team-briefing.22994cd3.webp w=750, 31 KB, 836 ms | team-briefing.22994cd3.webp w=1080, 47 KB, 776 ms | preload no / fetchpriority=null |
| /pricing | 3 -> 3 | 490 KB | 490 KB | +0 KB (0%) | 490 KB | 490 KB | 1283 KB | 1282 KB | section (text), 117 KB, 568 ms | section (text), 117 KB, 252 ms | - |
| /contact | 3 -> 3 | 295 KB | 295 KB | +0 KB (0%) | 295 KB | 295 KB | 1089 KB | 1086 KB | team-briefing.webp w=640, 26 KB, 572 ms | team-briefing.webp w=640, 26 KB, 748 ms | preload no / fetchpriority=null |
| /get-started | 3 -> 3 | 405 KB | 405 KB | +0 KB (0%) | 405 KB | 405 KB | 1198 KB | 1170 KB | hero-integrated-security.webp w=640, 32 KB, 632 ms | hero-integrated-security.webp w=640, 32 KB, 928 ms | preload no / fetchpriority=null |
| /guards | 5 -> 5 | 337 KB | 385 KB | +48 KB (14%) | 337 KB | 385 KB | 1134 KB | 1180 KB | section (text), 117 KB, 808 ms | none | - |
| /guards/join | 2 -> 2 | 239 KB | 239 KB | +0 KB (0%) | 239 KB | 239 KB | 1031 KB | 1032 KB | main (text), 117 KB, 820 ms | main (text), 117 KB, 720 ms | - |
| /join/sales | 5 -> 5 | 415 KB | 452 KB | +38 KB (9%) | 415 KB | 452 KB | 1137 KB | 1265 KB | none | section (text), 147 KB, 940 ms | - |
| /security-trust | 2 -> 2 | 278 KB | 278 KB | +0 KB (0%) | 278 KB | 278 KB | 1073 KB | 1069 KB | h1 (text), 404 ms | h1 (text), 428 ms | - |
| /privacy | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 916 KB | 912 KB | div (text), 208 ms | div (text), 312 ms | - |
| /popia | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 914 KB | 912 KB | div (text), 264 ms | div (text), 132 ms | - |
| /terms | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 913 KB | 912 KB | div (text), 232 ms | div (text), 196 ms | - |
| **all 19 routes** | 111 -> 111 | **7656 KB** | **7853 KB** | **+197 KB (3%)** | 7495 KB | 7686 KB | 22803 KB | 23033 KB | | | |

## 1440@2x

| Route | Image requests | Image bytes before | after | delta | Initial-load image bytes before | after | Total bytes before | after | LCP image before (variant, bytes, time) | LCP image after | preloaded / priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 36 -> 36 | 1872 KB | 1905 KB | +32 KB (2%) | 1539 KB | 1539 KB | 2782 KB | 2813 KB | approved-full-scene-guard-chef-2026.png w=3840, 239 KB, 364 ms | approved-full-scene-guard-chef-2026.png w=3840, 239 KB, 580 ms | preload yes / fetchpriority=high |
| /solutions/security | 9 -> 9 | 453 KB | 453 KB | +0 KB (0%) | 453 KB | 453 KB | 1255 KB | 1253 KB | none | section (text), 117 KB, 876 ms | - |
| /service | 8 -> 8 | 919 KB | 919 KB | +0 KB (0%) | 919 KB | 919 KB | 1713 KB | 1710 KB | section (text), 147 KB, 836 ms | section (text), 147 KB, 948 ms | - |
| /guard-marketplace | 3 -> 3 | 356 KB | 356 KB | +0 KB (0%) | 356 KB | 356 KB | 1153 KB | 1152 KB | team-briefing.webp, 117 KB, 840 ms | team-briefing.webp, 117 KB, 524 ms | preload no / fetchpriority=null |
| /equipment-marketplace | 4 -> 4 | 431 KB | 431 KB | +0 KB (0%) | 431 KB | 431 KB | 1223 KB | 1221 KB | section (text), 91 KB, 1016 ms | section (text), 91 KB, 392 ms | - |
| /radios-equipment | 8 -> 8 | 451 KB | 471 KB | +20 KB (4%) | 451 KB | 471 KB | 1251 KB | 1269 KB | warehouse-security.c5e25a28.webp w=1920, 92 KB, 940 ms | warehouse-security.c5e25a28.webp w=1920, 92 KB, 904 ms | preload no / fetchpriority=null |
| /guard-patrol-software | 7 -> 7 | 401 KB | 401 KB | +0 KB (0%) | 401 KB | 401 KB | 1198 KB | 1198 KB | checkpoint.ac96c24d.webp w=1920, 31 KB, 536 ms | checkpoint.ac96c24d.webp w=1920, 31 KB, 808 ms | preload no / fetchpriority=null |
| /guard-attendance-software | 5 -> 5 | 406 KB | 406 KB | +0 KB (0%) | 406 KB | 406 KB | 1200 KB | 1200 KB | guard-site-operations.13091e81.webp w=1920, 107 KB, 904 ms | guard-site-operations.13091e81.webp w=1920, 107 KB, 784 ms | preload no / fetchpriority=null |
| /ptt-radio-rental | 5 -> 5 | 350 KB | 350 KB | +0 KB (0%) | 350 KB | 350 KB | 1145 KB | 1143 KB | team-briefing.22994cd3.webp w=1920, 78 KB, 1052 ms | team-briefing.22994cd3.webp w=1920, 78 KB, 840 ms | preload no / fetchpriority=null |
| /pricing | 3 -> 3 | 490 KB | 490 KB | +0 KB (0%) | 490 KB | 490 KB | 1288 KB | 1282 KB | section (text), 117 KB, 544 ms | section (text), 117 KB, 320 ms | - |
| /contact | 3 -> 3 | 347 KB | 347 KB | +0 KB (0%) | 347 KB | 347 KB | 1140 KB | 1140 KB | team-briefing.webp w=1920, 78 KB, 796 ms | team-briefing.webp w=1920, 78 KB, 596 ms | preload no / fetchpriority=null |
| /get-started | 3 -> 3 | 437 KB | 446 KB | +9 KB (2%) | 437 KB | 446 KB | 1231 KB | 1241 KB | hero-integrated-security.webp w=1080, 65 KB, 908 ms | hero-integrated-security.webp w=1200, 74 KB, 836 ms | preload no / fetchpriority=null |
| /guards | 5 -> 5 | 385 KB | 385 KB | +0 KB (0%) | 385 KB | 385 KB | 1076 KB | 1180 KB | none | none | - |
| /guards/join | 2 -> 2 | 239 KB | 239 KB | +0 KB (0%) | 239 KB | 239 KB | 1033 KB | 1029 KB | main (text), 117 KB, 384 ms | main (text), 117 KB, 776 ms | - |
| /join/sales | 5 -> 5 | 452 KB | 452 KB | +0 KB (0%) | 452 KB | 452 KB | 1265 KB | 1122 KB | section (text), 147 KB, 556 ms | section (text), 147 KB, 1024 ms | - |
| /security-trust | 2 -> 2 | 278 KB | 278 KB | +0 KB (0%) | 278 KB | 278 KB | 1070 KB | 1072 KB | h1 (text), 536 ms | h1 (text), 324 ms | - |
| /privacy | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 915 KB | 912 KB | div (text), 308 ms | div (text), 168 ms | - |
| /popia | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 914 KB | 914 KB | div (text), 200 ms | div (text), 224 ms | - |
| /terms | 1 -> 1 | 122 KB | 122 KB | +0 KB (0%) | 122 KB | 122 KB | 913 KB | 912 KB | div (text), 304 ms | div (text), 320 ms | - |
| **all 19 routes** | 111 -> 111 | **8635 KB** | **8697 KB** | **+61 KB (1%)** | 8301 KB | 8330 KB | 23766 KB | 23765 KB | | | |

## Routes over the thresholds (image bytes up by more than 35%, or LCP image above 300 KB)

None.
