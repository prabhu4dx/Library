"use client"

import { useState, useRef, useEffect } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const P = {
  bg:       "#FAF7F2",
  surface:  "#FFFDF8",
  panel:    "#F5F0E8",
  border:   "#E7E0D5",
  borderFaint: "#F0EBE3",
  text:     "#1C1917",
  textMid:  "#44403C",
  textSoft: "#78716C",
  textMute: "#A8A29E",
  amber:    "#B45309",
  amberLt:  "#FEF3C7",
  amberMd:  "#FDE68A",
  green:    "#15803D",
  greenLt:  "#DCFCE7",
  red:      "#B91C1C",
  redLt:    "#FEE2E2",
  blue:     "#1D4ED8",
  blueLt:   "#DBEAFE",
  purple:   "#6D28D9",
  purpleLt: "#EDE9FE",
};

// ─── COLOR DATA ───────────────────────────────────────────────────────────────
const COLOR_SYSTEMS = [
  {
    id:"srgb", name:"sRGB", short:"Standard RGB", year:1996, era:"digital",
    category:"rgb", domain:["web","display","design"], hardware:["monitor","mobile","lcd"],
    layer:"software", gamut:35.9, type:"additive", deviceDep:true,
    creator:"HP & Microsoft", hex:"#3B82F6",
    description:"The universal web color standard. Every untagged image, CSS color, and PNG defaults to sRGB. Born to match CRT monitors in 1996 and now the bedrock of the internet.",
    fundamentals:"Uses three channels R, G, B each 0–255. Applies a piecewise gamma curve (~2.2 effective) that maps perceptual brightness to code values efficiently. Primaries at CIE xy: R(0.64, 0.33), G(0.30, 0.60), B(0.15, 0.06), D65 white point.",
    strengths:["Universal compatibility","Understood by all devices","Browser default","Zero conversion cost"],
    weaknesses:["Only 35.9% of visible colors","Not perceptually uniform","CRT-era limitation","Can't express vivid P3 colors"],
    useCase:"Web UI, icons, all digital design baseline",
    css:"color: rgb(59 130 246)",
    hardware_detail:"Every monitor, phone, and tablet supports sRGB. GPU drivers map sRGB values to physical display primaries via ICC color management.",
    related:["display-p3","rec709","oklab"],
    tags:["web","css","default","display"],
    quickFact:"~99.9% of web content is sRGB — it is the web."
  },
  {
    id:"display-p3", name:"Display P3", short:"Wide Gamut Display", year:2015, era:"digital",
    category:"rgb", domain:["web","design","mobile","film"], hardware:["apple-display","oled","qled"],
    layer:"software", gamut:53.6, type:"additive", deviceDep:true,
    creator:"Apple (DCI-P3 base)", hex:"#10B981",
    description:"25% larger gamut than sRGB. Every Apple device since 2016, modern Android flagships, and high-end monitors display P3 natively. The new consumer standard for vibrant screens.",
    fundamentals:"Same piecewise gamma ~2.2 as sRGB but wider primaries: R(0.68, 0.32) sits deeper red, G(0.265, 0.69) is more vivid green. D65 white point. Specified in CSS as color(display-p3 r g b).",
    strengths:["25% more color area than sRGB","Native on all modern Apple/Samsung devices","CSS Level 4 support","Same workflow as sRGB"],
    weaknesses:["Windows unmanaged apps over-saturate","Not universal (yet)","No HDR support"],
    useCase:"Modern app design, photography UI, video streaming interfaces",
    css:"color: color(display-p3 0.06 0.72 0.5)",
    hardware_detail:"OLED and modern IPS panels achieve 95–100% P3. The display driver maps sRGB signals through the panel's ICC profile automatically.",
    related:["srgb","rec2020","dci-p3"],
    tags:["web","css","apple","wide-gamut"],
    quickFact:"iPhone 15 Pro displays ~100% P3. Every photo you shoot on it is P3."
  },
  {
    id:"oklch", name:"OKLCH", short:"Perceptual Polar", year:2020, era:"modern",
    category:"perceptual", domain:["web","design","accessibility"], hardware:["all"],
    layer:"software", gamut:100, type:"perceptual", deviceDep:false,
    creator:"Björn Ottosson", hex:"#F59E0B",
    description:"The future of web color. Perceptually uniform — equal numeric steps feel visually equal. Perfect for design systems: generate tonal scales, ensure WCAG compliance, mix colors safely.",
    fundamentals:"L = lightness (0–1), C = chroma (0–0.4+), H = hue angle (0–360°). Built on OKLAB: two optimized matrix transforms bracketing a cube-root, calibrated against CAM16 perceptual data. Hue stays pure when you adjust L or C.",
    strengths:["Truly perceptually uniform","Hue constant when adjusting lightness","Device-independent","WCAG contrast via L-channel","CSS Level 4 native"],
    weaknesses:["Requires CSS Level 4 (≥92% support)","Some vivid colors exceed sRGB gamut","Learning curve on C axis range"],
    useCase:"Design tokens, color scales, accessible palettes, dark mode variants",
    css:"color: oklch(0.70 0.15 220)",
    hardware_detail:"Hardware-agnostic. Browser converts OKLCH→XYZ→sRGB or P3 based on display capabilities. Pure software math.",
    related:["oklab","lab","lch","cam16"],
    tags:["css","perceptual","design-system","accessibility","modern"],
    quickFact:"Tailwind CSS v4, Radix UI, and shadcn/ui all shifted to OKLCH for color tokens."
  },
  {
    id:"oklab", name:"OKLAB", short:"Perceptual Cartesian", year:2020, era:"modern",
    category:"perceptual", domain:["web","design","image-processing"], hardware:["all"],
    layer:"software", gamut:100, type:"perceptual", deviceDep:false,
    creator:"Björn Ottosson", hex:"#8B5CF6",
    description:"OKLCH's sibling — Cartesian instead of polar. Axes a (green↔red) and b (blue↔yellow) mirror human neural opponent channels. Adobe Photoshop uses it for gradient interpolation since 2023.",
    fundamentals:"XYZ → LMS via matrix M1 → cube-root → opponent axes via M2. Innovation: M1 and M2 optimized against CAM16-UCS predictions and MacAdam ellipse data. ~10 lines of math, outperforms CIELAB at everything.",
    strengths:["Zero hue shift in gradients","Simple 10-line math","Fast computation","Adopted in Photoshop"],
    weaknesses:["a/b axes less intuitive for designers","No direct saturation knob — use OKLCH for that"],
    useCase:"Gradient interpolation, color blending in creative tools, image filters",
    css:"color: oklab(0.7 -0.1 -0.08)",
    hardware_detail:"Software only. Photoshop's gradient engine switches to OKLAB internally since CC 2023.",
    related:["oklch","lab","ipt"],
    tags:["css","perceptual","gradients","modern"],
    quickFact:"A blue→white gradient in sRGB goes purple. In OKLAB it stays clean."
  },
  {
    id:"lab", name:"CIELAB (L*a*b*)", short:"CIE Perceptual", year:1976, era:"scientific",
    category:"perceptual", domain:["print","industrial","science","photography"], hardware:["spectrophotometer","colorimeter"],
    layer:"measurement", gamut:100, type:"perceptual", deviceDep:false,
    creator:"CIE", hex:"#EF4444",
    description:"The industrial standard for color difference. Used in paint, food science, dental materials, and print QC for 50 years. ΔE values quantify 'just noticeable differences' between two colors.",
    fundamentals:"L* (0–100 lightness), a* (green→red), b* (blue→yellow). Cube-root function referenced to D50 white. CIEDE2000 is the current CIE color-difference formula — adds rotation terms for blue and lightness-dependent corrections.",
    strengths:["50-year industrial standard","Gamut-independent","ΔE color difference metric","ICC Profile Connection Space"],
    weaknesses:["Hue non-linearity in saturated blues","D50 white (vs D65 for displays)","OKLAB surpasses it on uniformity"],
    useCase:"Paint/print QC, food grading, dental shade matching, ICC color profiles",
    css:"color: lab(55 -10 -50)",
    hardware_detail:"Spectrophotometers measure reflectance spectra and compute LAB. Used as the ICC Profile Connection Space (PCS).",
    related:["lch","oklab","hunter-lab","xyz"],
    tags:["print","industrial","science","delta-e"],
    quickFact:"ΔE < 1 = imperceptible difference. ΔE 2–4 = noticeable to trained eyes."
  },
  {
    id:"xyz", name:"CIE XYZ", short:"The Universal Foundation", year:1931, era:"science",
    category:"cie", domain:["science","standards","all"], hardware:["spectrophotometer","all"],
    layer:"foundation", gamut:100, type:"absolute", deviceDep:false,
    creator:"CIE", hex:"#6B7280",
    description:"Every color space ever defined converts through XYZ. The 1931 foundation from color-matching experiments. Y channel = luminance. The horseshoe chromaticity diagram lives here.",
    fundamentals:"Three color-matching functions x̄(λ), ȳ(λ), z̄(λ) integrate spectral power against the 2° standard observer. Y=luminance. All RGB spaces define primaries as (x,y) coordinates in the chromaticity diagram. Not perceptually uniform — MacAdam ellipses vary 50:1 across the diagram.",
    strengths:["Universal reference","Device-independent absolute","Encompasses all visible colors","Perfect linearity for math"],
    weaknesses:["Not perceptually uniform","Abstract axes (no visual meaning)","Never used directly in design"],
    useCase:"Color space definitions, ICC profiles, scientific measurement, camera characterization",
    css:"color(xyz-d65 0.18 0.15 0.77)",
    hardware_detail:"Spectrophotometers integrate measured spectra against CIE CMFs to produce XYZ. The ICC Profile Connection Space uses XYZ D50.",
    related:["lab","xyy","all"],
    tags:["foundation","science","cie","universal"],
    quickFact:"Published September 1931. Still the lingua franca of all color science, 93 years later."
  },
  {
    id:"hsl", name:"HSL", short:"Hue Saturation Lightness", year:1978, era:"digital",
    category:"designer", domain:["web","design","css"], hardware:["software-only"],
    layer:"software", gamut:35.9, type:"additive", deviceDep:true,
    creator:"Joblove & Greenberg", hex:"#EC4899",
    description:"CSS's original intuitive model — pick a hue (0–360°), set saturation, adjust lightness. Widely used but perceptually unreliable: S=100% L=50% yellow is far brighter than the same settings for blue.",
    fundamentals:"Double-cone geometry. Hue = angle on color wheel. Saturation = colorfulness. L=50% = pure hue, L=0% = black, L=100% = white. It's entirely a remapping of the sRGB cube — not a new color space.",
    strengths:["Very intuitive for designers","CSS support since 2003","Easy hue rotation","Color picker standard"],
    weaknesses:["Not perceptually uniform","Yellow at L=50% is 3× brighter than blue","Wrong tool for accessible palette design"],
    useCase:"Quick color picking, CSS manipulation, learning color relationships",
    css:"color: hsl(220 70% 60%)",
    hardware_detail:"Pure software transform. Mathematically equivalent to sRGB — just a different interface.",
    related:["hsv","hwb","oklch","srgb"],
    tags:["css","design","intuitive","srgb-family"],
    quickFact:"Still #1 used CSS color function — despite being perceptually broken."
  },
  {
    id:"hsv", name:"HSV / HSB", short:"Hue Saturation Value", year:1978, era:"digital",
    category:"designer", domain:["design","photography"], hardware:["software-only"],
    layer:"software", gamut:35.9, type:"additive", deviceDep:true,
    creator:"Alvy Ray Smith (NYIT)", hex:"#F97316",
    description:"The design tool color picker. Powers Photoshop, Figma, Sketch, Procreate. Value = brightness of the hue at full saturation. Mental model: start vivid, then darken or desaturate.",
    fundamentals:"Value = max(R,G,B). Single inverted cone. At V=100%, S=100% you get the purest hue. Lower V = darker. Lower S = more gray. Simpler artist mental model than HSL for 'start with a saturated color and control it.'",
    strengths:["Intuitive for artists/painters","Industry-standard picker","Single cone is simpler","Great for darkening workflow"],
    weaknesses:["Not perceptually uniform","Same yellow/blue brightness issue as HSL"],
    useCase:"Photoshop, Figma, Sketch color pickers — daily design work",
    css:"/* No direct CSS — convert to hsl() or oklch() */",
    hardware_detail:"Software only. Standard in GPU-adjacent tools like game engines for quick color manipulation.",
    related:["hsl","hwb","oklch"],
    tags:["design","photoshop","figma","color-picker"],
    quickFact:"Alvy Ray Smith invented HSV in 1978 at NYIT — the same lab where CGI was born."
  },
  {
    id:"hwb", name:"HWB", short:"Hue Whiteness Blackness", year:1996, era:"digital",
    category:"designer", domain:["web","design"], hardware:["software-only"],
    layer:"software", gamut:35.9, type:"additive", deviceDep:true,
    creator:"Alvy Ray Smith", hex:"#14B8A6",
    description:"The most intuitive RGB-based model. Pick a hue, mix in whiteness to lighten or blackness to darken. Smith invented this specifically to fix the confusing saturation axis of HSV/HSL.",
    fundamentals:"H = hue angle. W = whiteness (0–100%). B = blackness (0–100%). W+B can exceed 100% — values are normalized. If W+B > 100: W'=W/(W+B), B'=B/(W+B). Mathematically converts to/from sRGB trivially. CSS Level 4 supported.",
    strengths:["Most intuitive model for non-designers","Natural 'mix paint' mental model","CSS Level 4 native"],
    weaknesses:["Still sRGB-derived, not perceptually uniform","Less tool support than HSL/HSV"],
    useCase:"Simple color pickers, paint-mixing interfaces, beginner-friendly tools",
    css:"color: hwb(220 20% 20%)",
    hardware_detail:"Software only. Converts trivially to sRGB.",
    related:["hsl","hsv","oklch"],
    tags:["css","design","intuitive","modern"],
    quickFact:"Smith called HSV 'flawed' in his 1996 paper introducing HWB as the fix."
  },
  {
    id:"cmyk", name:"CMYK", short:"Cyan Magenta Yellow Key", year:1906, era:"print",
    category:"print", domain:["print","packaging","branding"], hardware:["inkjet","offset","laser","flexo"],
    layer:"hardware", gamut:30, type:"subtractive", deviceDep:true,
    creator:"Printing Industry", hex:"#0891B2",
    description:"The print standard. Subtractive mixing: each ink absorbs its opposite. Black ink (K) added because CMY mixing produces muddy brown, not true black. Every printed page you've read uses CMYK.",
    fundamentals:"C absorbs red. M absorbs green. Y absorbs blue. K (Key/Black) replaces neutral CMY combinations via GCR (Gray Component Replacement) — saves ink, improves gray balance, reduces drying time. Device-dependent: same values look different on different press/paper combos.",
    strengths:["Print industry standard worldwide","Spot color integration","Physical ink formulations"],
    weaknesses:["Device-dependent (press/paper/ink vary)","Gamut smaller than sRGB in blues/purples","Complex ICC profile management required"],
    useCase:"All commercial printing: packaging, brand identity, magazines, brochures",
    css:"/* Not supported — convert via ICC profile */",
    hardware_detail:"Offset press, inkjet, laser printers all use CMYK. RIPs convert RGB through ICC profiles (FOGRA51 for EU coated, GRACoL for US) to device CMYK. Total ink limit: 300% coated, 240% uncoated.",
    related:["pantone","lab","srgb"],
    tags:["print","subtractive","ink","packaging"],
    quickFact:"The K in CMYK stands for 'Key plate' — the black printing plate that registers all other colors."
  },
  {
    id:"munsell", name:"Munsell", short:"Perceptual Order System", year:1905, era:"pre-digital",
    category:"order", domain:["art","soil","forensics","dental","brewing"], hardware:["physical-atlas","spectrophotometer"],
    layer:"physical", gamut:100, type:"perceptual", deviceDep:false,
    creator:"Albert H. Munsell", hex:"#84CC16",
    description:"The perceptual gold standard. The irregular 'color tree' shaped purely by human perception — no formulas, just empirical observation. USDA adopted it for soil classification in the 1930s.",
    fundamentals:"Hue (100 steps), Value (0–10 lightness), Chroma (0 to max — varies by hue). The tree is asymmetric because perception is: yellows reach higher chroma than purples. The 1943 OSA Renotation standardized it via psychophysical experiment.",
    strengths:["Truly perceptually uniform","Independent dimensions","Physical atlas for real-world use","Scientific benchmark"],
    weaknesses:["Physical system (not digital native)","No CSS","Requires training to read notation"],
    useCase:"Soil science (USDA), archaeology, dental shade matching, forensic pathology, brewing QC",
    css:"/* No CSS — convert via CIE XYZ lookup tables */",
    hardware_detail:"Physical atlases of painted chips. X-Rite spectrophotometers report Munsell notation by matching measured LAB against the Munsell renotation database.",
    related:["lab","ncs","cie"],
    tags:["physical","soil","science","historical","perceptual"],
    quickFact:"Forensic labs use Munsell to precisely describe soil found on shoes or clothing from crime scenes."
  },
  {
    id:"pantone", name:"Pantone (PMS)", short:"Spot Color Standard", year:1963, era:"print",
    category:"print", domain:["branding","packaging","fashion","print"], hardware:["offset","spot-color-press"],
    layer:"physical", gamut:70, type:"spot", deviceDep:false,
    creator:"Lawrence Herbert", hex:"#7C3AED",
    description:"The universal language of brand color. 2000+ spot colors, each with a precise ink recipe from 14 base inks. Pantone 485 C is the same red at every printer worldwide. The 2022 Adobe dispute turned Pantone-referenced files black.",
    fundamentals:"Not a mathematical model — a standardized ink library. Each number has a coated (C) and uncoated (U) version. Digital HEX/RGB/CMYK equivalents are approximations — never exact. The fan deck is the physical truth.",
    strengths:["Universal cross-printer consistency","Extends beyond CMYK gamut","Industry standard for brand color specs"],
    weaknesses:["Proprietary — requires paid subscription in Adobe","CMYK/RGB equivalents are approximations","Digital color only hints at the real ink"],
    useCase:"Brand identity systems, packaging, fashion, signage, annual reports",
    css:"/* No CSS — use approximated sRGB hex value */",
    hardware_detail:"14 base inks mixed to formula. Offset press prints a dedicated plate. Each spot color adds ~$200–500 per job. Fan decks recalibrate yearly as inks change.",
    related:["cmyk","ral","munsell"],
    tags:["print","brand","spot-color","physical"],
    quickFact:"Lawrence Herbert bought the entire Pantone printing division in 1962 for $50,000."
  },
  {
    id:"ral", name:"RAL", short:"European Industrial", year:1927, era:"industrial",
    category:"order", domain:["architecture","manufacturing","automotive","signage"], hardware:["powder-coat","paint","anodizing"],
    layer:"physical", gamut:60, type:"physical", deviceDep:false,
    creator:"Reichs-Ausschuß für Lieferbedingungen", hex:"#DC2626",
    description:"Created in 1927 with 40 colors, now 2,831. The European standard for traffic signage, industrial machinery, powder coating, and architecture. RAL 1003 = Signal Yellow on every European road sign.",
    fundamentals:"RAL Classic: 4-digit codes (RAL 5010 = Gentian Blue). RAL Design: 7-digit codes directly encoding CIELCH (hue×100, lightness×10, chroma×10). RAL Effect: 490 colors including metallics. Each defined by spectrophotometric measurement.",
    strengths:["European manufacturing standard","Covers metallics and special finishes","RAL Design system is CIELCH-based"],
    weaknesses:["European focus","Physical fan decks required","Digital conversions imprecise"],
    useCase:"European architecture, powder coating, traffic signage, automotive body finishes",
    css:"/* Use approximate sRGB value from RAL conversion tables */",
    hardware_detail:"Powder coating, liquid paint, anodizing, vinyl wrap — all reference RAL codes. Spectrophotometer verifies against master standards.",
    related:["pantone","munsell","ncs"],
    tags:["industrial","european","architecture","powder-coat"],
    quickFact:"RAL stands for 'Reichsausschuss für Lieferbedingungen' — the 1927 German government supply committee."
  },
  {
    id:"ycbcr", name:"YCbCr", short:"Video Luma-Chroma", year:1982, era:"broadcast",
    category:"video", domain:["video","streaming","compression","broadcast"], hardware:["camera","codec","display"],
    layer:"hardware", gamut:35.9, type:"luma-chroma", deviceDep:true,
    creator:"ITU (BT.601 / BT.709)", hex:"#0EA5E9",
    description:"The most common color representation in digital media. JPEG, H.264, H.265, Blu-ray, streaming — all use YCbCr internally. Y=luminance, Cb=blue difference, Cr=red difference.",
    fundamentals:"Y' = 0.299R + 0.587G + 0.114B. Cb = B - Y (blue-difference). Cr = R - Y (red-difference). Chroma subsampling 4:2:0 drops 75% of color data — vision barely notices. Limited range (Y:16–235) vs Full range (0–255): confusion causes washed-out blacks.",
    strengths:["50% bandwidth savings via chroma subsampling","Broadcast/streaming standard","Backward compatible with B&W TV"],
    weaknesses:["Device-dependent","Limited/Full range confusion causes display errors","Not for design work"],
    useCase:"Video codecs, JPEG, streaming, Blu-ray, broadcast TV, camera sensors",
    css:"/* Not a CSS color space — internal codec format */",
    hardware_detail:"Camera ISPs output YCbCr from Bayer sensor data. H.264/H.265 codecs (NVENC, VideoToolbox) encode/decode in YCbCr 4:2:0. Display scalers convert back to RGB.",
    related:["rec709","rec2020","yuv"],
    tags:["video","codec","streaming","broadcast","compression"],
    quickFact:"Your Netflix stream, YouTube video, and phone camera all use 4:2:0 YCbCr internally."
  },
  {
    id:"rec2020", name:"Rec. 2020", short:"UHDTV Wide Gamut", year:2012, era:"modern",
    category:"rgb", domain:["video","hdr","uhdtv","streaming"], hardware:["qled","oled-pro","laser-projector"],
    layer:"hardware", gamut:75.8, type:"additive", deviceDep:true,
    creator:"ITU-R", hex:"#14B8A6",
    description:"The 4K/8K container gamut. Primaries sit on the spectral locus (near-monochromatic), covering 75.8% of visible colors. No consumer display fully achieves it yet. The envelope for all HDR mastering.",
    fundamentals:"Spectral primaries: R=630nm, G=532nm, B=467nm. Requires 10-bit or 12-bit encoding to avoid banding. Used with BT.2100 for HDR (PQ or HLG curves). HDR10, HDR10+, and Dolby Vision all master to Rec.2020 gamut.",
    strengths:["75.8% visible gamut","HDR mastering standard","10/12-bit precision","Future-proof"],
    weaknesses:["No current display achieves full coverage","Requires 10-bit minimum","Complex HDR tone mapping pipeline"],
    useCase:"4K/8K streaming mastering, HDR video production, next-gen display targeting",
    css:"color(rec2020 0 0.8 0.6)",
    hardware_detail:"Quantum dot (QLED) and high-end OLED panels reach 70–80% Rec.2020. Laser projectors approach 90%. HDR content tone-maps from 10,000-nit mastering to display peak brightness.",
    related:["display-p3","aces","ictcp"],
    tags:["video","hdr","uhdtv","wide-gamut","4k"],
    quickFact:"Best current QLED TVs reach ~76% of Rec.2020. We're almost there."
  },
  {
    id:"aces", name:"ACES", short:"Academy Color Encoding", year:2014, era:"modern",
    category:"cinema", domain:["film","vfx","game-engine","post-production"], hardware:["cinema-camera","dlp-projector","render-farm"],
    layer:"pipeline", gamut:100, type:"scene-linear", deviceDep:false,
    creator:"Academy of Motion Picture Arts and Sciences", hex:"#F43F5E",
    description:"Hollywood's universal color pipeline. Capture once in ACES, deliver to any display or projection. Used by ILM, Weta, Pixar, Netflix. ACES 2.0 released April 2025.",
    fundamentals:"ACES2065-1 (AP0): imaginary primaries, scene-linear, 16-bit half-float OpenEXR, 30 stops of dynamic range. ACEScg (AP1): all-real primaries for CG rendering. ACEScc/cct: log encoding for color grading. Flow: Camera→IDT→ACES→RRT→ODT→display.",
    strengths:["Scene-referred linear light","Entire visible gamut captured","Unified pipeline across cameras/displays","Industry VFX standard"],
    weaknesses:["Complex pipeline setup","Large file sizes (EXR)","Steep learning curve","Needs IDT per camera model"],
    useCase:"Feature films, Netflix/Disney+ originals, VFX compositing, Unreal Engine game rendering",
    css:"/* Cinema/game pipeline — not CSS */",
    hardware_detail:"Cinema cameras (ARRI, RED, Sony Venice) output to IDTs. DI suites use ACEScc for grading. DLP cinema projectors and OLED reference monitors receive ODT output.",
    related:["rec2020","ictcp","linear-rgb"],
    tags:["film","vfx","cinema","game-engine","pipeline"],
    quickFact:"Every Marvel and Disney film since 2014 has been graded in ACES."
  },
  {
    id:"ictcp", name:"ICtCp", short:"Dolby HDR Perceptual", year:2016, era:"modern",
    category:"video", domain:["hdr","dolby-vision","broadcast"], hardware:["dolby-vision-tv","hdr-display"],
    layer:"hardware", gamut:75.8, type:"perceptual-luma-chroma", deviceDep:false,
    creator:"Dolby Laboratories", hex:"#A855F7",
    description:"YCbCr's perceptual upgrade for HDR. Dolby Vision uses ICtCp internally. The I channel achieves 0.998 correlation with perceived brightness (vs 0.819 for Y'CbCr).",
    fundamentals:"BT.2020 RGB → LMS → PQ nonlinearity → ICtCp opponent axes. I=absolute intensity (PQ-encoded 0–10,000 nit), Ct=yellow-violet, Cp=red-green. 10-bit ICtCp matches 11.5-bit Y'CbCr in quality. Standardized in ITU-R BT.2100.",
    strengths:["0.998 I↔brightness correlation","Perceptually uniform for HDR","Standard in Dolby Vision","Better chroma subsampling tolerance"],
    weaknesses:["Dolby ecosystem focus","Not for web/design","Complex HDR pipeline required"],
    useCase:"Dolby Vision mastering, HDR streaming metadata, next-gen broadcast",
    css:"/* Not supported */",
    hardware_detail:"Dolby Vision TVs decode ICtCp + dynamic metadata, tone-mapping scene-by-scene to display capabilities. Mastered at 4000–10000 nits.",
    related:["rec2020","aces","jzazbz"],
    tags:["hdr","dolby","video","perceptual","broadcast"],
    quickFact:"Dolby Vision uses scene-by-scene dynamic metadata — 272 million scenes analyzed per film."
  },
  {
    id:"ncs", name:"NCS", short:"Natural Color System", year:1979, era:"physical",
    category:"order", domain:["architecture","interior","paint","nordic"], hardware:["physical-atlas"],
    layer:"physical", gamut:80, type:"perceptual", deviceDep:false,
    creator:"Swedish Colour Centre Foundation", hex:"#22C55E",
    description:"Built on Hering's opponent-process theory — how humans actually perceive color, not physics. National standard in Sweden, Norway, Spain, South Africa. The architect's color language.",
    fundamentals:"Six elementary perceptions: white, black, red, yellow, green, blue. NCS notation: S 2050-Y10R = 20% blackness, 50% chromaticness, hue=yellow with 10% redness. 2,050 standard colors. Purely phenomenological — no physics involved.",
    strengths:["Purely perceptual and intuitive","National standard in 4 countries","Architecture/interior dominant","Explains color relatedness clearly"],
    weaknesses:["Physical system only","European focus","No digital math model — lookup only"],
    useCase:"Architecture, interior design, paint specification, Scandinavian product design",
    css:"/* Convert via measured LAB values from NCS database */",
    hardware_detail:"Physical atlas and trained observers. NCS Scan hardware compares samples to NCS database. Many paint brands publish NCS codes alongside Pantone/RAL.",
    related:["munsell","ral","lab"],
    tags:["architecture","paint","nordic","physical","perceptual"],
    quickFact:"Architects in Scandinavia specify wall colors as NCS codes the way designers specify Pantone."
  },
  {
    id:"jzazbz", name:"Jzazbz / JzCzhz", short:"HDR Perceptual Uniform", year:2017, era:"modern",
    category:"perceptual", domain:["hdr","film","science"], hardware:["hdr-display","cinema-monitor"],
    layer:"software", gamut:100, type:"perceptual", deviceDep:false,
    creator:"Safdar, Cui, Kim, Luo", hex:"#FB923C",
    description:"OKLAB for HDR. Perceptually uniform from 0.0001 to 10,000 cd/m². Uses the PQ transfer function to handle HDR luminance ranges that LAB can't touch.",
    fundamentals:"XYZ → absolute XYZ (luminance-scaled) → LMS via Jzazbz matrix → PQ nonlinearity → opponent axes. Jz=0 at black, Jz=1 at 10,000 cd/m². Designed for HDR color-difference prediction. CSS Color 5 draft includes JzCzhz.",
    strengths:["Perceptually uniform across full HDR range","0.0001–10,000 nit coverage","Best HDR ΔE metric"],
    weaknesses:["Emerging standard — limited tool support","Complex implementation","Supersedes nothing yet established"],
    useCase:"HDR color grading, gamut mapping in cinema, scientific color measurement",
    css:"/* Experimental — CSS Color 5 draft only */",
    hardware_detail:"HDR reference monitors (Sony BVM-HX310) calibrated in absolute nits — exactly the domain Jzazbz was designed for.",
    related:["ictcp","aces","oklab"],
    tags:["hdr","perceptual","modern","cinema"],
    quickFact:"Regular LAB was designed for 100 cd/m² surfaces. Jzazbz handles 100× more range."
  },
  {
    id:"cam16", name:"CAM16 / HCT", short:"Color Appearance Model", year:2016, era:"modern",
    category:"appearance", domain:["design-system","science","display"], hardware:["all"],
    layer:"software", gamut:100, type:"appearance-model", deviceDep:false,
    creator:"Li et al. (CAM16) / Google (HCT)", hex:"#4ADE80",
    description:"Models how colors appear under different lighting conditions — not just what they are. Google's Material Design 3 uses HCT (Hue+Chroma from CAM16 + Tone from CIELAB) for its entire color system.",
    fundamentals:"Takes color + viewing conditions → outputs J (lightness), Q (brightness), C (chroma), M (colorfulness), s (saturation), h (hue). HCT's tone = CIELAB L*. A tone difference of 40 guarantees ≥3:1 contrast ratio; 50 guarantees ≥4.5:1 (WCAG AA).",
    strengths:["Viewing-condition adaptation","Accessibility guarantees via HCT tone","Google Material 3 standard","Chromatic adaptation built in"],
    weaknesses:["Complex computation","Not in CSS — needs material-color-utilities","Requires viewing condition setup"],
    useCase:"Material Design 3, design system accessibility, dynamic color theming, dark-mode generation",
    css:"/* Not in CSS — use Google material-color-utilities library */",
    hardware_detail:"Android 12+ dynamic color (Monet) uses HCT internally. Chrome's color management uses CIECAM02-derived transforms.",
    related:["oklch","ciecam02","oklab","lab"],
    tags:["design-system","google","material","accessibility","appearance"],
    quickFact:"Android 12's Monet system generates your entire device color scheme from your wallpaper using HCT."
  },
];

