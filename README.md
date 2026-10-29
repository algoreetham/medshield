# MedShield AI — Healthcare Cybersecurity Command Center

MedShield is a healthcare cybersecurity command-center and security operations center (SOC) war-room frontend interface.

## Features
- **Global Cyber Attack Map & Central Target Reticle**: Real-time visualization with threat focus zone and animated attack vectors.
- **Radial Multi-Vector Threat Gauges**: Speedometer exploit arc (CVSS score), concentric cyber risk ring, and dual-color clinical exposure indicators.
- **Bottom Interactive Radar Pods**: Monitored endpoints across hospital VLANs (Epic EHR Core, Patient Vitals DB, Pharmacy Dispensing API, Alaris Infusion Gateway, Radiology PACS Archive, IntelliVue ICU Monitor Hub).
- **Incident Telemetry Tracking**: Live machine event log and telemetry streaming.
- **Human-in-the-Loop Containment**: Authorized clinical system isolation and device quarantine workflows.
- **Pure Standalone Frontend**: Zero build steps or backend servers needed — opens directly in any browser.

## Getting Started
Simply open `index.html` in your browser:
```bash
# Or serve locally using Python:
python3 -m http.server 4000
```
Then navigate to `http://localhost:4000`.
