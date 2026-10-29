<div align="center">

# 🛡️ MedShield AI
### *Healthcare Cybersecurity Command Center & SOC War-Room*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Zero Backend](https://img.shields.io/badge/Architecture-100%25%20Client--Side-00e5ff?style=flat-square)](#architecture)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20%7C%20Local%20Gemma-ff1744?style=flat-square)](#multi-engine-ai-architecture)
[![Healthcare Context](https://img.shields.io/badge/Domain-Biomedical%20%26%20Clinical%20SOC-00e676?style=flat-square)](#clinical-impact-analysis)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-white?style=flat-square)](#getting-started)

<br/>

**MedShield AI** is an authentic, high-impact cybersecurity operations center (SOC) war-room console designed specifically for healthcare systems and hospital IT networks. It bridges the critical divide between standard cybersecurity event detection and clinical patient safety context.

[Live Demo](#getting-started) • [Visual Architecture](#visual-architecture) • [Clinical Risk Engine](#clinical-risk-analysis) • [Attack Simulation](#adversary-attack-scenarios) • [Quickstart](#getting-started)

---

</div>

## 📌 Executive Summary

Modern hospital networks operate with an interconnected mesh of electronic health record databases, clinical workstations, and life-critical biomedical IoT devices (infusion pumps, ventilators, ICU bedside monitors). A cyber attack on these endpoints is not merely an IT outage—it is a **direct threat to patient safety**.

**MedShield AI** delivers:
1. **Immediate Threat Detection**: Real-time vector trajectory tracking of incoming adversary intrusions.
2. **Clinical Risk Context**: Evaluates whether cyber lateral traversal impacts medical devices and patient life-support systems with restrained, clinical medical terminology.
3. **Simulated Containment**: Allows operators to simulate and execute multi-layered network containment (quarantine, credential revocation, VLAN isolation) while strictly retaining **human authorization** for real-world changes.

---

## 🖥️ Visual Architecture

The interface is modeled after mission-critical aerospace and cybersecurity defense consoles, featuring a dark-field HUD, vector targeting reticles, radial SVG gauges, and live telemetry feeds:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP HUD: MedShield AI · Telemetry Beacon · Live UTC Clock · AI Engine · Global Controls │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [RADIAL GAUGES HUD]         [CENTRAL GLOBAL ATTACK MAP]          [DIGITAL HUD & AI]   │
│  ┌────────────────────┐      ┌───────────────────────────────┐    ┌──────────────────┐ │
│  │ Speedometer Arc    │      │  • Vector World Silhouette    │    │ INC-8492         │ │
│  │ CVSS Exploit Gauge │      │  • Crimson Target Reticle 🎯  │    │ Threat Bar [===] │ │
│  ├────────────────────┤      │  • Dynamic Laser Trajectories │    ├──────────────────┤ │
│  │ Concentric Rings:  │      │  • Adversary IP Tracking      │    │ AI Incident      │ │
│  │ [91] Cyber Risk    │      │  • Hospital Core Target Zone  │    │ Classification   │ │
│  │ [HI] Clinical Risk │      └───────────────────────────────┘    │ Clinical Impact  │ │
│  └────────────────────┘                                           └──────────────────┘ │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [BOTTOM ROW: 6 INTERACTIVE HOSPITAL VLAN RADAR PODS]                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ 01·CORE  │ │ 02·DATA  │ │03·CLINIC │ │ 04·MED-IOT│ │05·IMAGING│ │06·LIFE-SUP│        │
│  │ Epic EHR │ │ Vitals DB│ │ Pharmacy │ │ Infusion* │ │ PACS Arch│ │ ICU Hub   │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [MACHINE EVENT STREAM: Real-time Chronological Monospace Telemetry Logs]              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🎯 1. Central Global Attack Map & Crimson Target Reticle
- **Precision Target Reticle**: High-luminance red radar circle (`#ff1744`) focusing on the hospital attack zone with a rotating radar sweep scanner.
- **Dynamic Laser Trajectories**: Animated SVG vector curves that fire dynamically across the map from adversary origin points (`185.220.101.42`) into the Hospital Core Network and VLAN-30 Medical IoT Gateway during simulations.

### ⏱️ 2. Triple Radial Threat & Clinical Gauges
- **Speedometer Exploit Arc**: Curved arc meter with an animated needle that swings smoothly from `CVSS 1.2 BASE` (green) to `CVSS 9.1 CRITICAL` (red).
- **Concentric Cyber Threat Ring**: Double circular ring gauge tracking real-time compromise depth (climbs from `12` to `91`).
- **Clinical Exposure Ring**: Dual-color radial gauge evaluating biomedical and patient care disruption (transitions from `LOW` to `HIGH`).

### 🏥 3. Bottom Row: 6 Interactive Hospital Radar Pods
Each pod provides real-time telemetry, IP tracking, VLAN segment tags, and multi-state radar icons:
| Pod | Segment | Endpoint Asset | IP Address | Baseline Status | Attack State |
|:---:|:---:|:---|:---:|:---:|:---:|
| **01** | `VLAN-10-CORE` | **Epic EHR Core DB** | `10.240.12.8` | `HEALTHY` | Monitored |
| **02** | `VLAN-10-CORE` | **Patient Vitals DB** | `10.240.12.19` | `HEALTHY` | Compromised |
| **03** | `VLAN-20-CLINICAL` | **Pharmacy Dispensing API** | `10.240.22.45` | `HEALTHY` | Traversal |
| **04** | `VLAN-30-MED-IOT` | **Alaris Infusion Gateway** | `10.240.30.104` | `HEALTHY` | **`CRITICAL ALERT`** |
| **05** | `VLAN-25-IMAGING` | **Radiology PACS Archive** | `10.240.25.77` | `HEALTHY` | Secure |
| **06** | `VLAN-30-MED-IOT` | **IntelliVue ICU Monitor Hub** | `10.240.30.120` | `HEALTHY` | Monitored |

### 🤖 4. Multi-Engine AI Architecture
MedShield AI incorporates resilient multi-tier intelligence:
1. **Google Gemini 1.5 Flash (Live API)**: Direct client-side multimodal/semantic analysis using your Google AI Studio API key.
2. **Local Gemma 4 12B Instruct (Simulation)**: On-device simulation engine providing private, local incident classification with `[LOCAL]` indicator.
3. **Deterministic Rules Evaluator**: Offline fallback engine guaranteeing 100% operational availability.

### 🛡️ 5. Human-in-the-Loop Containment (SOP-014)
When a critical incident is detected:
- The operator is presented with an ordered response checklist (credential revocation, perimeter IP drops, biomedical gateway quarantine).
- Operational verification ensures nurses and biomedical staff are notified before gateway isolation.
- Executing containment severs attack laser trajectories, resets radar pods to `HEALTHY`, and normalizes radial threat gauges.

---

## ⚡ Adversary Attack Scenarios

### Scenario 1: Credential Compromise ➔ Medical IoT Traversal
```
[Initial Access] ──► [Credential Dump] ──► [Privilege Escalation]
   Phishing Entry       AD Compromise          SYSTEM Level Access
                                                        │
[Medical IoT Gateway] ◄── [Medication API] ◄── [Patient DB Query]
   Infusion Pump Probe     Dose Service Probe      PII Exfiltration
```
- **MITRE ATT&CK**: `T1078.003` (Valid Accounts), `T1068` (Privilege Escalation), `T1021` (Lateral Movement).
- **Clinical Implication**: Potential disruption to intravenous medication telemetry synchronization across active ICU beds.

### Scenario 2: Healthcare Ransomware Pre-Encryption Staging
- Detects bulk volume shadow copy deletion, high-frequency SMB traversal, and pre-encryption staging on clinical PACS archive servers.

---

## 🚀 Getting Started

MedShield AI is built as a **100% standalone, zero-dependency client application**. There are no build tools, no Node.js servers, and no npm packages required.

### Option 1: Direct File Open
Double-click `index.html` in your file explorer, or open it directly in any modern browser:
```bash
open index.html # On macOS
```

### Option 2: Local HTTP Server
```bash
# Clone the repository
git clone https://github.com/algoreetham/medshield.git
cd medshield

# Start a quick static server
python3 -m http.server 4000
```
Open **[http://localhost:4000](http://localhost:4000)** in your browser.

---

## 📂 Project Structure

```text
medshield/
├── index.html            # Main command center HTML structure & SVG canvas layers
├── css/
│   └── medshield.css     # War-room design system, HUD styling & SVG animation keyframes
├── js/
│   ├── app.js            # Master application coordinator, HUD gauges & containment logic
│   └── mock-data.js      # Telemetry models, MITRE attack steps & asset inventories
└── README.md             # Project documentation
```

---

## 🏥 Clinical Safety & Operational Restraint

> **⚠️ Healthcare Safety Disclaimer**
> 
> MedShield AI operates in an analytical simulation capacity. The UI explicitly enforces restrained clinical terminology (e.g., *"Potential clinical disruption detected"*, not claiming unverified patient harm). All containment operations strictly mandate **human authorization** before taking simulated real-world actions. No physical hospital systems or medical equipment are modified.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<div align="center">
<sub>Crafted for modern Healthcare Cybersecurity Operations. Built with precision and care.</sub>
</div>