const TIMELINE_ERAS = [
  { id:"science", label:"Science Era", years:"1666–1930", color:"#6B7280", desc:"Newton prism, Young-Helmholtz trichromacy, Maxwell's first color photo, Hering's opponent theory, CIE founded" },
  { id:"pre-digital", label:"Physical Era", years:"1900–1960", color:"#84CC16", desc:"Munsell (1905), RAL (1927), CIE XYZ (1931), Hunter Lab (1948)" },
  { id:"print", label:"Print Era", years:"1950–1990", color:"#0891B2", desc:"CMYK process color, Pantone (1963), print ICC standards" },
  { id:"broadcast", label:"Broadcast Era", years:"1953–1995", color:"#F59E0B", desc:"YIQ for NTSC (1953), YUV for PAL, YCbCr BT.601 (1982)" },
  { id:"digital", label:"Digital Era", years:"1978–2010", color:"#3B82F6", desc:"HSV & HSL (1978), CIE LAB (1976), sRGB (1996), ICC (1993), Adobe RGB (1998)" },
  { id:"scientific", label:"Scientific Era", years:"1976–2012", color:"#EF4444", desc:"CIELAB, CIELUV, CIECAM02, NCS, ACES v1" },
  { id:"modern", label:"Modern Era", years:"2012–2025", color:"#8B5CF6", desc:"Rec.2020, ACES (2014), ICtCp (2016), Display P3 (2015), OKLAB/OKLCH (2020), CSS Level 4" },
];

