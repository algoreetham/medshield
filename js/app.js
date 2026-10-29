// MedShield AI - Cinematic Cyber War-Room Controller
// Fully Interactive Standalone Execution Matching User Visual Specification

(function() {
  'use strict';

  const { INITIAL_ASSETS, SCENARIO_1, SCENARIO_2 } = window.MedShieldData || {};

  /* ==========================================================================
     TACTICAL AUDIO SYNTHESIZER (Web Audio API - Zero External Dependencies)
     ========================================================================== */
  class SoundFXManager {
    constructor() {
      this.enabled = false;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    toggle() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playRadarPing() {
      if (!this.enabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }

    playAlertTone() {
      if (!this.enabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(480, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    }

    playContainmentChord() {
      if (!this.enabled || !this.ctx) return;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + (idx * 0.05));
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + (idx * 0.05));
        osc.stop(this.ctx.currentTime + 0.6);
      });
    }
  }

  /* ==========================================================================
     AI CORRELATION & ATTRIBUTION MANAGER (Sections 17, 41–44)
     ========================================================================== */
  class AIEngineManager {
    constructor() {
      this.currentProvider = 'gemini';
      this.apiKey = localStorage.getItem('medshield_gemini_key') || '';
    }

    setProvider(provider) {
      this.currentProvider = provider;
      this.updateProviderBadge();
    }

    setApiKey(key) {
      this.apiKey = key.trim();
      if (this.apiKey) {
        localStorage.setItem('medshield_gemini_key', this.apiKey);
      } else {
        localStorage.removeItem('medshield_gemini_key');
      }
      this.updateProviderBadge();
    }

    updateProviderBadge() {
      const select = document.getElementById('ai-provider-select');
      const privacyCue = document.getElementById('ai-privacy-cue');
      if (select) select.value = this.currentProvider;

      if (privacyCue) {
        privacyCue.style.display = this.currentProvider === 'gemma' ? 'inline-block' : 'none';
      }
    }

    renderAnalyzingState() {
      const tag = document.getElementById('hud-ai-model-tag');
      if (tag) {
        tag.textContent = this.currentProvider === 'gemma' ? 
          'Gemma 4 12B [Correlating...]' : 'Gemini 1.5 Flash [Correlating...]';
      }

      const reasoning = document.getElementById('hud-clinical-reasoning');
      if (reasoning) {
        reasoning.innerHTML = '<em>Analyzing multi-vector telemetry across Core VLAN-10 and Medical IoT VLAN-30...</em>';
      }
    }

    async analyze(scenario, eventsHistory = []) {
      if (this.currentProvider === 'gemini' && this.apiKey) {
        try {
          const prompt = `You are MedShield AI, an advanced healthcare cybersecurity command-center AI engine.
Analyze the following healthcare cybersecurity telemetry events.
Follow strict healthcare context: understand clinical risk, patient safety impact, and affected medical devices.
Do NOT claim confirmed patient harm if only cyber telemetry is available. Use restrained clinical phrasing such as "Potential clinical disruption" or "Medical-device access detected".

Telemetry Events:
${JSON.stringify(eventsHistory.length ? eventsHistory : scenario.steps.flatMap(s => s.events), null, 2)}

Respond ONLY with valid JSON conforming exactly to this structure:
{
  "classification": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "attack_type": "Concise attack description",
  "confidence": 94,
  "cyber_risk": 91,
  "clinical_risk": "HIGH" | "MEDIUM" | "LOW",
  "patient_safety": "POTENTIAL IMPACT" | "MONITORING" | "NO IMPACT",
  "affected_assets": ["Asset 1", "Asset 2"],
  "evidence": ["Evidence 1", "Evidence 2", "Evidence 3"],
  "clinical_impact": "Concise statement on clinical/patient safety exposure.",
  "recommended_actions": [
    { "order": "01", "name": "Action name", "category": "Identity Containment | Network Containment | Clinical-System Containment", "target": "Target", "rationale": "Reasoning" }
  ]
}`;

          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });

          const data = await res.json();
          if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const raw = data.candidates[0].content.parts[0].text;
            const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            return {
              provider: 'gemini',
              attribution: 'Gemini 1.5 Flash (Live API)',
              analysis: parsed
            };
          }
        } catch (err) {
          console.warn('Direct Gemini API call failed, falling back to Local Gemma:', err);
        }
      }

      if (this.currentProvider === 'gemma') {
        return {
          provider: 'gemma',
          attribution: 'Gemma 4 12B Instruct [Local]',
          analysis: scenario.analysis
        };
      } else if (this.currentProvider === 'gemini') {
        return {
          provider: 'gemini',
          attribution: 'Gemini 1.5 Flash [Deterministic Evaluator]',
          analysis: scenario.analysis
        };
      } else {
        return {
          provider: 'fallback',
          attribution: 'Deterministic Rules Engine',
          analysis: scenario.analysis
        };
      }
    }

    renderAnalysis(analysis, attributionText) {
      const tag = document.getElementById('hud-ai-model-tag');
      if (tag) tag.textContent = attributionText || 'Gemini 1.5 Flash';

      const title = document.getElementById('hud-classification-title');
      if (title) title.textContent = `${analysis.classification}: ${analysis.attack_type}`;

      const chips = document.getElementById('hud-evidence-chips');
      if (chips) {
        chips.innerHTML = '';
        (analysis.evidence || []).forEach(ev => {
          const div = document.createElement('div');
          div.style.fontSize = '10.5px';
          div.style.fontFamily = 'var(--font-mono)';
          div.style.color = '#cbd5e1';
          div.textContent = `› ${ev}`;
          chips.appendChild(div);
        });
      }

      const reasoning = document.getElementById('hud-clinical-reasoning');
      if (reasoning) reasoning.textContent = analysis.clinical_impact;
    }

    reset() {
      const tag = document.getElementById('hud-ai-model-tag');
      if (tag) tag.textContent = 'Gemini 1.5 Flash';

      const title = document.getElementById('hud-classification-title');
      if (title) title.textContent = 'Zero Active Attack Traversal Detected';

      const chips = document.getElementById('hud-evidence-chips');
      if (chips) {
        chips.innerHTML = `
          <div style="font-size: 10.5px; font-family: var(--font-mono); color: var(--text-dim);">› All 142 medical VLAN devices authenticated</div>
          <div style="font-size: 10.5px; font-family: var(--font-mono); color: var(--text-dim);">› No lateral movement across VLAN-30 bridge</div>
        `;
      }

      const reasoning = document.getElementById('hud-clinical-reasoning');
      if (reasoning) {
        reasoning.textContent = 'No clinical risk detected. Normal inpatient and outpatient telemetry streaming across hospital infrastructure.';
      }
    }
  }

  /* ==========================================================================
     SIMULATION ENGINE (Adversary Attack Sequencer)
     ========================================================================== */
  class SimulationEngine {
    constructor(options = {}) {
      this.currentScenario = SCENARIO_1;
      this.speedMultiplier = 1;
      this.isRunning = false;
      this.currentStep = 0;
      this.onStepCallback = options.onStep || (() => {});
      this.onCompleteCallback = options.onComplete || (() => {});
      this.onEventCallback = options.onEvent || (() => {});
    }

    setScenario(scenarioId) {
      if (this.isRunning) this.stop();
      this.currentScenario = scenarioId === 'scen-02' ? SCENARIO_2 : SCENARIO_1;
      this.currentStep = 0;
    }

    setSpeed(speed) {
      this.speedMultiplier = speed;
    }

    async run(startCallback) {
      if (this.isRunning) return;
      this.isRunning = true;
      this.currentStep = 0;
      if (startCallback) startCallback(this.currentScenario);

      const steps = this.currentScenario.steps;

      for (let i = 0; i < steps.length; i++) {
        if (!this.isRunning) break;
        this.currentStep = i;
        const step = steps[i];

        for (const ev of step.events) {
          this.onEventCallback(ev);
        }

        this.onStepCallback(step, i, steps);

        const delayMs = 1500 / this.speedMultiplier;
        await new Promise(r => setTimeout(r, delayMs));
      }

      if (this.isRunning) {
        this.isRunning = false;
        this.onCompleteCallback(this.currentScenario);
      }
    }

    stop() {
      this.isRunning = false;
    }
  }

  /* ==========================================================================
     MASTER WAR-ROOM APP COORDINATOR
     ========================================================================== */
  class WarRoomApp {
    constructor() {
      this.assets = JSON.parse(JSON.stringify(INITIAL_ASSETS));
      this.eventsHistory = [];
      this.containmentSteps = [];
      this.isIncidentActive = false;

      this.aiEngine = new AIEngineManager();
      this.soundFX = new SoundFXManager();
      this.simulation = new SimulationEngine({
        onStep: (step, index, allSteps) => this.handleSimulationStep(step, index, allSteps),
        onComplete: (scenario) => this.handleSimulationComplete(scenario),
        onEvent: (event) => this.appendEventLog(event)
      });

      this.init();
    }

    init() {
      this.startClock();
      this.bindEvents();
      this.aiEngine.updateProviderBadge();
      this.renderPods();
    }

    startClock() {
      const clockEl = document.getElementById('hud-clock');
      const update = () => {
        if (clockEl) {
          const now = new Date();
          clockEl.textContent = now.toUTCString().split(' ')[4] + ' UTC';
        }
      };
      update();
      setInterval(update, 1000);
    }

    bindEvents() {
      // AI Engine selector
      const select = document.getElementById('ai-provider-select');
      if (select) {
        select.addEventListener('change', (e) => {
          this.aiEngine.setProvider(e.target.value);
        });
      }

      // Audio Toggle Trigger
      const btnAudio = document.getElementById('btn-toggle-audio');
      if (btnAudio) {
        btnAudio.addEventListener('click', () => {
          const isEnabled = this.soundFX.toggle();
          btnAudio.textContent = isEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
          btnAudio.className = isEnabled ? 'hud-btn hud-btn-primary' : 'hud-btn hud-btn-ghost';
          if (isEnabled) this.soundFX.playRadarPing();
          this.showToast(isEnabled ? 'Tactical audio telemetry enabled.' : 'Audio muted.');
        });
      }

      // Export Report Trigger
      const btnExport = document.getElementById('btn-export-report');
      if (btnExport) {
        btnExport.addEventListener('click', () => this.exportIncidentReport());
      }

      // API Key Config Trigger
      const btnApiKey = document.getElementById('btn-config-api-key');
      if (btnApiKey) {
        btnApiKey.addEventListener('click', () => this.openApiKeyModal());
      }

      // Simulation Trigger
      const btnSimulate = document.getElementById('btn-simulate-attack');
      if (btnSimulate) {
        btnSimulate.addEventListener('click', () => this.startSimulation());
      }

      // Reset Button
      const btnReset = document.getElementById('btn-reset-env');
      if (btnReset) {
        btnReset.addEventListener('click', () => this.resetDashboard());
      }

      // Containment Modal
      const btnContain = document.getElementById('btn-contain-incident');
      if (btnContain) {
        btnContain.addEventListener('click', () => this.openContainmentModal());
      }

      const btnCloseModal = document.getElementById('btn-close-modal');
      if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => this.closeContainmentModal());
      }

      const btnCancelModal = document.getElementById('btn-cancel-containment');
      if (btnCancelModal) {
        btnCancelModal.addEventListener('click', () => this.closeContainmentModal());
      }

      const btnConfirmContainment = document.getElementById('btn-confirm-containment');
      if (btnConfirmContainment) {
        btnConfirmContainment.addEventListener('click', () => this.executeContainment());
      }

      // API Key Modal Events
      const btnSaveKey = document.getElementById('btn-save-api-key');
      if (btnSaveKey) {
        btnSaveKey.addEventListener('click', () => {
          const input = document.getElementById('input-gemini-key');
          if (input) {
            this.aiEngine.setApiKey(input.value);
            this.closeApiKeyModal();
            this.showToast(input.value ? 'Google Gemini API key saved.' : 'Using local simulation mode.');
          }
        });
      }

      const btnCloseKeyModal = document.getElementById('btn-close-key-modal');
      if (btnCloseKeyModal) {
        btnCloseKeyModal.addEventListener('click', () => this.closeApiKeyModal());
      }

      // MITRE Matrix Modal Events
      const btnMitre = document.getElementById('btn-mitre-matrix');
      const mitreModal = document.getElementById('mitre-modal');
      if (btnMitre && mitreModal) {
        btnMitre.addEventListener('click', () => mitreModal.classList.add('open'));
      }
      const btnCloseMitre = document.getElementById('btn-close-mitre-modal');
      if (btnCloseMitre && mitreModal) {
        btnCloseMitre.addEventListener('click', () => mitreModal.classList.remove('open'));
      }
      const btnCloseMitreFooter = document.getElementById('btn-close-mitre-footer');
      if (btnCloseMitreFooter && mitreModal) {
        btnCloseMitreFooter.addEventListener('click', () => mitreModal.classList.remove('open'));
      }

      // Scanlines Toggle
      const btnScanlines = document.getElementById('btn-toggle-scanlines');
      const shell = document.querySelector('.warroom-shell');
      if (btnScanlines && shell) {
        btnScanlines.addEventListener('click', () => {
          const active = shell.classList.toggle('scanlines-active');
          btnScanlines.textContent = active ? 'SCANLINES: ON' : 'SCANLINES: OFF';
          btnScanlines.className = active ? 'hud-btn hud-btn-primary' : 'hud-btn hud-btn-ghost';
        });
      }

      // Asset Inspector Modal Events
      const inspModal = document.getElementById('asset-inspector-modal');
      const btnCloseInsp = document.getElementById('btn-close-inspector');
      if (btnCloseInsp && inspModal) {
        btnCloseInsp.addEventListener('click', () => inspModal.classList.remove('open'));
      }
      const btnCloseInspFooter = document.getElementById('btn-close-insp-footer');
      if (btnCloseInspFooter && inspModal) {
        btnCloseInspFooter.addEventListener('click', () => inspModal.classList.remove('open'));
      }
    }

    startSimulation() {
      if (this.simulation.isRunning) return;
      this.isIncidentActive = true;

      const simBtn = document.getElementById('btn-simulate-attack');
      if (simBtn) {
        simBtn.disabled = true;
        simBtn.textContent = 'Simulating...';
      }

      // Activate Animated Attack Laser Trajectories on Map
      const traj = document.getElementById('attack-trajectories');
      if (traj) traj.style.display = 'inline';

      // Pulse central reticle
      const reticle = document.getElementById('svg-central-reticle');
      if (reticle) {
        reticle.setAttribute('stroke', '#ff1744');
        reticle.setAttribute('stroke-width', '4');
      }

      this.aiEngine.renderAnalyzingState();

      this.simulation.run(() => {
        document.getElementById('threat-state-pill').className = 'pod-status-badge status-critical';
        document.getElementById('threat-state-pill').textContent = 'CRITICAL ATTACK';
      });
    }

    handleSimulationStep(step, index, allSteps) {
      if (step.cyberScore > 50) {
        this.soundFX.playAlertTone();
      } else {
        this.soundFX.playRadarPing();
      }

      // 1. Update Gauge 1: Top Arc Meter
      const arcPath = document.getElementById('arc-threat-path');
      const needle = document.getElementById('arc-needle');
      const cvssLabel = document.getElementById('label-cvss-score');

      const maxOffset = 240;
      const minOffset = 25;
      const progress = step.cyberScore / 100;
      const newOffset = maxOffset - (progress * (maxOffset - minOffset));

      if (arcPath) {
        arcPath.style.strokeDashoffset = newOffset;
        arcPath.style.stroke = step.cyberScore > 75 ? '#ff1744' : step.cyberScore > 40 ? '#ffab00' : '#00e676';
      }

      if (needle) {
        // Needle angles from -60deg (low) to +60deg (high)
        const angle = -60 + (progress * 120);
        const rad = (angle * Math.PI) / 180;
        const x2 = 110 + (60 * Math.sin(rad));
        const y2 = 65 - (60 * Math.cos(rad));
        needle.setAttribute('x2', x2);
        needle.setAttribute('y2', y2);
      }

      if (cvssLabel) {
        cvssLabel.textContent = `CVSS ${(step.cyberScore / 10).toFixed(1)} ${step.severity}`;
        cvssLabel.className = step.severity === 'CRITICAL' ? 'text-red font-mono' : 'text-amber font-mono';
      }

      // 2. Update Gauge 2: Cyber Risk Circle Ring
      const cyberRing = document.getElementById('gauge-cyber-ring');
      const cyberVal = document.getElementById('gauge-val-cyber');
      if (cyberRing) {
        // circumference = 238.7
        const ringOffset = 238.7 - (progress * 215);
        cyberRing.style.strokeDashoffset = ringOffset;
      }
      if (cyberVal) cyberVal.textContent = step.cyberScore;

      // 3. Update Gauge 3: Clinical Risk Circle Ring
      if (step.clinicalRisk) {
        const clinRing = document.getElementById('gauge-clinical-ring');
        const clinVal = document.getElementById('gauge-val-clinical');
        if (clinRing) {
          clinRing.style.stroke = '#ff1744';
          clinRing.style.strokeDashoffset = 35;
        }
        if (clinVal) {
          clinVal.textContent = 'HIGH';
          clinVal.style.color = 'var(--glow-red)';
        }

        const impactRating = document.getElementById('hud-impact-rating');
        if (impactRating) {
          impactRating.textContent = 'HIGH (DISRUPTION POTENTIAL)';
          impactRating.style.color = 'var(--glow-red)';
        }
      }

      // 4. Update Threat Tracker Bar
      const trackerFill = document.getElementById('hud-threat-tracker-fill');
      if (trackerFill) {
        trackerFill.style.width = `${step.cyberScore}%`;
        trackerFill.style.background = step.cyberScore > 75 ? 'var(--glow-red)' : 'var(--glow-amber)';
      }

      // 5. Update Target Label
      const targetName = document.getElementById('hud-target-name');
      if (targetName) targetName.textContent = step.asset;

      // 6. Update Bottom Radar Pods
      if (step.assetId) {
        const assetIndex = this.assets.findIndex(a => a.id === step.assetId);
        if (assetIndex !== -1) {
          this.assets[assetIndex].status = step.assetStatus || 'WARNING';
          this.updateSinglePod(assetIndex, step.assetStatus || 'WARNING');
        }
      }
    }

    async handleSimulationComplete(scenario) {
      const simBtn = document.getElementById('btn-simulate-attack');
      if (simBtn) {
        simBtn.disabled = false;
        simBtn.textContent = 'Run Simulation';
      }

      // Run AI correlation
      const result = await this.aiEngine.analyze(scenario, this.eventsHistory);
      this.aiEngine.renderAnalysis(result.analysis, result.attribution);
      this.containmentSteps = result.analysis.recommended_actions;

      // Enable Authorize Containment Action
      const btnContain = document.getElementById('btn-contain-incident');
      if (btnContain) {
        btnContain.removeAttribute('disabled');
      }
    }

    appendEventLog(event) {
      this.eventsHistory.unshift(event);
      const container = document.getElementById('stream-rows-container');
      if (!container) return;

      const count = document.getElementById('stream-count-tag');
      if (count) count.textContent = `${this.eventsHistory.length} events logged`;

      // Clear initial placeholder
      if (container.querySelector('div[style*="padding: 10px"]')) {
        container.innerHTML = '';
      }

      const row = document.createElement('div');
      const isCrit = event.severity === 'CRITICAL';
      const isHigh = event.severity === 'HIGH';
      row.className = `stream-row ${isCrit ? 'crit' : isHigh ? 'warn' : ''}`;
      row.innerHTML = `
        <span style="color: var(--text-dim);">${event.timestamp}</span>
        <span style="color: ${isCrit ? 'var(--glow-red)' : isHigh ? 'var(--glow-amber)' : 'var(--glow-cyan)'}; font-weight: bold;">${event.event}</span>
        <span style="color: var(--text-main);">${event.actor}</span>
        <span style="color: var(--text-dim);">${event.source}</span>
        <span style="color: #ffffff;">${event.asset}</span>
        <span style="font-weight: bold; color: ${isCrit ? 'var(--glow-red)' : 'var(--text-dim)'};">${event.severity}</span>
      `;

      container.insertBefore(row, container.firstChild);
    }

    renderPods() {
      this.assets.forEach((asset, idx) => {
        this.updateSinglePod(idx, asset.status);
        const pod = document.getElementById(`pod-asset-${idx}`);
        if (pod && !pod.dataset.bound) {
          pod.dataset.bound = 'true';
          pod.style.cursor = 'pointer';
          pod.title = 'Click to inspect asset telemetry and clinical profile';
          pod.addEventListener('click', () => this.openAssetInspector(idx));
        }
      });
    }

    openAssetInspector(idx) {
      const asset = this.assets[idx];
      if (!asset) return;
      const modal = document.getElementById('asset-inspector-modal');
      if (!modal) return;

      const nameEl = document.getElementById('inspector-asset-name');
      if (nameEl) nameEl.textContent = `${asset.name} — Asset Inspector`;
      const ipEl = document.getElementById('insp-ip');
      if (ipEl) ipEl.textContent = asset.ip || '10.240.30.104';
      const vlanEl = document.getElementById('insp-vlan');
      if (vlanEl) vlanEl.textContent = asset.vlan || 'VLAN-30-MED-IOT';
      const macEl = document.getElementById('insp-mac');
      if (macEl) macEl.textContent = asset.mac || `00:1A:C2:7B:${idx}A:4${idx}`;
      const classEl = document.getElementById('insp-class');
      if (classEl) classEl.textContent = asset.tier || 'FDA Class II Biomedical';
      const pktEl = document.getElementById('insp-packets');
      if (pktEl) pktEl.textContent = `${(1200 + (idx * 280)).toLocaleString()} pkts/sec`;

      const stEl = document.getElementById('insp-status');
      if (stEl) {
        stEl.textContent = asset.status;
        stEl.className = `pod-status-badge ${asset.status === 'CRITICAL' ? 'status-critical' : asset.status === 'WARNING' ? 'status-warning' : 'status-normal'}`;
      }

      const descEl = document.getElementById('insp-desc');
      if (descEl) descEl.textContent = asset.description || `Core hospital infrastructure node supporting ${asset.vlan} critical operations.`;

      const btnQuar = document.getElementById('btn-quarantine-single-asset');
      if (btnQuar) {
        btnQuar.onclick = () => {
          asset.status = 'QUARANTINED';
          this.updateSinglePod(idx, 'NORMAL');
          modal.classList.remove('open');
          this.showToast(`Simulated quarantine policy applied to ${asset.name}.`);
        };
      }

      modal.classList.add('open');
    }

    updateSinglePod(idx, status) {
      const pod = document.getElementById(`pod-asset-${idx}`);
      const icon = document.getElementById(`pod-icon-${idx}`);
      const statusBadge = document.getElementById(`pod-status-${idx}`);

      if (!pod || !statusBadge) return;

      statusBadge.textContent = status;

      if (status === 'CRITICAL') {
        pod.className = 'radar-pod alert-critical';
        if (icon) icon.className = 'pod-icon-circle glow-red';
        statusBadge.className = 'pod-status-badge status-critical';
      } else if (status === 'WARNING') {
        pod.className = 'radar-pod';
        if (icon) icon.className = 'pod-icon-circle glow-amber';
        statusBadge.className = 'pod-status-badge status-warning';
      } else {
        pod.className = 'radar-pod';
        if (icon) icon.className = 'pod-icon-circle glow-green';
        statusBadge.className = 'pod-status-badge status-normal';
      }
    }

    openContainmentModal() {
      const modal = document.getElementById('containment-modal');
      if (!modal) return;

      const list = document.getElementById('modal-actions-summary');
      if (list) {
        list.innerHTML = '';
        (this.containmentSteps || SCENARIO_1.analysis.recommended_actions).forEach(act => {
          const div = document.createElement('div');
          div.style.fontSize = '11.5px';
          div.style.fontFamily = 'var(--font-mono)';
          div.innerHTML = `
            <span style="color: var(--glow-red); font-weight: bold;">[${act.order}]</span>
            <span style="color: #ffffff;">${act.name}</span>
            <span style="color: var(--text-dim);">(${act.category})</span>
          `;
          list.appendChild(div);
        });
      }

      modal.classList.add('open');
    }

    closeContainmentModal() {
      const modal = document.getElementById('containment-modal');
      if (modal) modal.classList.remove('open');
    }

    openApiKeyModal() {
      const modal = document.getElementById('api-key-modal');
      const input = document.getElementById('input-gemini-key');
      if (input) input.value = this.aiEngine.apiKey;
      if (modal) modal.classList.add('open');
    }

    closeApiKeyModal() {
      const modal = document.getElementById('api-key-modal');
      if (modal) modal.classList.remove('open');
    }

    async executeContainment() {
      this.closeContainmentModal();

      const btnContain = document.getElementById('btn-contain-incident');
      if (btnContain) {
        btnContain.textContent = 'EXECUTING...';
        btnContain.disabled = true;
      }

      // Hide attack laser lines
      const traj = document.getElementById('attack-trajectories');
      if (traj) traj.style.display = 'none';

      this.soundFX.playContainmentChord();

      // Restore all 6 asset pods to normal
      this.assets.forEach((a, idx) => {
        a.status = 'HEALTHY';
        this.updateSinglePod(idx, 'HEALTHY');
      });

      // Normalize gauges back to green baseline
      const arcPath = document.getElementById('arc-threat-path');
      if (arcPath) {
        arcPath.style.strokeDashoffset = 240;
        arcPath.style.stroke = '#00e676';
      }

      const needle = document.getElementById('arc-needle');
      if (needle) {
        needle.setAttribute('x2', '50');
        needle.setAttribute('y2', '40');
      }

      const cvssLabel = document.getElementById('label-cvss-score');
      if (cvssLabel) {
        cvssLabel.textContent = 'CVSS 1.4 BASE';
        cvssLabel.className = 'text-emerald font-mono';
      }

      const cyberRing = document.getElementById('gauge-cyber-ring');
      if (cyberRing) cyberRing.style.strokeDashoffset = 210;

      const cyberVal = document.getElementById('gauge-val-cyber');
      if (cyberVal) cyberVal.textContent = '14';

      const clinRing = document.getElementById('gauge-clinical-ring');
      if (clinRing) {
        clinRing.style.stroke = '#00e5ff';
        clinRing.style.strokeDashoffset = 210;
      }

      const clinVal = document.getElementById('gauge-val-clinical');
      if (clinVal) {
        clinVal.textContent = 'LOW';
        clinVal.style.color = 'var(--glow-cyan)';
      }

      const trackerFill = document.getElementById('hud-threat-tracker-fill');
      if (trackerFill) {
        trackerFill.style.width = '14%';
        trackerFill.style.background = 'var(--glow-emerald)';
      }

      const threatPill = document.getElementById('threat-state-pill');
      if (threatPill) {
        threatPill.className = 'pod-status-badge status-normal';
        threatPill.textContent = 'CONTAINED';
      }

      const impactRating = document.getElementById('hud-impact-rating');
      if (impactRating) {
        impactRating.textContent = 'LOW (QUARANTINED)';
        impactRating.style.color = 'var(--glow-emerald)';
      }

      if (btnContain) {
        btnContain.textContent = 'CONTAINMENT COMPLETE';
      }

      this.showToast('VLAN-30 Quarantined. Medical device bridges secured.');
    }

    resetDashboard() {
      this.simulation.stop();
      this.isIncidentActive = false;
      this.eventsHistory = [];
      this.assets = JSON.parse(JSON.stringify(INITIAL_ASSETS));

      const traj = document.getElementById('attack-trajectories');
      if (traj) traj.style.display = 'none';

      this.renderPods();
      this.aiEngine.reset();

      // Reset gauges
      const arcPath = document.getElementById('arc-threat-path');
      if (arcPath) {
        arcPath.style.strokeDashoffset = 240;
        arcPath.style.stroke = '#00e676';
      }

      const needle = document.getElementById('arc-needle');
      if (needle) {
        needle.setAttribute('x2', '50');
        needle.setAttribute('y2', '40');
      }

      const cvssLabel = document.getElementById('label-cvss-score');
      if (cvssLabel) {
        cvssLabel.textContent = 'CVSS 1.2 BASE';
        cvssLabel.className = 'text-emerald font-mono';
      }

      const cyberRing = document.getElementById('gauge-cyber-ring');
      if (cyberRing) cyberRing.style.strokeDashoffset = 210;

      const cyberVal = document.getElementById('gauge-val-cyber');
      if (cyberVal) cyberVal.textContent = '12';

      const clinRing = document.getElementById('gauge-clinical-ring');
      if (clinRing) {
        clinRing.style.stroke = '#00e5ff';
        clinRing.style.strokeDashoffset = 210;
      }

      const clinVal = document.getElementById('gauge-val-clinical');
      if (clinVal) {
        clinVal.textContent = 'LOW';
        clinVal.style.color = 'var(--glow-cyan)';
      }

      const trackerFill = document.getElementById('hud-threat-tracker-fill');
      if (trackerFill) {
        trackerFill.style.width = '12%';
        trackerFill.style.background = 'var(--glow-emerald)';
      }

      const threatPill = document.getElementById('threat-state-pill');
      if (threatPill) {
        threatPill.className = 'pod-status-badge status-normal';
        threatPill.textContent = 'NOMINAL';
      }

      const stream = document.getElementById('stream-rows-container');
      if (stream) {
        stream.innerHTML = `
          <div style="padding: 10px; text-align: center; color: var(--text-dim);">
            Telemetry stream active. Click <strong>"Run Simulation"</strong> to ingest adversary attack vectors.
          </div>
        `;
      }

      const count = document.getElementById('stream-count-tag');
      if (count) count.textContent = '0 events';

      const btnContain = document.getElementById('btn-contain-incident');
      if (btnContain) {
        btnContain.textContent = 'AUTHORIZE CONTAINMENT';
        btnContain.disabled = true;
      }

      const btnSim = document.getElementById('btn-simulate-attack');
      if (btnSim) {
        btnSim.disabled = false;
        btnSim.textContent = 'RUN SIMULATION';
      }

      this.showToast('War-Room baseline telemetry reset.');
    }

    exportIncidentReport() {
      const report = {
        metadata: {
          system: 'MedShield AI Healthcare Cybersecurity SOC',
          report_id: `FORENSIC-${Date.now()}`,
          generated_at: new Date().toISOString(),
          environment: 'St. Jude Regional Medical Center (VLAN-142)'
        },
        incident_summary: {
          active_status: this.isIncidentActive ? 'CRITICAL_TRAVERSAL_DETECTED' : 'BASELINE_NORMAL',
          cyber_threat_score: document.getElementById('gauge-val-cyber')?.textContent || '12',
          clinical_risk_level: document.getElementById('gauge-val-clinical')?.textContent || 'LOW',
          target_asset: document.getElementById('hud-target-name')?.textContent || 'Hospital Core VLAN',
          mitre_classification: document.getElementById('hud-classification-title')?.textContent || 'Zero Attack Traversal'
        },
        assets_status: this.assets,
        telemetry_events: this.eventsHistory,
        containment_plan: this.containmentSteps
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `medshield-incident-report-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      this.showToast('Forensic telemetry report exported successfully.');
    }

    showToast(message) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.2s ease';
        setTimeout(() => toast.remove(), 200);
      }, 3000);
    }
  }

  // Boot on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    window.warroom = new WarRoomApp();
  });
})();
