// MedShield AI - Data Models & Baseline Telemetry
// Attached to window.MedShieldData for universal browser compatibility (file:// and http://)

window.MedShieldData = {
  INITIAL_ASSETS: [
    {
      id: 'ast-ehr-01',
      name: 'Epic EHR Core Database',
      type: 'IT Infrastructure',
      ip: '10.240.12.8',
      vlan: 'VLAN-10-CORE',
      status: 'HEALTHY',
      clinicalCriticality: 'Tier 1 - Mission Critical',
      affected: false
    },
    {
      id: 'ast-pdb-02',
      name: 'Patient Demographics & Vitals DB',
      type: 'Clinical Data Store',
      ip: '10.240.12.19',
      vlan: 'VLAN-10-CORE',
      status: 'HEALTHY',
      clinicalCriticality: 'Tier 1 - Mission Critical',
      affected: false
    },
    {
      id: 'ast-rx-03',
      name: 'Pharmacy Dispensing API Gateway',
      type: 'Clinical Integration API',
      ip: '10.240.22.45',
      vlan: 'VLAN-20-CLINICAL',
      status: 'HEALTHY',
      clinicalCriticality: 'Tier 2 - Urgent Care',
      affected: false
    },
    {
      id: 'ast-iot-04',
      name: 'Alaris Infusion Pump Gateway',
      type: 'Medical IoT Gateway',
      ip: '10.240.30.104',
      vlan: 'VLAN-30-MED-IOT',
      status: 'HEALTHY',
      clinicalCriticality: 'Tier 1 - Patient Life Support',
      affected: false
    },
    {
      id: 'ast-pacs-05',
      name: 'Radiology PACS Archive',
      type: 'Medical Imaging Archive',
      ip: '10.240.25.77',
      vlan: 'VLAN-25-IMAGING',
      status: 'HEALTHY',
      clinicalCriticality: 'Tier 3 - Diagnostic',
      affected: false
    },
    {
      id: 'ast-icu-06',
      name: 'Philips IntelliVue ICU Monitor Hub',
      type: 'Biomedical Telemetry',
      ip: '10.240.30.120',
      vlan: 'VLAN-30-MED-IOT',
      status: 'HEALTHY',
      clinicalCriticality: 'Tier 1 - Patient Life Support',
      affected: false
    }
  ],

  SCENARIO_1: {
    id: 'scen-01',
    title: 'Credential Compromise → Medical Device Access',
    category: 'Targeted Healthcare Lateral Movement',
    target: 'Alaris Infusion Pump Gateway (VLAN-30-MED-IOT)',
    description: 'External brute force on remote nurse portal leads to account takeover of nurse_admin, privilege escalation on clinical workstation host-17, exfiltration queries to patient DB, narcotic API queries, and direct TCP bridge access to the Alaris Infusion Pump medical gateway.',
    steps: [
      {
        stepIndex: 1,
        stage: 'Initial Access',
        asset: 'Remote VPN / Nurse Portal',
        severity: 'LOW',
        cyberScore: 28,
        assetId: null,
        events: [
          { timestamp: '12:41:02', event: 'FAILED_LOGIN', actor: 'external_brute', source: '185.220.101.42', asset: 'vpn_gateway', severity: 'LOW', detail: 'Repeated authentication failures (17 attempts) targeting nurse_admin' },
          { timestamp: '12:41:08', event: 'FAILED_LOGIN', actor: 'external_brute', source: '185.220.101.42', asset: 'vpn_gateway', severity: 'LOW', detail: 'Distributed credential spray across external HTTPS gateway' }
        ]
      },
      {
        stepIndex: 2,
        stage: 'Credential Compromise',
        asset: 'nurse_admin Identity',
        severity: 'MEDIUM',
        cyberScore: 48,
        assetId: null,
        events: [
          { timestamp: '12:41:15', event: 'LOGIN_SUCCESS', actor: 'nurse_admin', source: '185.220.101.42', asset: 'auth_service', severity: 'MEDIUM', detail: 'Single successful auth from non-whitelisted foreign subnet without MFA' }
        ]
      },
      {
        stepIndex: 3,
        stage: 'Privilege Escalation',
        asset: 'Workstation host-17',
        severity: 'HIGH',
        cyberScore: 68,
        assetId: null,
        events: [
          { timestamp: '12:41:20', event: 'PRIV_ESCALATION', actor: 'nurse_admin', source: 'host-17 (10.240.12.55)', asset: 'host-17', severity: 'HIGH', detail: 'Process injection via SeDebugPrivilege token elevation on host-17' }
        ]
      },
      {
        stepIndex: 4,
        stage: 'Patient DB Access',
        asset: 'Patient Vitals DB',
        severity: 'HIGH',
        cyberScore: 78,
        assetId: 'ast-pdb-02',
        assetStatus: 'WARNING',
        events: [
          { timestamp: '12:41:32', event: 'DB_ACCESS', actor: 'nurse_admin', source: 'host-17 (10.240.12.55)', asset: 'ast-pdb-02', severity: 'HIGH', detail: 'Bulk SELECT on active ICU patient vitals and allergy records' }
        ]
      },
      {
        stepIndex: 5,
        stage: 'Medication Service',
        asset: 'Pharmacy API Gateway',
        severity: 'HIGH',
        cyberScore: 84,
        assetId: 'ast-rx-03',
        assetStatus: 'WARNING',
        events: [
          { timestamp: '12:41:45', event: 'API_ACCESS', actor: 'service_worker_tok', source: 'host-17 (10.240.12.55)', asset: 'ast-rx-03', severity: 'HIGH', detail: 'Unscheduled API queries against narcotic dispensing schedule' }
        ]
      },
      {
        stepIndex: 6,
        stage: 'Medical IoT Gateway',
        asset: 'Alaris Infusion Gateway',
        severity: 'CRITICAL',
        cyberScore: 91,
        assetId: 'ast-iot-04',
        assetStatus: 'CRITICAL',
        clinicalRisk: 'HIGH',
        patientSafety: 'POTENTIAL IMPACT',
        events: [
          { timestamp: '12:42:01', event: 'DEVICE_ACCESS', actor: 'service_worker_tok', source: 'host-17 (10.240.12.55)', asset: 'ast-iot-04', severity: 'CRITICAL', detail: 'Direct TCP socket opened across VLAN-30 to infusion pump gateway port 8443' }
        ]
      }
    ],
    analysis: {
      classification: 'CRITICAL',
      attack_type: 'Credential Compromise & Medical IoT Lateral Movement',
      confidence: 94,
      cyber_risk: 91,
      clinical_risk: 'HIGH',
      patient_safety: 'POTENTIAL IMPACT',
      affected_assets: [
        'Alaris Infusion Pump Gateway (VLAN-30)',
        'Pharmacy Dispensing API Gateway',
        'Patient Demographics & Vitals DB',
        'Clinical Workstation host-17'
      ],
      evidence: [
        '17 failed logins from external IP 185.220.101.42',
        'Compromise of privileged nurse_admin account',
        'Privilege escalation on clinical workstation host-17',
        'Lateral traverse from Core VLAN-10 to Medical IoT VLAN-30',
        'Unauthorized command bridge query to Alaris Infusion Gateway'
      ],
      clinical_impact: 'Potential clinical disruption. Medical IoT gateway bridge accessed on VLAN-30. Potential risk to intravenous medication telemetry synchronization across active ICU beds.',
      recommended_actions: [
        {
          id: 'act-01',
          order: '01',
          name: 'Revoke and disable compromised account',
          category: 'Identity Containment',
          target: 'nurse_admin',
          rationale: 'Terminate active session tokens and prevent further remote traversal from actor credentials.',
          status: 'Recommended'
        },
        {
          id: 'act-02',
          order: '02',
          name: 'Block external adversary IP at perimeter',
          category: 'Network Containment',
          target: '185.220.101.42',
          rationale: 'Drop all inbound ingress traffic at the border firewall across all VPN endpoints.',
          status: 'Recommended'
        },
        {
          id: 'act-03',
          order: '03',
          name: 'Isolate Medical-Device Gateway VLAN',
          category: 'Clinical-System Containment',
          target: 'VLAN-30-MED-IOT / 10.240.30.104',
          rationale: 'Segment infusion pump gateway into emergency quarantine VLAN to prevent remote command transmission.',
          status: 'Recommended'
        },
        {
          id: 'act-04',
          order: '04',
          name: 'Preserve authentication & memory telemetry',
          category: 'Forensic Preservation',
          target: 'host-17 & Auth Logs',
          rationale: 'Capture volatile RAM artifacts and snapshot system event logs for regulatory audit reporting.',
          status: 'Recommended'
        }
      ]
    }
  },

  SCENARIO_2: {
    id: 'scen-02',
    title: 'Healthcare Ransomware Pre-Encryption Staging',
    category: 'Targeted Extortion & Shadow Volume Tampering',
    target: 'Radiology PACS Archive & Billing Terminal',
    description: 'Adversary gains staging foothold via spear-phishing macro on billing workstation ws-09, deletes Volume Shadow Copies (VSS), and begins high-speed entropy encryption operations on PACS imaging files.',
    steps: [
      {
        stepIndex: 1,
        stage: 'Initial Infiltration',
        asset: 'Billing Terminal ws-09',
        severity: 'LOW',
        cyberScore: 32,
        assetId: null,
        events: [
          { timestamp: '03:14:10', event: 'PHISH_PAYLOAD_EXEC', actor: 'billing_clerk', source: 'ws-09', asset: 'ws-09', severity: 'LOW', detail: 'Execution of unsigned binary invoices_q3.scr via spear-phish attachment' }
        ]
      },
      {
        stepIndex: 2,
        stage: 'Defense Evasion',
        asset: 'Billing Terminal ws-09',
        severity: 'MEDIUM',
        cyberScore: 54,
        assetId: null,
        events: [
          { timestamp: '03:14:35', event: 'DEFENSE_EVASION', actor: 'SYSTEM', source: 'ws-09', asset: 'ws-09', severity: 'MEDIUM', detail: 'vssadmin delete shadows /all /quiet command executed' }
        ]
      },
      {
        stepIndex: 3,
        stage: 'Lateral Enumeration',
        asset: 'Radiology PACS Archive',
        severity: 'HIGH',
        cyberScore: 72,
        assetId: 'ast-pacs-05',
        assetStatus: 'WARNING',
        events: [
          { timestamp: '03:15:02', event: 'SHARE_ENUM', actor: 'SYSTEM', source: 'ws-09', asset: 'ast-pacs-05', severity: 'HIGH', detail: 'Network SMB scan targeting DICOM storage directories across VLAN-25' }
        ]
      },
      {
        stepIndex: 4,
        stage: 'High-Entropy Write',
        asset: 'Radiology PACS Archive',
        severity: 'CRITICAL',
        cyberScore: 88,
        assetId: 'ast-pacs-05',
        assetStatus: 'CRITICAL',
        clinicalRisk: 'HIGH',
        patientSafety: 'POTENTIAL IMPACT',
        events: [
          { timestamp: '03:15:30', event: 'RANSOM_ENTROPY_WRITE', actor: 'SYSTEM', source: 'ws-09', asset: 'ast-pacs-05', severity: 'CRITICAL', detail: 'Rapid file renaming (.medcrypt) and entropy > 7.95 detected on 240 patient DICOM files' }
        ]
      }
    ],
    analysis: {
      classification: 'CRITICAL',
      attack_type: 'Healthcare Ransomware Pre-Encryption Staging',
      confidence: 96,
      cyber_risk: 88,
      clinical_risk: 'HIGH',
      patient_safety: 'POTENTIAL IMPACT',
      affected_assets: [
        'Radiology PACS Archive (VLAN-25)',
        'Billing Terminal ws-09',
        'Epic EHR Core Database (Target candidate)'
      ],
      evidence: [
        'Unsigned executable spawned from billing workstation ws-09',
        'VSS shadow copy deletion executed silently',
        'SMB enumeration against DICOM clinical imaging repository',
        'Anomalous file encryption entropy (>7.95) on PACS storage volume'
      ],
      clinical_impact: 'Potential diagnostic disruption. Critical trauma and oncology imaging retrieval impacted. Potential delay in surgical planning if PACS archive becomes inaccessible.',
      recommended_actions: [
        {
          id: 'act-01',
          order: '01',
          name: 'Isolate patient imaging archive network segment',
          category: 'Clinical-System Containment',
          target: 'VLAN-25-IMAGING',
          rationale: 'Sever SMB and NFS connections to prevent ransomware spread to secondary backup arrays.',
          status: 'Recommended'
        },
        {
          id: 'act-02',
          order: '02',
          name: 'Quarantine infected endpoint ws-09',
          category: 'Endpoint Containment',
          target: 'ws-09 (10.240.50.91)',
          rationale: 'Isolate host NIC via EDR command to immediately halt active encryption threads.',
          status: 'Recommended'
        },
        {
          id: 'act-03',
          order: '03',
          name: 'Mount immutable read-only snapshot storage',
          category: 'Data Preservation',
          target: 'PACS Volume Snap-0314',
          rationale: 'Protect unencrypted historical diagnostic scans from corruption.',
          status: 'Recommended'
        }
      ]
    }
  }
};