const VIEWS = [
  { id:"magazine", icon:"◈", label:"Overview" },
  { id:"timeline", icon:"⟶", label:"Timeline" },
  { id:"domain",   icon:"⬡", label:"Domain" },
  { id:"hardware", icon:"◻", label:"Hardware" },
  { id:"usecase",  icon:"◎", label:"Use Case" },
  { id:"compare",  icon:"⇌", label:"Compare" },
  { id:"lab",      icon:"⚗", label:"Color Lab" },
  { id:"concepts", icon:"◉", label:"Concepts" },
];

const DOMAIN_GROUPS = {
  "Web & CSS":          ["srgb","display-p3","oklch","oklab","hsl","hsv","hwb","lab"],
  "Print & Physical":   ["cmyk","pantone","ral","munsell","ncs"],
  "Video & Broadcast":  ["ycbcr","rec2020","ictcp"],
  "Film & VFX":         ["aces","rec2020","jzazbz"],
  "Science & Standards":["xyz","lab","cam16","jzazbz","munsell"],
  "Design Systems":     ["oklch","oklab","cam16","hsl","hsv","display-p3"],
};

const USE_CASES = [
  { id:"web-ui",      label:"Web UI / Design Systems", icon:"🌐",
    systems:["oklch","srgb","display-p3","hsl","oklab"],
    tip:"Use OKLCH for design tokens — it gives you perceptual tonal scales. sRGB as the baseline. Add P3 progressive enhancement via @media (color-gamut: p3).",
    workflow:"Design tokens → OKLCH → sRGB fallback → P3 enhancement" },
  { id:"print",       label:"Print & Brand Identity",  icon:"🖨️",
    systems:["cmyk","pantone","lab","ral","munsell"],
    tip:"Specify brand colors in Pantone for consistency. Convert to CMYK with FOGRA51 (EU coated) or GRACoL2013 (US commercial) ICC profile. Use LAB for specifying exact color targets.",
    workflow:"Pantone spec → LAB target → CMYK via ICC → press proof" },
  { id:"video",       label:"Video & Streaming",       icon:"🎬",
    systems:["ycbcr","rec2020","ictcp","aces"],
    tip:"Master in ACES or Rec.2020, deliver in Rec.709 for SDR or HDR10/Dolby Vision for HDR. YCbCr 4:2:0 for all delivery formats.",
    workflow:"Camera RAW → ACES → RRT → ODT → delivery format" },
  { id:"accessibility",label:"Accessibility (WCAG)",   icon:"♿",
    systems:["oklch","cam16","lab","srgb"],
    tip:"OKLCH: L≥0.62 on dark background or L≤0.45 on light background for WCAG AA text. HCT: tone difference ≥50 guarantees 4.5:1 contrast.",
    workflow:"Pick hue+chroma → adjust L until contrast passes → done" },
  { id:"scientific",  label:"Science & QC",            icon:"🔬",
    systems:["lab","xyz","munsell","jzazbz"],
    tip:"Use CIELAB + CIEDE2000 for industrial color difference measurement. Jzazbz for HDR scientific work. Munsell as the visual reference standard.",
    workflow:"Spectrophotometer → XYZ → LAB → ΔE against standard" },
  { id:"gameengine",  label:"Game Engine / 3D Render",  icon:"🎮",
    systems:["aces","srgb","display-p3","rec2020"],
    tip:"Work in linear-light throughout the pipeline. Linearize sRGB textures on GPU load. Apply ACES tone mapping or filmic LUT on output. Target sRGB/P3 for display.",
    workflow:"Linear textures → PBR lighting → ACES tone map → display" },
];

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
function Tooltip({ content, children }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleEnter = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top - 8 });
    setShow(true);
  };
  return (
    <span onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)} style={{ position:"relative", display:"inline", cursor:"help" }}>
      <span style={{ borderBottom:`1.5px dashed ${P.amber}88`, color:P.amber, paddingBottom:1 }}>{children}</span>
      {show && (
        <div style={{
          position:"fixed", left:pos.x, top:pos.y,
          transform:"translate(-50%,-100%)",
          background:P.text, borderRadius:8, padding:"10px 14px",
          maxWidth:280, fontSize:12, lineHeight:1.6, color:"#E7E0D5",
          zIndex:9999, pointerEvents:"none",
          boxShadow:"0 8px 32px rgba(0,0,0,0.2)",
        }}>
          {content}
          <div style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%)",
            width:10, height:5, background:P.text, clipPath:"polygon(50% 100%,0 0,100% 0)" }}/>
        </div>
      )}
    </span>
  );
}

