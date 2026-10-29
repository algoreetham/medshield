# MedShield AI — Architecture & Threat Modeling Specification

This document details the engineering architecture, telemetry pipeline, network segmentation topology, and clinical risk evaluation model powering **MedShield AI**.

---

## 1. Network Topology & Hospital VLAN Segmentation

MedShield monitors segmented hospital network zones defined by ANSI/ISA-62443 and NIST SP 800-66 standards:

```text
                                [ BORDER FIREWALL ]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
          [ VLAN-10: CORE IT ]                          [ VLAN-25: IMAGING ]
        • Epic EHR Database (10.240.12.8)             • Radiology PACS Archive
        • Patient Vitals DB (10.240.12.19)              (10.240.25.77)
                 │                                               │
                 ├───────────────────────┬───────────────────────┘
                 │                       │
      [ VLAN-20: CLINICAL SERVICES ]     │
    • Pharmacy Dispensing API            │
      (10.240.22.45)                     │
                                         ▼
                            [ VLAN-30: BIOMEDICAL IoT ]
                          • Alaris Infusion Gateway (10.240.30.104)
                          • IntelliVue ICU Bedside Hub (10.240.30.120)
```

### Segmentation Rules
1. **Core VLAN-10 to Med-IoT VLAN-30 Isolation**: Direct TCP traffic between clinical staff workstations and biomedical IoT bridges is strictly prohibited. Communication must traverse authenticated proxy brokers.
2. **Biomedical Fallback Principle**: If network containment severs VLAN-30 gateways, medical devices autonomously transition to local offline cache mode to prevent drug delivery interruption.

---

## 2. Threat Modeling: Healthcare Adversary Progression

The default simulation models an advanced persistent threat (APT) traversing from external compromise to biomedical endpoints:

| Stage | MITRE Technique | Description | Security Telemetry Signature | Clinical Impact |
|:---|:---|:---|:---|:---|
| **01. Initial Access** | `T1078.003` | Compromised nurse VPN credentials | Anomalous geolocated ingress from `185.220.101.42` | Zero clinical impact (perimeter) |
| **02. Credential Dump** | `T1003` | Active Directory credential exfiltration | LSASS memory dump on domain controller `host-04` | Administrative exposure |
| **03. Priv Escalation** | `T1068` | Token manipulation | `SeDebugPrivilege` assignment on clinical workstation | Elevated IT control |
| **04. Database Access** | `T1005` | Bulk queries to Patient Vitals DB | 1,800 records/sec exfiltration attempt on port 5432 | HIPAA / PII exposure |
| **05. Service Traversal**| `T1021.002` | Lateral traversal to Pharmacy API | SMB named pipe traversal to `10.240.22.45` | Medication verification delay |
| **06. Medical IoT** | `T1485` | Port 8443 probe on Alaris Infusion Gateway | Unauthorized TCP SYN to infusion pump bridge | **Critical**: Telemetry sync disruption |

---

## 3. Clinical Restraint Engine (§ 14 Design Rules)

A core requirement of MedShield AI is **strict clinical restraint**:
- **Never claim confirmed physical harm** solely based on cybersecurity telemetry.
- Use precise, restrained operational language:
  - ✅ *"Potential clinical disruption detected on VLAN-30"*
  - ✅ *"Medical device telemetry bridge probed"*
  - ❌ *"Patient receiving incorrect drug dosage"* (Unsubstantiated hallucination)

---

## 4. Human-in-the-Loop Containment Protocol (SOP-014)

Containment operations require explicit human authorization to prevent operational disruption in active patient care environments:

```
[Threat Escalation] ──► [AI Recommendation] ──► [Human Authorization Required]
                                                              │
                    ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
                    ▼                                                                                   ▼
             [CONFIRMED]                                                                           [REJECTED]
    1. Revoke AD Credentials (`nurse_admin`)                                                  Continue active
    2. Drop border firewall ingress for `185.220.101.42`                                       monitoring with
    3. Issue VLAN-30 quarantine routing policy                                                L3 analyst alert
    4. Notify floor charge nurse & biomedical team
```

---

## 5. Client-Side Zero-Dependency Architecture

```text
Browser Client
├── index.html       → Lightweight Semantic DOM & SVG Canvas
├── css/             → Hardware-accelerated CSS keyframe transforms
└── js/
    ├── app.js       → Event loop coordinator, SVG gauge calculators & Web Audio synthesizer
    └── mock-data.js → Telemetry streams & asset state dictionaries
```

- **Zero npm dependencies**: Fast initial load (< 80ms) and immune to supply-chain attacks.
- **Web Audio Synthesizer**: Uses browser `AudioContext` to generate procedural harmonic tactical audio without external audio assets.
- **Export Capabilities**: Standard JSON forensic reports generated via client-side Blob URLs.