// ─── GAMUT BAR ────────────────────────────────────────────────────────────────
function GamutBar({ value, color, label = undefined }: { value: number; color: string; label?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
      {label && <span style={{ fontSize:10, color:P.textMute, minWidth:60 }}>{label}</span>}
      <div style={{ flex:1, height:5, background:P.border, borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${Math.min(value,100)}%`, height:"100%",
          background:`linear-gradient(90deg,${color}88,${color})`,
          borderRadius:3, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      </div>
      <span style={{ fontSize:10, color:color, fontFamily:"'DM Mono',monospace", minWidth:38, textAlign:"right" }}>
        {value>=100?"∞":`${value}%`}
      </span>
    </div>
  );
}

// ─── COMPACT CARD (magazine grid) ────────────────────────────────────────────
function CompactCard({ sys, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? `${sys.hex}08` : P.surface,
      border:`1px solid ${selected ? sys.hex : P.border}`,
      borderRadius:12, padding:"14px 16px", cursor:"pointer",
      transition:"all 0.2s",
      boxShadow: selected ? `0 0 0 2px ${sys.hex}33, 0 4px 16px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:sys.hex, flexShrink:0, boxShadow:`0 2px 8px ${sys.hex}44` }}/>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:P.text, fontWeight:700, lineHeight:1.2 }}>{sys.name}</div>
            <div style={{ fontSize:11, color:P.textMute }}>{sys.short}</div>
          </div>
        </div>
        <span style={{ fontSize:10, color:P.textMute, background:P.panel, borderRadius:4, padding:"2px 6px", flexShrink:0 }}>{sys.year}</span>
      </div>
      <p style={{ fontSize:12, color:P.textSoft, margin:"0 0 10px", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
        {sys.description}
      </p>
      <GamutBar value={sys.gamut} color={sys.hex} />
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>
        {sys.tags.slice(0,3).map(t => (
          <span key={t} style={{ fontSize:9, background:`${sys.hex}15`, color:sys.hex, borderRadius:3, padding:"1px 6px", fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:"0.03em" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── DEEP DIVE PANEL ─────────────────────────────────────────────────────────
function DeepDive({ sys, onClose }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview","technical","hardware","practice"];

  return (
    <div style={{ background:P.surface, border:`1px solid ${sys.hex}33`, borderRadius:14, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${sys.hex}14,transparent)`, borderBottom:`1px solid ${sys.hex}22`, padding:"18px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:sys.hex, boxShadow:`0 4px 16px ${sys.hex}55` }}/>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:18, color:P.text, fontWeight:700 }}>{sys.name}</div>
              <div style={{ fontSize:11, color:P.textSoft }}>{sys.short} · {sys.creator} · {sys.year}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:P.panel, border:"none", borderRadius:6, color:P.textMute, cursor:"pointer", padding:"5px 10px", fontSize:11, fontFamily:"'DM Mono',monospace" }}>✕</button>
        </div>

        {/* Quick fact pill */}
        {sys.quickFact && (
          <div style={{ background:P.amberLt, border:`1px solid ${P.amberMd}`, borderRadius:8, padding:"8px 12px", marginBottom:14 }}>
            <span style={{ fontSize:10, color:P.amber, fontWeight:700, fontFamily:"'DM Mono',monospace" }}>★ QUICK FACT  </span>
            <span style={{ fontSize:12, color:P.textMid }}>{sys.quickFact}</span>
          </div>
        )}

        {/* Badges row */}
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:14 }}>
          <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5,
            background: sys.type==="additive" ? P.blueLt : sys.type==="perceptual" ? P.purpleLt : sys.type==="subtractive" ? "#FEF9C3" : P.greenLt,
            color: sys.type==="additive" ? P.blue : sys.type==="perceptual" ? P.purple : sys.type==="subtractive" ? "#92400E" : P.green,
            fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{sys.type}</span>
          <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, background:P.panel, color:P.textSoft }}>{sys.layer}</span>
          <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, background: sys.deviceDep ? P.redLt : P.greenLt, color: sys.deviceDep ? P.red : P.green }}>
            {sys.deviceDep ? "device-dependent" : "device-independent"}
          </span>
        </div>

        {/* Gamut */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:10, color:P.textMute }}>Gamut vs. visible spectrum</span>
          <div style={{ flex:1, height:6, background:P.border, borderRadius:3, overflow:"hidden" }}>
            <div style={{ width:`${Math.min(sys.gamut,100)}%`, height:"100%", background:sys.hex, borderRadius:3 }}/>
          </div>
          <span style={{ fontSize:12, color:sys.hex, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{sys.gamut>=100?"100%+":sys.gamut+"%"}</span>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:3, marginTop:14 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer",
              fontSize:11, fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600,
              background: tab===t ? sys.hex : P.panel,
              color: tab===t ? "#FFFDF8" : P.textSoft,
              transition:"all 0.15s"
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"18px 20px", maxHeight:420, overflowY:"auto" }}>
        {tab==="overview" && (
          <div style={{ display:"grid", gap:14 }}>
            <p style={{ color:P.textMid, lineHeight:1.75, fontSize:14, margin:0 }}>{sys.description}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:P.greenLt, border:`1px solid #BBF7D0`, borderRadius:8, padding:12 }}>
                <div style={{ fontSize:10, color:P.green, letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>STRENGTHS</div>
                {sys.strengths.map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:6, marginBottom:5 }}>
                    <span style={{ color:"#16A34A", fontSize:12, flexShrink:0 }}>✓</span>
                    <span style={{ fontSize:12, color:"#166534", lineHeight:1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:P.redLt, border:`1px solid #FECDD3`, borderRadius:8, padding:12 }}>
                <div style={{ fontSize:10, color:P.red, letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>WEAKNESSES</div>
                {sys.weaknesses.map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:6, marginBottom:5 }}>
                    <span style={{ color:"#EF4444", fontSize:12, flexShrink:0 }}>×</span>
                    <span style={{ fontSize:12, color:"#9F1239", lineHeight:1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:P.panel, borderRadius:8, padding:12 }}>
              <span style={{ fontSize:10, color:P.textMute, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>BEST FOR  </span>
              <span style={{ fontSize:13, color:P.textMid }}>{sys.useCase}</span>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {sys.tags.map(t => (
                <span key={t} style={{ fontSize:10, background:`${sys.hex}14`, color:sys.hex, border:`1px solid ${sys.hex}33`, borderRadius:4, padding:"2px 8px", fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {tab==="technical" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ background:P.panel, borderRadius:8, padding:14 }}>
              <div style={{ fontSize:10, color:P.amber, letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>HOW IT WORKS</div>
              <p style={{ color:P.textMid, lineHeight:1.75, fontSize:13, margin:0 }}>{sys.fundamentals}</p>
            </div>
            {sys.css && !sys.css.startsWith("/*") && (
              <div style={{ background:"#1C1917", borderRadius:8, padding:14 }}>
                <div style={{ fontSize:10, color:"#60A5FA", letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>CSS SYNTAX</div>
                <code style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#7DD3FC", lineHeight:1.6 }}>{sys.css}</code>
              </div>
            )}
            {sys.css && sys.css.startsWith("/*") && (
              <div style={{ background:P.panel, borderRadius:8, padding:12, border:`1px solid ${P.border}` }}>
                <div style={{ fontSize:11, color:P.textSoft, fontFamily:"'DM Mono',monospace" }}>{sys.css}</div>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {[["Type",sys.type],["Layer",sys.layer],["Device Dep.",sys.deviceDep?"Yes":"No"]].map(([l,v]) => (
                <div key={l} style={{ background:P.panel, borderRadius:8, padding:10, textAlign:"center" }}>
                  <div style={{ fontSize:9, color:P.textMute, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</div>
                  <div style={{ fontSize:12, color:P.text, fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="hardware" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ background:P.panel, borderRadius:8, padding:14 }}>
              <div style={{ fontSize:10, color:P.amber, letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>HARDWARE PIPELINE</div>
              <p style={{ color:P.textMid, lineHeight:1.75, fontSize:13, margin:0 }}>{sys.hardware_detail}</p>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:10, color:P.textMute, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>DEVICES: </span>
              {sys.hardware.map(h => (
                <span key={h} style={{ fontSize:11, background:P.panel, border:`1px solid ${P.border}`, color:P.textMid, borderRadius:5, padding:"3px 8px" }}>{h}</span>
              ))}
            </div>
          </div>
        )}

        {tab==="practice" && (
          <div style={{ display:"grid", gap:12 }}>
            <div style={{ background:P.greenLt, borderRadius:8, padding:14, border:`1px solid #BBF7D0` }}>
              <div style={{ fontSize:10, color:P.green, letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>✓ WHEN TO USE THIS</div>
              <p style={{ color:"#166534", lineHeight:1.65, fontSize:13, margin:0 }}>{sys.useCase}</p>
            </div>
            <div style={{ background:P.purpleLt, borderRadius:8, padding:14, border:"1px solid #DDD6FE" }}>
              <div style={{ fontSize:10, color:P.purple, letterSpacing:"0.08em", marginBottom:8, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>RELATED SYSTEMS</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {sys.related.map(r => {
                  const rel = COLOR_SYSTEMS.find(s=>s.id===r);
                  return rel ? (
                    <div key={r} style={{ display:"flex", alignItems:"center", gap:4, background:"#EDE9FE", border:"1px solid #C4B5FD", borderRadius:5, padding:"3px 8px" }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:rel.hex }}/>
                      <span style={{ fontSize:11, color:"#4C1D95" }}>{rel.name}</span>
                    </div>
                  ) : <span key={r} style={{ fontSize:11, color:P.textMute, background:P.panel, borderRadius:4, padding:"2px 7px" }}>{r}</span>;
                })}
              </div>
            </div>
            <div style={{ background:P.amberLt, borderRadius:8, padding:12, border:`1px solid ${P.amberMd}` }}>
              <span style={{ fontSize:10, color:P.textMute }}>Created by </span>
              <span style={{ fontSize:13, color:P.amber, fontWeight:700 }}>{sys.creator}</span>
              <span style={{ fontSize:10, color:P.textMute }}> · </span>
              <span style={{ fontSize:13, color:P.amber, fontFamily:"'DM Mono',monospace" }}>{sys.year}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TIMELINE VIEW ────────────────────────────────────────────────────────────
function TimelineView({ onSelect }) {
  const sorted = [...COLOR_SYSTEMS].sort((a,b)=>a.year-b.year);
  return (
    <div>
      <div style={{ fontSize:11, color:P.textMute, marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>
        CHRONOLOGICAL EVOLUTION — {sorted[0].year} → {sorted[sorted.length-1].year}
      </div>
      {TIMELINE_ERAS.map(era => {
        const eraSystems = sorted.filter(s=>s.era===era.id);
        if (!eraSystems.length) return null;
        return (
          <div key={era.id} style={{ display:"flex", gap:0, marginBottom:24 }}>
            {/* Left timeline */}
            <div style={{ width:24, display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
              <div style={{ width:12, height:12, borderRadius:"50%", background:era.color, flexShrink:0, border:`2px solid ${P.bg}`, zIndex:1 }}/>
              <div style={{ width:2, flex:1, background:`${era.color}33`, marginTop:4 }}/>
            </div>
            {/* Content */}
            <div style={{ flex:1, paddingLeft:14, paddingBottom:4 }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight:700, color:era.color }}>{era.label}</span>
                <span style={{ fontSize:11, color:P.textMute, fontFamily:"'DM Mono',monospace" }}>{era.years}</span>
              </div>
              <p style={{ fontSize:12, color:P.textSoft, margin:"0 0 10px", lineHeight:1.5 }}>{era.desc}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {eraSystems.map(sys => (
                  <button key={sys.id} onClick={() => onSelect(sys)} style={{
                    display:"flex", alignItems:"center", gap:7,
                    background:P.surface, border:`1px solid ${sys.hex}44`,
                    borderLeft:`3px solid ${sys.hex}`,
                    borderRadius:8, padding:"8px 12px", cursor:"pointer",
                    boxShadow:"0 1px 4px rgba(0,0,0,0.05)", transition:"all 0.15s",
                  }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:sys.hex }}/>
                    <div>
                      <div style={{ fontSize:12, color:P.text, fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{sys.name}</div>
                      <div style={{ fontSize:10, color:P.textMute }}>{sys.year}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DOMAIN VIEW ─────────────────────────────────────────────────────────────
function DomainView({ onSelect }) {
  const [active, setActive] = useState(null);
  const colors = { "Web & CSS":"#3B82F6","Print & Physical":"#0891B2","Video & Broadcast":"#F59E0B","Film & VFX":"#EF4444","Science & Standards":"#6B7280","Design Systems":"#8B5CF6" };
  return (
    <div>
      <div style={{ fontSize:11, color:P.textMute, marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>COLOR SYSTEMS BY DOMAIN — tap to expand</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {Object.entries(DOMAIN_GROUPS).map(([domain,sysIds]) => {
          const color = colors[domain];
          const systems = sysIds.map(id=>COLOR_SYSTEMS.find(s=>s.id===id)).filter(Boolean);
          const isActive = active===domain;
          return (
            <div key={domain} onClick={() => setActive(isActive?null:domain)} style={{
              background: isActive ? `${color}0c` : P.surface,
              border:`1px solid ${isActive ? color : P.border}`,
              borderTop:`3px solid ${isActive ? color : P.border}`,
              borderRadius:10, padding:16, cursor:"pointer", transition:"all 0.2s",
              boxShadow: isActive ? `0 4px 16px ${color}18` : "0 1px 4px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:13, fontWeight:700, color:isActive?color:P.text }}>{domain}</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:11, color:P.textMute }}>{systems.length} systems</span>
                  <span style={{ fontSize:12, color:P.textMute }}>{isActive?"↑":"↓"}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {systems.map(sys => (
                  <button key={sys.id} onClick={e=>{e.stopPropagation();onSelect(sys);}} style={{
                    display:"flex", alignItems:"center", gap:4,
                    background: P.panel, border:`1px solid ${sys.hex}33`,
                    borderRadius:6, padding:"4px 9px", cursor:"pointer", transition:"all 0.15s",
                  }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:sys.hex }}/>
                    <span style={{ fontSize:11, color:P.textMid, fontFamily:"'DM Mono',monospace" }}>{sys.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HARDWARE VIEW ────────────────────────────────────────────────────────────
function HardwareView({ onSelect }) {
  const groups = {
    "🖥  Display": [
      { label:"Standard LCD / IPS",      note:"sRGB native, ~72% NTSC",                systems:["srgb","hsl","hsv","ycbcr"] },
      { label:"Wide Gamut OLED / QLED",  note:"95–100% P3, 70–80% Rec.2020",          systems:["display-p3","rec2020"] },
      { label:"HDR Reference Monitor",   note:"Sony BVM-HX310, up to 4000 nit",       systems:["ictcp","jzazbz","rec2020"] },
      { label:"Cinema DLP Projector",    note:"DCI-P3 gamut standard",                systems:["aces","rec2020"] },
    ],
    "📷  Capture": [
      { label:"Consumer Camera / Phone", note:"sRGB or P3 HEIC output",               systems:["srgb","display-p3"] },
      { label:"Professional Cinema Cam", note:"ARRI, RED, Sony — RAW → ACES IDT",     systems:["aces","rec2020"] },
      { label:"Spectrophotometer",       note:"Measures absolute XYZ / LAB",          systems:["xyz","lab","munsell"] },
    ],
    "🖨  Print": [
      { label:"Inkjet Printer",          note:"6–12 ink channels, ICC profile driven", systems:["cmyk","lab","srgb"] },
      { label:"Commercial Offset Press", note:"FOGRA51 / GRACoL ICC profiles",        systems:["cmyk","pantone","lab"] },
      { label:"Powder Coat / Paint",     note:"Physical pigment, spectro verified",   systems:["ral","pantone","ncs"] },
    ],
    "⚙️  Compute": [
      { label:"GPU / Game Renderer",     note:"Linear-light → sRGB output",           systems:["aces","srgb","display-p3"] },
      { label:"Video Encoder (H.265)",   note:"YCbCr 4:2:0 internally",               systems:["ycbcr","rec2020"] },
      { label:"Browser Compositor",      note:"ICC-aware, P3 output on modern OS",    systems:["srgb","display-p3","oklch"] },
      { label:"OS Color Management",     note:"CIE XYZ D50 Profile Connection Space", systems:["xyz","lab"] },
    ],
  };
  return (
    <div>
      <div style={{ fontSize:11, color:P.textMute, marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>COLOR SYSTEMS BY HARDWARE LAYER</div>
      <div style={{ display:"grid", gap:20 }}>
        {Object.entries(groups).map(([group,items]) => (
          <div key={group}>
            <div style={{ fontSize:14, fontWeight:700, color:P.text, marginBottom:10 }}>{group}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:8 }}>
              {items.map(item => (
                <div key={item.label} style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:10, padding:12 }}>
                  <div style={{ fontSize:12, color:P.text, fontWeight:700, marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontSize:11, color:P.textSoft, marginBottom:10 }}>{item.note}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {item.systems.map(sid => {
                      const sys = COLOR_SYSTEMS.find(s=>s.id===sid);
                      if (!sys) return <span key={sid} style={{ fontSize:10, background:P.panel, color:P.textMute, borderRadius:4, padding:"2px 6px" }}>{sid}</span>;
                      return (
                        <button key={sid} onClick={()=>onSelect(sys)} style={{
                          display:"flex", alignItems:"center", gap:4,
                          background:P.panel, border:`1px solid ${sys.hex}44`,
                          borderRadius:5, padding:"3px 8px", cursor:"pointer"
                        }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:sys.hex }}/>
                          <span style={{ fontSize:10, color:P.textMid, fontFamily:"'DM Mono',monospace" }}>{sys.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── USE CASE VIEW ────────────────────────────────────────────────────────────
function UseCaseView({ onSelect }) {
  const [active, setActive] = useState(null);
  return (
    <div>
      <div style={{ fontSize:11, color:P.textMute, marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>COLOR SYSTEMS BY USE CASE — with practical workflows</div>
      <div style={{ display:"grid", gap:10 }}>
        {USE_CASES.map(uc => {
          const isActive = active===uc.id;
          const systems = uc.systems.map(id=>COLOR_SYSTEMS.find(s=>s.id===id)).filter(Boolean);
          return (
            <div key={uc.id} onClick={()=>setActive(isActive?null:uc.id)} style={{
              background: isActive ? P.surface : P.bg,
              border:`1px solid ${isActive?"#B4530944":P.border}`,
              borderRadius:12, padding:16, cursor:"pointer", transition:"all 0.2s",
              boxShadow: isActive ? "0 4px 20px rgba(0,0,0,0.06)" : "none"
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:22 }}>{uc.icon}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:P.text }}>{uc.label}</div>
                    {isActive && <div style={{ fontSize:12, color:P.amber, marginTop:4, maxWidth:500, lineHeight:1.5 }}>{uc.tip}</div>}
                  </div>
                </div>
                <span style={{ fontSize:14, color:P.textMute }}>{isActive?"↑":"↓"}</span>
              </div>

              {isActive && (
                <div style={{ marginTop:14 }}>
                  {/* Workflow strip */}
                  <div style={{ background:P.amberLt, border:`1px solid ${P.amberMd}`, borderRadius:8, padding:"8px 12px", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, color:P.amber, fontWeight:700, fontFamily:"'DM Mono',monospace", flexShrink:0 }}>WORKFLOW</span>
                    <span style={{ fontSize:12, color:P.textMid }}>{uc.workflow}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
                    {systems.map((sys,i) => (
                      <div key={sys.id} onClick={e=>{e.stopPropagation();onSelect(sys);}} style={{
                        background:P.bg, border:`1px solid ${sys.hex}44`,
                        borderLeft:`3px solid ${sys.hex}`,
                        borderRadius:8, padding:10, cursor:"pointer",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:sys.hex }}/>
                          <span style={{ fontSize:12, color:P.text, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{sys.name}</span>
                          {i===0 && <span style={{ fontSize:9, background:`${P.amber}22`, color:P.amber, borderRadius:3, padding:"1px 5px", fontWeight:700 }}>PRIMARY</span>}
                        </div>
                        <p style={{ fontSize:11, color:P.textSoft, margin:0, lineHeight:1.4 }}>{sys.description.substring(0,70)}…</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPARE VIEW ─────────────────────────────────────────────────────────────
function CompareView() {
  const [sel, setSel] = useState(["srgb","oklch","lab","display-p3"]);
  const toggle = id => {
    if (sel.includes(id)) { if (sel.length>1) setSel(sel.filter(s=>s!==id)); }
    else { if (sel.length<5) setSel([...sel,id]); }
  };
  const compared = sel.map(id=>COLOR_SYSTEMS.find(s=>s.id===id)).filter(Boolean);
  const attrs = [
    { key:"year",      label:"Year",         render:v=>v },
    { key:"gamut",     label:"Gamut",        render:v=>`${v>=100?"100%+":v+"%"}` },
    { key:"type",      label:"Type",         render:v=>v },
    { key:"deviceDep", label:"Device Dep.",  render:v=>v?"Yes":"No" },
    { key:"layer",     label:"Layer",        render:v=>v },
    { key:"creator",   label:"Creator",      render:v=>v },
    { key:"era",       label:"Era",          render:v=>v },
  ];
  return (
    <div>
      <div style={{ fontSize:11, color:P.textMute, marginBottom:16, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>SELECT UP TO 5 SYSTEMS TO COMPARE SIDE-BY-SIDE</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20, padding:"12px 14px", background:P.surface, borderRadius:10, border:`1px solid ${P.border}` }}>
        {COLOR_SYSTEMS.map(sys => (
          <button key={sys.id} onClick={()=>toggle(sys.id)} style={{
            display:"flex", alignItems:"center", gap:5,
            background: sel.includes(sys.id) ? `${sys.hex}18` : P.panel,
            border:`1px solid ${sel.includes(sys.id)?sys.hex:P.border}`,
            borderRadius:6, padding:"5px 10px", cursor:"pointer", transition:"all 0.15s",
          }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:sys.hex }}/>
            <span style={{ fontSize:11, color:sel.includes(sys.id)?sys.hex:P.textSoft, fontFamily:"'DM Mono',monospace" }}>{sys.name}</span>
          </button>
        ))}
      </div>

      {/* Color swatches row */}
      <div style={{ display:"flex", gap:0, marginBottom:16, borderRadius:10, overflow:"hidden", height:40 }}>
        {compared.map(sys => (
          <div key={sys.id} style={{ flex:1, background:sys.hex, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.85)", fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{sys.name}</span>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:P.panel }}>
              <th style={{ padding:"10px 14px", fontSize:10, color:P.textMute, fontFamily:"'DM Mono',monospace", textAlign:"left", borderBottom:`1px solid ${P.border}`, fontWeight:700, letterSpacing:"0.06em" }}>ATTRIBUTE</th>
              {compared.map(sys => (
                <th key={sys.id} style={{ padding:"10px 14px", borderBottom:`1px solid ${P.border}`, textAlign:"center", minWidth:120, borderLeft:`1px solid ${P.borderFaint}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:sys.hex }}/>
                    <span style={{ fontSize:12, color:sys.hex, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{sys.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attrs.map((attr,ai) => (
              <tr key={attr.key} style={{ background:ai%2===0?P.surface:P.bg }}>
                <td style={{ padding:"10px 14px", fontSize:11, color:P.textMute, fontFamily:"'DM Mono',monospace", borderBottom:`1px solid ${P.borderFaint}` }}>{attr.label}</td>
                {compared.map(sys => (
                  <td key={sys.id} style={{ padding:"10px 14px", textAlign:"center", fontSize:12, color:P.text, borderBottom:`1px solid ${P.borderFaint}`, borderLeft:`1px solid ${P.borderFaint}` }}>
                    {attr.key==="deviceDep" ? (
                      <span style={{ color: sys[attr.key]?P.red:P.green, fontWeight:700 }}>{attr.render(sys[attr.key])}</span>
                    ) : attr.render(sys[attr.key])}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ padding:"10px 14px", fontSize:11, color:P.textMute, fontFamily:"'DM Mono',monospace" }}>Gamut bar</td>
              {compared.map(sys => (
                <td key={sys.id} style={{ padding:"10px 14px", borderLeft:`1px solid ${P.borderFaint}` }}>
                  <GamutBar value={sys.gamut} color={sys.hex} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Gradient comparison */}
      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:10, color:P.textMute, marginBottom:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>HALO COMPARISON — same hue range, different interpolation</div>
        {[
          { label:"in oklch (perceptual)", grad:`linear-gradient(in oklch, oklch(0.55 0.22 0), oklch(0.55 0.22 90), oklch(0.55 0.22 180), oklch(0.55 0.22 270), oklch(0.55 0.22 360))` },
          { label:"in srgb (non-perceptual)", grad:`linear-gradient(in srgb, hsl(0,80%,50%), hsl(90,80%,50%), hsl(180,80%,50%), hsl(270,80%,50%), hsl(360,80%,50%))` },
          { label:"in hsl (problematic)", grad:`linear-gradient(in hsl, hsl(0,80%,50%), hsl(360,80%,50%))` },
        ].map(g => (
          <div key={g.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <span style={{ fontSize:10, color:P.textSoft, minWidth:180, fontFamily:"'DM Mono',monospace" }}>{g.label}</span>
            <div style={{ flex:1, height:24, borderRadius:6, background:g.grad }}/>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── COLOR MATH HELPERS ──────────────────────────────────────────────────────
// oklch → approximate sRGB (simplified, for rendering swatches)
function oklchToRgb(L, C, H) {
  // OKLAB
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  // OKLAB→linear sRGB (Björn Ottosson's matrices)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const lc = l_*l_*l_, mc = m_*m_*m_, sc = s_*s_*s_;
  const r =  4.0767416621*lc - 3.3077115913*mc + 0.2309699292*sc;
  const g = -1.2684380046*lc + 2.6097574011*mc - 0.3413193965*sc;
  const bv = -0.0041960863*lc - 0.7034186147*mc + 1.7076147010*sc;
  // linear → gamma sRGB
  const gam = x => x <= 0.0031308 ? 12.92*x : 1.055*Math.pow(Math.max(x,0),1/2.4)-0.055;
  return [
    Math.round(Math.min(255,Math.max(0, gam(r)*255))),
    Math.round(Math.min(255,Math.max(0, gam(g)*255))),
    Math.round(Math.min(255,Math.max(0, gam(bv)*255))),
  ];
}

function rgbToOklch(r, g, b) {
  // sRGB→linear
  const lin = x => { const v=x/255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); };
  const rl=lin(r), gl=lin(g), bl=lin(b);
  // linear→OKLAB
  const l_ = Math.cbrt(0.4121656120*rl + 0.5362752080*gl + 0.0514575653*bl);
  const m_ = Math.cbrt(0.2118591070*rl + 0.6807189584*gl + 0.1074065790*bl);
  const s_ = Math.cbrt(0.0883097947*rl + 0.2818474174*gl + 0.6302613616*bl);
  const L = 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_;
  const a = 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_;
  const bk = 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_;
  const C = Math.sqrt(a*a + bk*bk);
  const H = ((Math.atan2(bk, a) * 180 / Math.PI) + 360) % 360;
  return { L: Math.max(0,Math.min(1,L)), C: Math.max(0,C), H };
}

function rgbToHsl(r, g, b) {
  const rn=r/255, gn=g/255, bn=b/255;
  const max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn);
  const l=(max+min)/2;
  if(max===min) return {h:0,s:0,l:Math.round(l*100)};
  const d=max-min;
  const s=l>0.5?d/(2-max-min):d/(max+min);
  let h;
  switch(max){
    case rn: h=((gn-bn)/d+(gn<bn?6:0))/6; break;
    case gn: h=((bn-rn)/d+2)/6; break;
    default: h=((rn-gn)/d+4)/6;
  }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}

function rgbToHsv(r, g, b) {
  const rn=r/255, gn=g/255, bn=b/255;
  const max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn), d=max-min;
  const v=max, s=max===0?0:d/max;
  let h=0;
  if(d!==0){
    switch(max){
      case rn: h=((gn-bn)/d)%6; break;
      case gn: h=(bn-rn)/d+2; break;
      default: h=(rn-gn)/d+4;
    }
    h=Math.round((h/6)*360+360)%360;
  }
  return {h,s:Math.round(s*100),v:Math.round(v*100)};
}

function rgbToLab(r,g,b){
  const lin=x=>{const v=x/255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
  const rl=lin(r),gl=lin(g),bl=lin(b);
  const X=(rl*0.4124564+gl*0.3575761+bl*0.1804375)/0.95047;
  const Y=(rl*0.2126729+gl*0.7151522+bl*0.0721750)/1.00000;
  const Z=(rl*0.0193339+gl*0.1191920+bl*0.9503041)/1.08883;
  const f=t=>t>0.008856?Math.cbrt(t):(7.787*t+16/116);
  const fx=f(X),fy=f(Y),fz=f(Z);
  return {L:Math.round(116*fy-16),a:Math.round(500*(fx-fy)),b:Math.round(200*(fy-fz))};
}

function hslToRgb(h,s,l){
  s/=100;l/=100;
  const k=n=>(n+h/30)%12;
  const a=s*Math.min(l,1-l);
  const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
  return [Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)];
}

// Check if oklch color is within sRGB gamut
function isInSrgb(L,C,H){
  const [r,g,b]=oklchToRgb(L,C,H);
  const orig=oklchToRgb(L,C,H);
  // Re-derive oklch from the clamped rgb to see if it changed
  const clamped=oklchToRgb(L,C,H);
  // Simple: if any channel was clamped during conversion, it's out of gamut
  const rl=(r/255); const gl=(g/255); const bv=(b/255);
  return r>=0&&r<=255&&g>=0&&g<=255&&b>=0&&b<=255;
}

// ─── SYSTEM DEFINITIONS FOR LAB ──────────────────────────────────────────────
const LAB_SYSTEMS = {
  oklch: {
    id:"oklch", label:"OKLCH", color:"#F59E0B", gamut:100,
    axes:["L — Lightness","C — Chroma","H — Hue °"],
    desc:"Perceptually uniform polar. Equal steps feel equal.",
    getCSS:(v)=>`oklch(${v.L.toFixed(3)} ${v.C.toFixed(3)} ${Math.round(v.H)})`,
    toRgb:(v)=>oklchToRgb(v.L,v.C,v.H),
    defaultVal:{L:0.65,C:0.18,H:220},
    // 2D canvas: x=Chroma, y=Hue, z=L
    canvasAxes:{ x:{key:"C",min:0,max:0.37,label:"C →"},
                 y:{key:"H",min:0,max:360,label:"H ↑"},
                 z:{key:"L",min:0,max:1,step:0.01,label:"L"} },
    // palette: 8×8 grid — rows=H steps, cols=C steps
    paletteGrid:(L)=>{
      const rows=8,cols=8;
      return Array.from({length:rows},(_,ri)=>{
        const H=ri*(360/rows);
        return Array.from({length:cols},(_,ci)=>{
          const C=ci*(0.34/cols);
          return {L,C,H, css:`oklch(${L.toFixed(2)} ${C.toFixed(3)} ${Math.round(H)})`};
        });
      });
    }
  },
  rgb: {
    id:"rgb", label:"RGB", color:"#3B82F6", gamut:35.9,
    axes:["R — Red 0–255","G — Green 0–255","B — Blue 0–255"],
    desc:"Device-dependent additive. The screen's native language.",
    getCSS:(v)=>`rgb(${v.R} ${v.G} ${v.B})`,
    toRgb:(v)=>[v.R,v.G,v.B],
    defaultVal:{R:59,G:130,B:246},
    canvasAxes:{ x:{key:"R",min:0,max:255,label:"R →"},
                 y:{key:"G",min:0,max:255,label:"G ↑"},
                 z:{key:"B",min:0,max:255,step:1,label:"B"} },
    paletteGrid:(B)=>{
      const rows=8,cols=8;
      return Array.from({length:rows},(_,ri)=>{
        const G=Math.round(ri*(255/(rows-1)));
        return Array.from({length:cols},(_,ci)=>{
          const R=Math.round(ci*(255/(cols-1)));
          return {R,G,B, css:`rgb(${R} ${G} ${Math.round(B)})`};
        });
      });
    }
  },
  hsl: {
    id:"hsl", label:"HSL", color:"#EC4899", gamut:35.9,
    axes:["H — Hue 0–360°","S — Saturation 0–100%","L — Lightness 0–100%"],
    desc:"Intuitive but not perceptually uniform. Designer favourite.",
    getCSS:(v)=>`hsl(${v.H} ${v.S}% ${v.L}%)`,
    toRgb:(v)=>hslToRgb(v.H,v.S,v.L),
    defaultVal:{H:217,S:91,L:60},
    canvasAxes:{ x:{key:"H",min:0,max:360,label:"H →"},
                 y:{key:"S",min:0,max:100,label:"S ↑"},
                 z:{key:"L",min:0,max:100,step:1,label:"L"} },
    paletteGrid:(L)=>{
      const rows=8,cols=8;
      return Array.from({length:rows},(_,ri)=>{
        const S=Math.round(100-ri*(100/(rows-1)));
        return Array.from({length:cols},(_,ci)=>{
          const H=Math.round(ci*(360/(cols-1)));
          return {H,S,L, css:`hsl(${H} ${S}% ${Math.round(L)}%)`};
        });
      });
    }
  },
  hsv: {
    id:"hsv", label:"HSV", color:"#F97316", gamut:35.9,
    axes:["H — Hue 0–360°","S — Saturation 0–100%","V — Value 0–100%"],
    desc:"Artist model — start vivid, darken or desaturate.",
    getCSS:(v)=>{const[r,g,b]=hsvToRgb(v.H,v.S,v.V);return `rgb(${r} ${g} ${b})`;},
    toRgb:(v)=>hsvToRgb(v.H,v.S,v.V),
    defaultVal:{H:217,S:77,V:96},
    canvasAxes:{ x:{key:"H",min:0,max:360,label:"H →"},
                 y:{key:"S",min:0,max:100,label:"S ↑"},
                 z:{key:"V",min:0,max:100,step:1,label:"V"} },
    paletteGrid:(V)=>{
      const rows=8,cols=8;
      return Array.from({length:rows},(_,ri)=>{
        const S=Math.round(100-ri*(100/(rows-1)));
        return Array.from({length:cols},(_,ci)=>{
          const H=Math.round(ci*(360/(cols-1)));
          const [r,g,b]=hsvToRgb(H,S,V);
          return {H,S,V, css:`rgb(${r} ${g} ${b})`};
        });
      });
    }
  },
  lab: {
    id:"lab", label:"CIELAB", color:"#EF4444", gamut:100,
    axes:["L* — Lightness 0–100","a* — Green↔Red","b* — Blue↔Yellow"],
    desc:"Industrial standard. Perceptual but hue non-linear in blues.",
    getCSS:(v)=>`lab(${v.L} ${v.a} ${v.b})`,
    toRgb:(v)=>labToRgb(v.L,v.a,v.b),
    defaultVal:{L:55,a:-10,b:-40},
    canvasAxes:{ x:{key:"a",min:-80,max:80,label:"a →"},
                 y:{key:"b",min:-80,max:80,label:"b ↑"},
                 z:{key:"L",min:0,max:100,step:1,label:"L*"} },
    paletteGrid:(L)=>{
      const rows=8,cols=8;
      return Array.from({length:rows},(_,ri)=>{
        const b=Math.round(80-ri*(160/(rows-1)));
        return Array.from({length:cols},(_,ci)=>{
          const a=Math.round(-80+ci*(160/(cols-1)));
          return {L,a,b, css:`lab(${Math.round(L)} ${a} ${b})`};
        });
      });
    }
  },
  hwb: {
    id:"hwb", label:"HWB", color:"#14B8A6", gamut:35.9,
    axes:["H — Hue 0–360°","W — Whiteness 0–100%","B — Blackness 0–100%"],
    desc:"Most intuitive: mix any hue with white or black.",
    getCSS:(v)=>`hwb(${v.H} ${v.W}% ${v.Bk}%)`,
    toRgb:(v)=>hwbToRgb(v.H,v.W,v.Bk),
    defaultVal:{H:217,W:20,Bk:10},
    canvasAxes:{ x:{key:"W",min:0,max:100,label:"W →"},
                 y:{key:"Bk",min:0,max:100,label:"Bk ↑"},
                 z:{key:"H",min:0,max:360,step:1,label:"H"} },
    paletteGrid:(H)=>{
      const rows=8,cols=8;
      return Array.from({length:rows},(_,ri)=>{
        const Bk=Math.round(ri*(80/(rows-1)));
        return Array.from({length:cols},(_,ci)=>{
          const W=Math.round(ci*(80/(cols-1)));
          return {H,W,Bk, css:`hwb(${Math.round(H)} ${W}% ${Bk}%)`};
        });
      });
    }
  },
};

function hsvToRgb(h,s,v){
  s/=100;v/=100;
  const i=Math.floor(h/60)%6, f=h/60-Math.floor(h/60);
  const p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
  let r,g,b;
  switch(i){
    case 0:[r,g,b]=[v,t,p];break;case 1:[r,g,b]=[q,v,p];break;
    case 2:[r,g,b]=[p,v,t];break;case 3:[r,g,b]=[p,q,v];break;
    case 4:[r,g,b]=[t,p,v];break;default:[r,g,b]=[v,p,q];
  }
  return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

function labToRgb(L,a,b){
  const fy=(L+16)/116,fx=a/500+fy,fz=fy-b/200;
  const xr=fx>0.206897?fx*fx*fx:0.128419*(fx-0.137931);
  const yr=fy>0.206897?fy*fy*fy:0.128419*(fy-0.137931);
  const zr=fz>0.206897?fz*fz*fz:0.128419*(fz-0.137931);
  const X=xr*0.95047,Y=yr*1.00000,Z=zr*1.08883;
  const r= 3.2404542*X-1.5371385*Y-0.4985314*Z;
  const g=-0.9692660*X+1.8760108*Y+0.0415560*Z;
  const bv= 0.0556434*X-0.2040259*Y+1.0572252*Z;
  const gam=x=>x<=0.0031308?12.92*x:1.055*Math.pow(Math.max(x,0),1/2.4)-0.055;
  return[Math.round(Math.min(255,Math.max(0,gam(r)*255))),
         Math.round(Math.min(255,Math.max(0,gam(g)*255))),
         Math.round(Math.min(255,Math.max(0,gam(bv)*255)))];
}

function hwbToRgb(h,w,b){
  w/=100;b/=100;
  if(w+b>=1){const g=w/(w+b);return[Math.round(g*255),Math.round(g*255),Math.round(g*255)];}
  const [r,g,bv]=hslToRgb(h,100,50).map(c=>(c/255)*(1-w-b)+w);
  return[Math.round(r*255),Math.round(g*255),Math.round(bv*255)];
}

// ─── 2D PICKER CANVAS ────────────────────────────────────────────────────────
const CANVAS_STEPS = 24; // 24×24 grid = 576 cells — fast to render

function PickerCanvas({ sysId, values, zVal, onPick, activeX, activeY }) {
  const sys = LAB_SYSTEMS[sysId];
  if (!sys) return null;
  const { x: xAxis, y: yAxis } = sys.canvasAxes;

  const cells = [];
  for (let row = 0; row < CANVAS_STEPS; row++) {
    for (let col = 0; col < CANVAS_STEPS; col++) {
      const xV = xAxis.min + (col / (CANVAS_STEPS - 1)) * (xAxis.max - xAxis.min);
      const yV = yAxis.max - (row / (CANVAS_STEPS - 1)) * (yAxis.max - yAxis.min); // y flipped
      const v = { ...values, [xAxis.key]: xV, [yAxis.key]: yV,
                  [sys.canvasAxes.z.key]: zVal };
      const [r, g, b] = sys.toRgb(v);
      const css = `rgb(${r},${g},${b})`;

      // Check if out of sRGB gamut for OKLCH/LAB
      const isOutOfGamut = (sysId === "oklch" || sysId === "lab") && (
        r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255
      );

      // Compute clamped rgb for display
      const dr = Math.min(255, Math.max(0, r));
      const dg = Math.min(255, Math.max(0, g));
      const db = Math.min(255, Math.max(0, b));

      // Is this cell selected?
      const selCol = (activeX - xAxis.min) / (xAxis.max - xAxis.min);
      const selRow = 1 - (activeY - yAxis.min) / (yAxis.max - yAxis.min);
      const isSelected = Math.abs(col/(CANVAS_STEPS-1) - selCol) < 1/(CANVAS_STEPS-1) &&
                         Math.abs(row/(CANVAS_STEPS-1) - selRow) < 1/(CANVAS_STEPS-1);

      cells.push(
        <div key={`${row}-${col}`}
          onClick={() => onPick(xV, yV, v)}
          title={`${xAxis.label.split(" ")[0]}=${xV.toFixed(2)} ${yAxis.label.split(" ")[0]}=${yV.toFixed(2)}`}
          style={{
            background: `rgb(${dr},${dg},${db})`,
            cursor: "crosshair",
            outline: isSelected ? "2px solid #1C1917" : isOutOfGamut ? "1px dashed rgba(180,83,9,0.5)" : "none",
            outlineOffset: "-1px",
            position: "relative",
            // Crosshatch for out-of-gamut
            backgroundImage: isOutOfGamut
              ? `linear-gradient(45deg,rgba(0,0,0,0.15) 25%,transparent 25%,transparent 75%,rgba(0,0,0,0.15) 75%),rgb(${dr},${dg},${db})`
              : "none",
            backgroundSize: isOutOfGamut ? "4px 4px" : "auto",
          }}
        />
      );
    }
  }

  return (
    <div style={{ display:"grid", gap:0 }}>
      {/* Axis labels */}
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:9, color:P.textMute, fontFamily:"'DM Mono',monospace" }}>{xAxis.label}</span>
        <span style={{ fontSize:9, color:P.textMute, fontFamily:"'DM Mono',monospace" }}>{yAxis.label}</span>
      </div>
      <div style={{
        display:"grid",
        gridTemplateColumns:`repeat(${CANVAS_STEPS},1fr)`,
        gridTemplateRows:`repeat(${CANVAS_STEPS},1fr)`,
        width:"100%", aspectRatio:"1/1",
        borderRadius:10, overflow:"hidden",
        border:`1px solid ${P.border}`,
        cursor:"crosshair"
      }}>
        {cells}
      </div>
      {/* Z-axis label */}
      <div style={{ fontSize:9, color:P.textMute, fontFamily:"'DM Mono',monospace", marginTop:3, textAlign:"right" }}>
        {sys.canvasAxes.z.label} = {typeof zVal === "number" && zVal % 1 !== 0 ? zVal.toFixed(2) : zVal}
      </div>
    </div>
  );
}

// ─── PALETTE GRID ────────────────────────────────────────────────────────────
function PaletteGrid({ sysId, values, onPick }) {
  const sys = LAB_SYSTEMS[sysId];
  if (!sys) return null;
  const zKey = sys.canvasAxes.z.key;
  const zVal = values[zKey];
  const grid = sys.paletteGrid(zVal);

  return (
    <div style={{ display:"grid", gap:0, borderRadius:8, overflow:"hidden", border:`1px solid ${P.border}` }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display:"flex" }}>
          {row.map((cell, ci) => {
            const [r, g, b] = sys.toRgb(cell);
            const dr = Math.min(255, Math.max(0, r));
            const dg = Math.min(255, Math.max(0, g));
            const db = Math.min(255, Math.max(0, b));
            const isOoG = (sysId === "oklch" || sysId === "lab") && (r<0||r>255||g<0||g>255||b<0||b>255);
            return (
              <div key={ci}
                onClick={() => onPick(cell)}
                title={cell.css}
                style={{
                  flex:1, aspectRatio:"1/1",
                  background:`rgb(${dr},${dg},${db})`,
                  cursor:"pointer",
                  outline: isOoG ? "1px dashed rgba(180,83,9,0.4)" : "none",
                  outlineOffset:"-1px",
                  backgroundImage: isOoG
                    ? `repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px),linear-gradient(rgb(${dr},${dg},${db}),rgb(${dr},${dg},${db}))`
                    : "none",
                  transition:"transform 0.1s",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── SYSTEM PANEL ────────────────────────────────────────────────────────────
function SystemPanel({ sysId, values, onPickColor, isActive, onRemove }) {
  const sys = LAB_SYSTEMS[sysId];
  const [showSliders, setShowSliders] = useState(false);
  const [tab, setTab] = useState("palette"); // "palette" | "canvas"
  if (!sys) return null;

  const zKey = sys.canvasAxes.z.key;
  const zAxis = sys.canvasAxes.z;
  const [r, g, b] = sys.toRgb(values);
  const css = sys.getCSS(values);
  const dr = Math.min(255, Math.max(0, r));
  const dg = Math.min(255, Math.max(0, g));
  const db = Math.min(255, Math.max(0, b));

  const handlePalettePick = (cell) => {
    const newVals = { ...values };
    Object.keys(cell).forEach(k => { if (k !== "css") newVals[k] = cell[k]; });
    onPickColor(sysId, newVals, `rgb(${Math.min(255,Math.max(0,sys.toRgb(newVals)[0]))},${Math.min(255,Math.max(0,sys.toRgb(newVals)[1]))},${Math.min(255,Math.max(0,sys.toRgb(newVals)[2]))})`);
  };

  const handleCanvasPick = (xV, yV, v) => {
    const newVals = { ...values, ...v };
    onPickColor(sysId, newVals, `rgb(${Math.min(255,Math.max(0,sys.toRgb(newVals)[0]))},${Math.min(255,Math.max(0,sys.toRgb(newVals)[1]))},${Math.min(255,Math.max(0,sys.toRgb(newVals)[2]))})`);
  };

  return (
    <div style={{
      background: P.surface, border:`2px solid ${isActive ? sys.color : P.border}`,
      borderRadius:12, overflow:"hidden",
      boxShadow: isActive ? `0 4px 20px ${sys.color}22` : "0 1px 6px rgba(0,0,0,0.05)",
      transition:"all 0.2s"
    }}>
      {/* Header */}
      <div style={{ background:`${sys.color}10`, borderBottom:`1px solid ${sys.color}22`, padding:"10px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:6, background:`rgb(${dr},${dg},${db})`, border:`1px solid ${P.border}`, flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:700, color:P.text }}>{sys.label}</div>
              <div style={{ fontSize:10, color:P.textMute }}>{sys.desc}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={()=>setShowSliders(s=>!s)} style={{
              fontSize:10, padding:"3px 7px", borderRadius:4, border:"none", cursor:"pointer",
              background: showSliders ? sys.color : P.panel, color: showSliders ? "#fff" : P.textSoft,
              fontFamily:"'DM Mono',monospace", fontWeight:600
            }}>{showSliders?"hide":"sliders"}</button>
            <button onClick={onRemove} style={{
              fontSize:10, padding:"3px 7px", borderRadius:4, border:"none", cursor:"pointer",
              background:P.panel, color:P.textMute
            }}>✕</button>
          </div>
        </div>

        {/* CSS output */}
        <div style={{ marginTop:8, background:"#1C1917", borderRadius:6, padding:"5px 10px" }}>
          <code style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#7DD3FC", wordBreak:"break-all" }}>{css}</code>
        </div>

        {/* Gamut indicator */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
          <span style={{ fontSize:9, color:P.textMute, fontFamily:"'DM Mono',monospace" }}>GAMUT</span>
          <div style={{ flex:1, height:4, background:P.border, borderRadius:2, overflow:"hidden" }}>
            <div style={{ width:`${Math.min(sys.gamut,100)}%`, height:"100%", background:sys.color, borderRadius:2 }}/>
          </div>
          <span style={{ fontSize:9, color:sys.color, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{sys.gamut>=100?"∞":sys.gamut+"%"}</span>
        </div>
      </div>

      {/* Sliders (optional) */}
      {showSliders && (
        <div style={{ padding:"10px 14px", borderBottom:`1px solid ${P.borderFaint}`, display:"grid", gap:8 }}>
          {sys.axes.map((axLabel) => {
            const key = axLabel.split(" — ")[0].split(" ")[0];
            const range = axLabel.match(/\d+[\–\-]\d+/);
            const [mn, mx] = range ? range[0].split(/[–\-]/).map(Number) : [0,100];
            const val = values[key];
            if (val === undefined) return null;
            return (
              <div key={key} style={{ display:"grid", gap:3 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:10, color:P.textSoft, fontFamily:"'DM Mono',monospace" }}>{axLabel}</span>
                  <span style={{ fontSize:10, color:sys.color, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>
                    {typeof val==="number"&&val%1!==0?val.toFixed(3):val}
                  </span>
                </div>
                <input type="range" min={mn} max={mx}
                  step={key==="L"&&sysId==="oklch"?0.001:key==="C"?0.001:1}
                  value={val}
                  onChange={e=>{
                    const nv={...values,[key]:Number(e.target.value)};
                    onPickColor(sysId,nv,`rgb(${sys.toRgb(nv).map(c=>Math.min(255,Math.max(0,c))).join(",")})`);
                  }}
                  style={{ width:"100%", accentColor:sys.color, cursor:"pointer" }}/>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display:"flex", borderBottom:`1px solid ${P.borderFaint}` }}>
        {["palette","canvas"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1, padding:"7px 0", border:"none", cursor:"pointer",
            fontSize:10, fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:"0.06em",
            background: tab===t ? `${sys.color}18` : P.surface,
            color: tab===t ? sys.color : P.textMute,
            borderBottom: tab===t ? `2px solid ${sys.color}` : "2px solid transparent",
          }}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Canvas / Palette */}
      <div style={{ padding:12 }}>
        {/* Z slider */}
        <div style={{ display:"grid", gap:3, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:10, color:P.textSoft, fontFamily:"'DM Mono',monospace" }}>{zAxis.label} (depth)</span>
            <span style={{ fontSize:10, color:sys.color, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>
              {typeof values[zKey]==="number"&&values[zKey]%1!==0?values[zKey].toFixed(2):values[zKey]}
            </span>
          </div>
          <input type="range" min={zAxis.min} max={zAxis.max} step={zAxis.step||1}
            value={values[zKey]}
            onChange={e=>{
              const nv={...values,[zKey]:Number(e.target.value)};
              onPickColor(sysId,nv,`rgb(${sys.toRgb(nv).map(c=>Math.min(255,Math.max(0,c))).join(",")})`);
            }}
            style={{ width:"100%", accentColor:sys.color, cursor:"pointer" }}/>
        </div>

        {tab==="palette" && <PaletteGrid sysId={sysId} values={values} onPick={handlePalettePick}/>}
        {tab==="canvas" && (
          <PickerCanvas
            sysId={sysId} values={values} zVal={values[zKey]}
            activeX={values[sys.canvasAxes.x.key]}
            activeY={values[sys.canvasAxes.y.key]}
            onPick={handleCanvasPick}
          />
        )}
      </div>
    </div>
  );
}

// ─── COMPARATIVE STRIP ───────────────────────────────────────────────────────
function ComparativeStrip({ activeSystems, allValues, activeRgb }) {
  const [r, g, b] = activeRgb ? activeRgb.match(/\d+/g).map(Number) : [59, 130, 246];
  const safeRgb = `rgb(${Math.min(255,Math.max(0,r))},${Math.min(255,Math.max(0,g))},${Math.min(255,Math.max(0,b))})`;

  const toneSteps = [0.95, 0.85, 0.75, 0.62, 0.50, 0.38, 0.25, 0.12];

  return (
    <div style={{ display:"grid", gap:16 }}>
      {/* 1 ── Same color in every active system */}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:16 }}>
        <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:"0.08em", marginBottom:12 }}>
          ① SAME COLOR — expressed in each system
        </div>
        {/* Big swatch */}
        <div style={{ height:56, borderRadius:8, background:safeRgb, marginBottom:12, border:`1px solid ${P.border}` }}/>
        <div style={{ display:"grid", gap:6 }}>
          {activeSystems.map(sysId => {
            const sys = LAB_SYSTEMS[sysId];
            const vals = allValues[sysId];
            if (!sys || !vals) return null;
            const css = sys.getCSS(vals);
            return (
              <div key={sysId} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:sys.color, flexShrink:0 }}/>
                <span style={{ fontSize:10, color:sys.color, fontFamily:"'DM Mono',monospace", fontWeight:700, minWidth:60 }}>{sys.label}</span>
                <div style={{ flex:1, background:"#1C1917", borderRadius:5, padding:"4px 8px", overflow:"hidden" }}>
                  <code style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"#7DD3FC", whiteSpace:"nowrap" }}>{css}</code>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 ── Gamut overlay */}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:16 }}>
        <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:"0.08em", marginBottom:12 }}>
          ② GAMUT COVERAGE — what each system can reproduce
        </div>
        <div style={{ display:"grid", gap:8 }}>
          {activeSystems.map(sysId => {
            const sys = LAB_SYSTEMS[sysId];
            if (!sys) return null;
            const isOoG = (sysId==="oklch"||sysId==="lab") && (r<0||r>255||g<0||g>255||b<0||b>255);
            return (
              <div key={sysId}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:11, color:sys.color, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{sys.label}</span>
                    {isOoG && <span style={{ fontSize:9, background:"#FEF3C7", color:"#B45309", borderRadius:3, padding:"1px 5px", fontWeight:700 }}>⚠ out of sRGB</span>}
                  </div>
                  <span style={{ fontSize:10, color:P.textMute, fontFamily:"'DM Mono',monospace" }}>
                    {sys.gamut>=100?"device-independent":sys.gamut+"% of visible"}
                  </span>
                </div>
                <div style={{ height:14, background:P.panel, borderRadius:4, overflow:"hidden", position:"relative" }}>
                  <div style={{ position:"absolute", left:0, top:0, height:"100%",
                    width:`${Math.min(sys.gamut,100)}%`,
                    background:`linear-gradient(90deg,${sys.color}66,${sys.color})`,
                    borderRadius:4 }}/>
                  {/* sRGB reference line */}
                  <div style={{ position:"absolute", left:"35.9%", top:0, width:1, height:"100%", background:P.textMid, opacity:0.4 }}/>
                </div>
              </div>
            );
          })}
          <div style={{ fontSize:10, color:P.textMute, marginTop:4 }}>
            <span style={{ display:"inline-block", width:12, height:1, background:P.textMid, verticalAlign:"middle", marginRight:4 }}/>
            sRGB boundary (35.9%)
          </div>
        </div>
      </div>

      {/* 3 ── Tonal scale */}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:16 }}>
        <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:"0.08em", marginBottom:12 }}>
          ③ TONAL SCALE — same hue, 8 lightness steps per system
        </div>
        <div style={{ display:"grid", gap:8 }}>
          {activeSystems.map(sysId => {
            const sys = LAB_SYSTEMS[sysId];
            const vals = allValues[sysId];
            if (!sys || !vals) return null;

            let swatches = [];
            if (sysId === "oklch") {
              swatches = toneSteps.map(L => {
                const [sr,sg,sb] = oklchToRgb(L, vals.C, vals.H);
                return `rgb(${Math.min(255,Math.max(0,sr))},${Math.min(255,Math.max(0,sg))},${Math.min(255,Math.max(0,sb))})`;
              });
            } else if (sysId === "hsl" || sysId === "hsv") {
              swatches = [90,80,70,60,50,40,30,20].map(pct => {
                const [sr,sg,sb] = sysId==="hsl" ? hslToRgb(vals.H, vals.S, pct) : hsvToRgb(vals.H, vals.S, pct);
                return `rgb(${sr},${sg},${sb})`;
              });
            } else if (sysId === "rgb") {
              swatches = [240,210,180,150,120,90,60,30].map(v => `rgb(${v},${v},${v})`).map((_, i) => {
                const f = (7-i)/7;
                return `rgb(${Math.round(vals.R*f)},${Math.round(vals.G*f)},${Math.round(vals.B*f)})`;
              });
            } else if (sysId === "lab") {
              swatches = [90,80,70,60,50,40,30,20].map(L => {
                const [sr,sg,sb] = labToRgb(L, vals.a, vals.b);
                return `rgb(${Math.min(255,Math.max(0,sr))},${Math.min(255,Math.max(0,sg))},${Math.min(255,Math.max(0,sb))})`;
              });
            } else if (sysId === "hwb") {
              swatches = [10,20,30,40,50,60,70,80].map(Bk => {
                const [sr,sg,sb] = hwbToRgb(vals.H, vals.W, Bk);
                return `rgb(${sr},${sg},${sb})`;
              });
            }

            return (
              <div key={sysId}>
                <div style={{ fontSize:10, color:sys.color, fontFamily:"'DM Mono',monospace", fontWeight:700, marginBottom:5 }}>{sys.label}</div>
                <div style={{ display:"flex", gap:3, height:28 }}>
                  {swatches.map((sw,i) => (
                    <div key={i} style={{ flex:1, background:sw, borderRadius:4 }}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:10, fontSize:11, color:P.textSoft, lineHeight:1.5 }}>
          OKLCH tonal steps look visually even because it is perceptually uniform. HSL steps jump near the extremes.
        </div>
      </div>

      {/* 4 ── Gradient strips */}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:16 }}>
        <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:"0.08em", marginBottom:12 }}>
          ④ GRADIENT INTERPOLATION — same endpoints, different paths through color space
        </div>
        <div style={{ display:"grid", gap:8 }}>
          {[
            { label:"in oklch", grad:`linear-gradient(in oklch, ${safeRgb}, white)` },
            { label:"in srgb",  grad:`linear-gradient(in srgb, ${safeRgb}, white)` },
            { label:"in hsl",   grad:`linear-gradient(in hsl, ${safeRgb}, white)` },
            { label:"in lab",   grad:`linear-gradient(in lab, ${safeRgb}, white)` },
          ].map(({label,grad}) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:10, color:P.textSoft, fontFamily:"'DM Mono',monospace", minWidth:60 }}>{label}</span>
              <div style={{ flex:1, height:24, borderRadius:6, background:grad, border:`1px solid ${P.borderFaint}` }}/>
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, fontSize:11, color:P.textSoft, lineHeight:1.5 }}>
          oklch stays vivid with no purple band. srgb desaturates evenly. hsl can shift hue. lab tends toward blue-gray.
        </div>
      </div>
    </div>
  );
}

// ─── COLOR LAB 2.0 ────────────────────────────────────────────────────────────
function ColorLab() {
  const ALL_IDS = Object.keys(LAB_SYSTEMS);
  const [activeSystems, setActiveSystems] = useState(["oklch","rgb","hsl"]);
  const [activeSystem, setActiveSystem] = useState("oklch"); // which is "primary"
  const [allValues, setAllValues] = useState(() =>
    Object.fromEntries(ALL_IDS.map(id => [id, { ...LAB_SYSTEMS[id].defaultVal }]))
  );
  const [activeRgb, setActiveRgb] = useState("rgb(59,130,246)");

  const addSystem = (id) => {
    if (!activeSystems.includes(id) && activeSystems.length < 4) {
      setActiveSystems(prev => [...prev, id]);
    }
  };

  const removeSystem = (id) => {
    if (activeSystems.length > 1) {
      setActiveSystems(prev => prev.filter(s => s !== id));
      if (activeSystem === id) setActiveSystem(activeSystems.find(s => s !== id));
    }
  };

  // When a color is picked in any system, sync to all others
  const handlePickColor = (sysId, newVals, rgbStr) => {
    setActiveSystem(sysId);
    setActiveRgb(rgbStr);

    // Parse rgb string
    const parts = rgbStr.match(/\d+/g);
    if (!parts || parts.length < 3) return;
    const [r, g, b] = parts.map(Number);

    // Sync all other active systems
    setAllValues(prev => {
      const updated = { ...prev, [sysId]: newVals };

      activeSystems.forEach(sid => {
        if (sid === sysId) return;
        const sys = LAB_SYSTEMS[sid];
        if (sid === "oklch") {
          const { L, C, H } = rgbToOklch(r, g, b);
          updated[sid] = { L: Math.round(L * 1000) / 1000, C: Math.round(C * 1000) / 1000, H: Math.round(H) };
        } else if (sid === "rgb") {
          updated[sid] = { R: r, G: g, B: b };
        } else if (sid === "hsl") {
          const { h, s, l } = rgbToHsl(r, g, b);
          updated[sid] = { H: h, S: s, L: l };
        } else if (sid === "hsv") {
          const { h, s, v } = rgbToHsv(r, g, b);
          updated[sid] = { H: h, S: s, V: v };
        } else if (sid === "lab") {
          const { L, a, b: bv } = rgbToLab(r, g, b);
          updated[sid] = { L, a, b: bv };
        } else if (sid === "hwb") {
          const { h, s, l } = rgbToHsl(r, g, b);
          const W = Math.round((1 - s / 100) * (l < 50 ? l : 100 - l));
          const Bk = Math.round(l < 50 ? l * (1 - s / 100) : (100 - l) * (1 - s / 100));
          updated[sid] = { H: h, W: Math.max(0, W), Bk: Math.max(0, Bk) };
        }
      });

      return updated;
    });
  };

  const systemOrder = [...activeSystems];

  return (
    <div style={{ display:"grid", gap:20 }}>
      {/* ── Header + system selector ── */}
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:"14px 16px" }}>
        <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, letterSpacing:"0.08em", marginBottom:10 }}>
          ACTIVE SYSTEMS — up to 4 · click palette or canvas to pick any color · all systems sync
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {ALL_IDS.map(id => {
            const sys = LAB_SYSTEMS[id];
            const isActive = activeSystems.includes(id);
            const isFull = activeSystems.length >= 4 && !isActive;
            return (
              <button key={id}
                onClick={() => isActive ? removeSystem(id) : addSystem(id)}
                disabled={isFull}
                style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"6px 12px", borderRadius:8, cursor: isFull ? "not-allowed" : "pointer",
                  background: isActive ? `${sys.color}18` : P.panel,
                  border:`1.5px solid ${isActive ? sys.color : P.border}`,
                  opacity: isFull ? 0.4 : 1,
                  transition:"all 0.15s"
                }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:sys.color }}/>
                <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:700, color: isActive ? sys.color : P.textSoft }}>{sys.label}</span>
                {isActive && <span style={{ fontSize:9, color:sys.color }}>✓</span>}
              </button>
            );
          })}
          <span style={{ fontSize:10, color:P.textMute, alignSelf:"center", marginLeft:4 }}>
            {activeSystems.length}/4 active
          </span>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }}>
        {/* Left: system panels */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {systemOrder.map(sysId => (
            <SystemPanel
              key={sysId}
              sysId={sysId}
              values={allValues[sysId]}
              onPickColor={handlePickColor}
              isActive={activeSystem === sysId}
              onRemove={() => removeSystem(sysId)}
            />
          ))}
        </div>

        {/* Right: comparative analysis */}
        <ComparativeStrip
          activeSystems={activeSystems}
          allValues={allValues}
          activeRgb={activeRgb}
        />
      </div>

      {/* ── Learning note ── */}
      <div style={{ background:P.amberLt, border:`1px solid ${P.amberMd}`, borderRadius:10, padding:"12px 16px" }}>
        <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, marginBottom:6, letterSpacing:"0.06em" }}>
          HOW TO USE THIS LAB
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:8 }}>
          {[
            "Click any swatch in a palette or canvas → all active systems instantly sync to the same color.",
            "Toggle Palette ↔ Canvas view per system. Canvas shows the 2D geometry of each color space.",
            "Drag the depth slider to sweep through the third axis of each model.",
            "Crosshatched swatches in OKLCH and LAB are out-of-sRGB-gamut — your screen shows the nearest displayable colour.",
            "Compare tonal scales: OKLCH steps look even; HSL steps near black/white look bigger.",
            "Compare gradients: oklch stays vivid; sRGB can shift hue; hsl often oversaturates.",
          ].map((tip,i) => (
            <div key={i} style={{ display:"flex", gap:8 }}>
              <span style={{ fontSize:12, color:P.amber, flexShrink:0 }}>→</span>
              <span style={{ fontSize:12, color:P.textMid, lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── CONCEPTS VIEW ───────────────────────────────────────────────────────────
const CONCEPTS = [
  { id:"gamut",      label:"Color Gamut",             icon:"◕",
    summary:"The range of all colors a system can reproduce.",
    detail:"Measured as percentage of the CIE 1931 visible horseshoe. sRGB = 35.9%, Display P3 = 53.6%, Rec.2020 = 75.8%. Colors outside a gamut are 'clipped' or 'mapped' to the nearest in-gamut color. Gamut clipping = brutal chop. Gamut mapping = perceptual compression.",
    analogy:"A gamut is like a country's territory — colors outside it are foreign lands your device can't visit." },
  { id:"delta-e",    label:"ΔE — Color Difference",   icon:"△",
    summary:"A number representing the perceptual 'distance' between two colors.",
    detail:"ΔE < 1.0 = imperceptible. ΔE 1–2 = only trained observers notice. ΔE 2–4 = noticeable to most people. ΔE > 5 = obvious. CIEDE2000 is the current CIE formula — it corrects for non-uniformities in CIELAB with rotation terms and lightness-dependent weights.",
    analogy:"ΔE is the color equivalent of an audiometer's decibel — a calibrated unit of human perception." },
  { id:"whitepoint", label:"White Point",              icon:"○",
    summary:"The reference 'white' that anchors every color space.",
    detail:"D65 (6500K, north-sky daylight) is the standard for displays, cameras, and CSS. D50 (5003K, noon sun) is used for printing and the ICC Profile Connection Space. Mixing D65-designed colors with D50 content causes a visible color cast.",
    analogy:"Like tuning a piano's middle A to 440 Hz vs 442 Hz — everything plays in tune within a system, but clashes between systems." },
  { id:"gamma",      label:"Gamma / Transfer Function",icon:"γ",
    summary:"The nonlinear curve mapping code values to physical light output.",
    detail:"sRGB uses a piecewise curve giving ~2.2 effective gamma. Linear = 1.0 (gamma-free, required for physically correct math). Gamma 2.2 allocates more code values to dark tones where human vision is most sensitive (Weber's Law). Game engines linearize textures on load and re-apply gamma on output.",
    analogy:"Like how ears hear logarithmically: a whisper-to-conversation jump feels larger than conversation-to-yelling." },
  { id:"metamerism", label:"Metamerism",               icon:"≋",
    summary:"Two colors that look identical under one light but different under another.",
    detail:"Happens when two spectrally different stimuli produce identical cone responses. The fundamental reason color management exists — we cannot reproduce the same spectrum across devices, only metameric matches. Famously causes fabrics that match in a store's fluorescent light to clash outdoors.",
    analogy:"Two shirts that match perfectly in the store but clash in sunlight." },
  { id:"chroma-sub", label:"Chroma Subsampling",       icon:"⊞",
    summary:"Discarding color detail the eye can't resolve anyway.",
    detail:"4:4:4 = full color. 4:2:2 = half horizontal chroma. 4:2:0 = quarter chroma (used in JPEG, H.264, H.265). Human vision resolves luminance at 3× the detail of chroma — making 4:2:0 nearly invisible while saving 50% bandwidth.",
    analogy:"Like printing a newspaper photo — full ink density detail, simplified colour separation." },
  { id:"icc",        label:"ICC Profiles",             icon:"⬟",
    summary:"Files that describe a device's color personality to the OS.",
    detail:"An ICC profile maps between a device's values and the absolute CIE XYZ Profile Connection Space. Without profiles, a wide-gamut monitor shows sRGB content oversaturated. macOS uses ICC system-wide; Windows only for managed apps. ICC v4.4 is the current standard; iccMAX adds spectral PCS.",
    analogy:"A universal translator — the ICC profile lets your camera, monitor, and press all agree on what 'red' means." },
  { id:"perceptual",  label:"Perceptual Uniformity",   icon:"⊜",
    summary:"Equal numeric steps produce visually equal differences.",
    detail:"sRGB is not uniform: 0→50 in red looks nothing like 50→100. CIELAB tried to fix this in 1976 but failed in saturated blues. OKLAB fixed it properly in 2020 using optimized matrices against CAM16 perceptual data. Uniformity means WCAG contrast ratios can be computed by simple L-value subtraction.",
    analogy:"A ruler where each centimetre looks equally long to your eye — vs one where millimetres at the top look like centimetres at the bottom." },
  { id:"opponent",   label:"Opponent Channels",        icon:"⇋",
    summary:"How the brain actually encodes color — in opposing pairs.",
    detail:"After cone signals leave the retina, they're recoded as: Luminance (L+M), Red-Green (L-M), Blue-Yellow (S-(L+M)). This explains why no 'reddish-green' exists. CIELAB's a*/b* axes and OKLAB's a/b axes directly mirror this neural architecture. Hering proposed this in 1892; confirmed experimentally in 1957.",
    analogy:"Your brain stores 'more red than green by X, more blue than yellow by Y' — not 'red 73%, green 41%'." },
];

function ConceptsView() {
  const [active, setActive] = useState(null);
  return (
    <div>
      <div style={{ fontSize:11, color:P.textMute, marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>
        CORE COLOR SCIENCE CONCEPTS — tap any card to expand
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
        {CONCEPTS.map(c => {
          const isActive = active === c.id;
          return (
            <div key={c.id} onClick={() => setActive(isActive ? null : c.id)} style={{
              background: isActive ? P.surface : P.bg,
              border:`1px solid ${isActive ? "#B4530966" : P.border}`,
              borderRadius:12, padding:16, cursor:"pointer", transition:"all 0.2s",
              boxShadow: isActive ? "0 4px 20px rgba(0,0,0,0.07)" : "none"
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20, color:P.amber }}>{c.icon}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:P.text }}>{c.label}</span>
                </div>
                <span style={{ fontSize:12, color:P.textMute }}>{isActive ? "↑" : "↓"}</span>
              </div>
              <p style={{ fontSize:13, color:P.textMid, margin:0, lineHeight:1.55 }}>{c.summary}</p>
              {isActive && (
                <div style={{ marginTop:14, display:"grid", gap:10 }}>
                  <div style={{ background:P.panel, borderRadius:8, padding:12 }}>
                    <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, marginBottom:6, letterSpacing:"0.06em" }}>DEEP EXPLANATION</div>
                    <p style={{ fontSize:13, color:P.textMid, margin:0, lineHeight:1.7 }}>{c.detail}</p>
                  </div>
                  {c.analogy && (
                    <div style={{ background:P.amberLt, border:`1px solid ${P.amberMd}`, borderRadius:8, padding:12 }}>
                      <div style={{ fontSize:10, color:P.amber, fontFamily:"'DM Mono',monospace", fontWeight:700, marginBottom:4, letterSpacing:"0.06em" }}>ANALOGY</div>
                      <p style={{ fontSize:12, color:P.textMid, margin:0, lineHeight:1.6, fontStyle:"italic" }}>"{c.analogy}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Human vision biology section */}
      <div style={{ marginTop:24, background:P.surface, border:`1px solid ${P.border}`, borderRadius:14, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:P.text, marginBottom:4 }}>⬡ Human Vision — The Biological Foundation of All Color Systems</div>
        <p style={{ fontSize:12, color:P.textSoft, lineHeight:1.6, marginBottom:16 }}>
          Every color space ever built is a mathematical model of these six biological facts.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:10 }}>
          {[
            { label:"S-Cones (Blue)",     peak:"~420 nm",    pct:"~2%",   note:"Fewest cones. Blue-violet. Most sensitive to short wavelengths.",       color:"#60A5FA" },
            { label:"M-Cones (Green)",    peak:"~530 nm",    pct:"~32%",  note:"Medium sensitivity. Green-yellow response peak.",                         color:"#34D399" },
            { label:"L-Cones ('Red')",    peak:"~559 nm",    pct:"~64%",  note:"Most abundant. Peak is yellow-green — NOT red. Sensitive to broadband.", color:"#F87171" },
            { label:"Rods (Scotopic)",    peak:"~498 nm",    pct:"~120M", note:"Night vision only. No colour info. Purkinje shift causes blue sensitivity at dusk.", color:"#94A3B8" },
            { label:"Opponent Channels", peak:"Post-retina", pct:"3 ch",  note:"L+M (luminance), L−M (red-green), S−(L+M) (blue-yellow). Basis of LAB/OKLAB axes.", color:"#A78BFA" },
            { label:"MacAdam Ellipses",  peak:"1942",        pct:"50:1",  note:"JNDs vary 50× across CIE xy diagram. The proof that XYZ is not perceptually uniform.", color:"#FBBF24" },
          ].map(item => (
            <div key={item.label} style={{ background:P.panel, borderRadius:8, padding:12, borderLeft:`3px solid ${item.color}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color:P.text }}>{item.label}</span>
                <span style={{ fontSize:10, color:P.textMute }}>{item.pct}</span>
              </div>
              <div style={{ fontSize:10, color:item.color, fontFamily:"'DM Mono',monospace", marginBottom:4 }}>Peak: {item.peak}</div>
              <p style={{ fontSize:11, color:P.textSoft, margin:0, lineHeight:1.5 }}>{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("magazine");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = COLOR_SYSTEMS.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.short.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t=>t.includes(search.toLowerCase())) ||
    s.domain.some(d=>d.includes(search.toLowerCase())) ||
    s.type.includes(search.toLowerCase())
  );

  const showSidepanel = selected && !["compare","lab","concepts"].includes(view);

  return (
    <div style={{ background:P.bg, minHeight:"100vh", color:P.text, fontFamily:"'DM Sans',system-ui,sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(180deg,${P.surface} 0%,${P.bg} 100%)`,
        borderBottom:`1px solid ${P.border}`,
        padding:"14px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:12, flexWrap:"wrap", position:"sticky", top:0, zIndex:100,
        backdropFilter:"blur(8px)"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          {/* Hue wheel logo */}
          <div style={{ width:32, height:32, borderRadius:"50%", background:"conic-gradient(oklch(0.65 0.22 0),oklch(0.65 0.22 90),oklch(0.65 0.22 180),oklch(0.65 0.22 270),oklch(0.65 0.22 360))", flexShrink:0 }}/>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:700, letterSpacing:"0.1em", background:`linear-gradient(90deg,${P.amber},#DC2626,#7C3AED)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>CHROMA CODEX</div>
            <div style={{ fontSize:10, color:P.textMute }}>Color Systems Encyclopedia · {COLOR_SYSTEMS.length} systems</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={()=>{setView(v.id);if(v.id!=="magazine")setSelected(null);}} style={{
              display:"flex", alignItems:"center", gap:5,
              padding:"6px 11px", borderRadius:7, border:"none", fontSize:11, cursor:"pointer",
              background: view===v.id ? P.amber : "transparent",
              color: view===v.id ? "#FFFDF8" : P.textSoft,
              fontFamily:"'DM Mono',monospace", fontWeight:600, letterSpacing:"0.04em",
              transition:"all 0.15s"
            }}>
              <span>{v.icon}</span><span>{v.label}</span>
            </button>
          ))}
        </div>

        <input type="text" placeholder="Search systems…" value={search}
          onChange={e=>{setSearch(e.target.value);setView("magazine");}}
          style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:8,
            padding:"7px 12px", color:P.text, fontSize:12, fontFamily:"'DM Mono',monospace",
            outline:"none", minWidth:180 }}/>
      </div>

      {/* ── HERO ── */}
      {view==="magazine" && !search && (
        <div style={{
          background:`linear-gradient(135deg,${P.surface} 0%,#FFF8EE 50%,${P.surface} 100%)`,
          borderBottom:`1px solid ${P.border}`,
          padding:"36px 24px", position:"relative", overflow:"hidden"
        }}>
          <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ fontSize:10, color:P.amber, letterSpacing:"0.2em", fontFamily:"'DM Mono',monospace", marginBottom:10, fontWeight:700 }}>
              FROM NEWTON'S 1666 PRISM TO CSS OKLCH — 360 YEARS OF COLOR SCIENCE
            </div>
            <h1 style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, margin:"0 0 14px", lineHeight:1.1, color:P.text }}>
              Every Color System,{" "}
              <span style={{ background:`linear-gradient(90deg,${P.amber},#DC2626,#7C3AED,${P.blue})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>A to Z</span>
            </h1>
            <p style={{ fontSize:14, color:P.textSoft, maxWidth:580, lineHeight:1.75, margin:"0 0 20px" }}>
              An interactive reference covering{" "}
              <Tooltip content="RGB variants, CIE spaces, print systems, broadcast formats, perceptual models, film/VFX pipelines, designer tools, and appearance models">
                {COLOR_SYSTEMS.length} color systems
              </Tooltip>
              {" "}— their history, hardware layer, software use, and real-world applications. Eight ways to explore.
            </p>
            {/* Quick stats row */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {[
                {v:COLOR_SYSTEMS.length, l:"Systems covered"},
                {v:"1666", l:"Earliest (Newton)"},
                {v:"2025", l:"Latest (ACES 2.0)"},
                {v:"8", l:"View modes"},
              ].map(({v,l}) => (
                <div key={l} style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:8, padding:"8px 14px" }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:16, fontWeight:700, color:P.text }}>{v}</div>
                  <div style={{ fontSize:10, color:P.textMute }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", right:-30, top:-30, width:220, height:220, borderRadius:"50%",
            background:"conic-gradient(from 0deg, oklch(0.72 0.18 0),oklch(0.72 0.18 72),oklch(0.72 0.18 144),oklch(0.72 0.18 216),oklch(0.72 0.18 288),oklch(0.72 0.18 360))",
            opacity:0.2 }}/>
        </div>
      )}

      {/* ── MAIN ── */}
      <div style={{
        maxWidth:1200, margin:"0 auto", padding:"20px 16px",
        display:"grid",
        gridTemplateColumns: showSidepanel ? "1fr 400px" : "1fr",
        gap:20, alignItems:"start"
      }}>
        <div>
          {/* magazine */}
          {view==="magazine" && (
            <div>
              <div style={{ fontSize:11, color:P.textMute, marginBottom:14, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>
                {filtered.length} SYSTEMS — click any card to open detail panel
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:10 }}>
                {filtered.map(sys => (
                  <CompactCard key={sys.id} sys={sys} selected={selected?.id===sys.id}
                    onClick={()=>setSelected(selected?.id===sys.id?null:sys)}/>
                ))}
              </div>
            </div>
          )}
          {view==="timeline"  && <TimelineView onSelect={s=>{setSelected(s);}} />}
          {view==="domain"    && <DomainView   onSelect={s=>setSelected(s)} />}
          {view==="hardware"  && <HardwareView  onSelect={s=>setSelected(s)} />}
          {view==="usecase"   && <UseCaseView   onSelect={s=>setSelected(s)} />}
          {view==="compare"   && <CompareView />}
          {view==="lab"       && (
            <div>
              <div style={{ fontSize:11, color:P.textMute, marginBottom:20, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>
                INTERACTIVE COLOR LAB — experiment with models, gradients, and tonal scales live
              </div>
              <ColorLab />
            </div>
          )}
          {view==="concepts"  && <ConceptsView />}
        </div>

        {/* Side panel */}
        {showSidepanel && (
          <div style={{ position:"sticky", top:80, maxHeight:"calc(100vh - 100px)", overflowY:"auto" }}>
            <div style={{ marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:11, color:P.textMute, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em" }}>DEEP DIVE</span>
            </div>
            <DeepDive sys={selected} onClose={()=>setSelected(null)} />
          </div>
        )}
      </div>

      {/* ── GLOSSARY FOOTER ── */}
      {view==="magazine" && !search && (
        <div style={{ borderTop:`1px solid ${P.border}`, padding:"20px 24px", maxWidth:1200, margin:"0 auto" }}>
          <div style={{ fontSize:10, color:P.textMute, fontFamily:"'DM Mono',monospace", marginBottom:14, letterSpacing:"0.08em" }}>KEY CONCEPTS QUICK REFERENCE</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:10 }}>
            {[
              { l:"Gamut",              d:"Range of reproducible colors — measured as % of the CIE 1931 visible horseshoe." },
              { l:"ΔE (Delta-E)",        d:"Color difference number. <1 = imperceptible. >4 = obvious. CIEDE2000 is the current formula." },
              { l:"White Point",         d:"Reference white: D65=6500K for displays. D50=5003K for print/ICC." },
              { l:"Gamma / TF",          d:"Nonlinear curve mapping code values to light output. sRGB ≈ 2.2. Linear = 1.0 for rendering." },
              { l:"Chroma Subsampling",  d:"4:2:0 drops 75% of color data. Vision resolves chroma at 1/3 luminance resolution." },
              { l:"ICC Profile",         d:"File mapping device colors to absolute CIE XYZ. Enables cross-device color accuracy." },
              { l:"Perceptual Uniform",  d:"Equal numeric steps = equal perceived differences. OKLAB achieves this. sRGB does not." },
              { l:"Opponent Channels",   d:"Brain encodes color as Luminance, Red-Green, Blue-Yellow — not RGB." },
            ].map(c => (
              <div key={c.l} style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:8, padding:"11px 13px" }}>
                <div style={{ fontSize:12, color:P.amber, fontWeight:700, marginBottom:5 }}>{c.l}</div>
                <p style={{ fontSize:11, color:P.textSoft, margin:0, lineHeight:1.5 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:${P.bg}}
        ::-webkit-scrollbar-thumb{background:${P.border};border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${P.textMute}}
        button{font-family:inherit}
        input[type=range]{cursor:pointer}
        @media(max-width:640px){nav span:last-child{display:none}}
      `}</style>
    </div>
  );
}
