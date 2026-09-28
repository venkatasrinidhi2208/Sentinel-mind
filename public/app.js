/**
 * SentinelMind Frontend Client Application
 * Developed by: Shreyas (Frontend & UX)
 */

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '';
  let hindsightMemoryEnabled = true;

  // DOM Elements
  const refreshBtn = document.getElementById('refreshBtn');
  const serviceGrid = document.getElementById('serviceGrid');
  const incidentWorkspace = document.getElementById('incidentWorkspace');
  const activeIncidentCount = document.getElementById('activeIncidentCount');
  const memoryList = document.getElementById('memoryList');
  const modeToggle = document.getElementById('modeToggle');
  const modeBanner = document.getElementById('modeBanner');
  const modeDesc = document.getElementById('modeDesc');
  const globalHealthDot = document.getElementById('globalHealthDot');
  const globalHealthText = document.getElementById('globalHealthText');

  // Mode Switcher Toggle
  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      hindsightMemoryEnabled = e.target.checked;
      if (hindsightMemoryEnabled) {
        modeBanner.style.background = 'rgba(139, 92, 246, 0.1)';
        modeBanner.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        modeDesc.textContent = 'Agent uses Hindsight memory bank to retrieve exact root causes & verified runbooks.';
      } else {
        modeBanner.style.background = 'rgba(239, 68, 68, 0.1)';
        modeBanner.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        modeDesc.textContent = 'MODE: Stateless LLM (No Memory). Agent gives generic boilerplate advice without context.';
      }
      fetchIncidents();
    });
  }

  // Chaos Trigger Buttons
  document.querySelectorAll('.chaos-card').forEach((card) => {
    card.addEventListener('click', async () => {
      const scenario = card.getAttribute('data-scenario');
      try {
        const res = await fetch(`${API_BASE}/api/chaos/trigger`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenario }),
        });
        const data = await res.json();
        if (res.ok) {
          fetchServices();
          fetchIncidents();
        } else {
          alert(`Failed to trigger chaos: ${data.error}`);
        }
      } catch (err) {
        console.error('Error triggering chaos:', err);
      }
    });
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchServices();
      fetchIncidents();
      fetchMemories();
    });
  }

  // Fetch Microservice Health
  async function fetchServices() {
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const data = await res.json();
      renderServices(data.services || []);
      updateGlobalStatus(data.overallStatus);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  }

  function updateGlobalStatus(status) {
    if (status === 'healthy') {
      globalHealthDot.className = 'pulse-dot green';
      globalHealthText.textContent = 'SYSTEM OPERATIONAL';
    } else {
      globalHealthDot.className = 'pulse-dot red';
      globalHealthText.textContent = 'OUTAGE DETECTED';
    }
  }

  function renderServices(services) {
    if (!serviceGrid) return;
    serviceGrid.innerHTML = services
      .map(
        (s) => `
      <div class="service-card shadow-card">
        <div class="service-card-header">
          <span class="service-name">${s.name}</span>
          <span class="badge ${s.status === 'healthy' ? 'badge-green' : 'badge-red'}">${s.status.toUpperCase()}</span>
        </div>
        <div class="service-metrics">
          <div>Health: ${s.healthScore}%</div>
          <div>Uptime: ${s.uptimePercentage}%</div>
          <div>Latency: ${s.latencyMs}ms</div>
          <div>RAM: ${s.memoryUsageMb}MB</div>
        </div>
      </div>
    `
      )
      .join('');
  }

  // Fetch Incidents
  async function fetchIncidents() {
    try {
      const res = await fetch(`${API_BASE}/api/incidents`);
      const data = await res.json();
      const incidents = data.incidents || [];
      renderIncidents(incidents);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    }
  }

  function renderIncidents(incidents) {
    if (!incidentWorkspace) return;
    activeIncidentCount.textContent = `${incidents.filter((i) => i.state !== 'RESOLVED').length} Active`;

    if (incidents.length === 0) {
      incidentWorkspace.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <h4>No Active Incidents</h4>
          <p>All microservices operating within nominal parameters.</p>
        </div>
      `;
      return;
    }

    const active = incidents[0]; // Display most recent incident
    const isResolved = active.state === 'RESOLVED';

    let actionHTML = '';
    if (!isResolved && active.suggestedActions && active.suggestedActions.length > 0) {
      actionHTML = active.suggestedActions
        .map(
          (act) => `
        <div class="remediation-box" style="margin-top:16px; background:#0f172a; padding:12px; border-radius:8px; border:1px solid #334155;">
          <h4 style="font-size:13px; color:#60a5fa;">💡 Suggested Remediation Action (${act.riskLevel} RISK)</h4>
          <p style="font-size:12px; color:#cbd5e1; margin:4px 0;">${act.description}</p>
          <div style="font-family:var(--font-mono); font-size:11px; background:#020617; padding:6px; border-radius:4px; color:#34d399; margin-bottom:8px;">
            $ ${act.command}
          </div>
          <button class="btn btn-success btn-execute-remediation" data-incident-id="${active.id}" data-action-id="${act.id}">
            ⚡ Execute Automated Remediation
          </button>
        </div>
      `
        )
        .join('');
    } else if (isResolved) {
      actionHTML = `
        <div style="margin-top:12px; padding:10px; background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; color:#34d399; font-size:12px;">
          ✅ ${active.resolutionSummary || 'Incident Resolved Successfully'}
        </div>
      `;
    }

    // Standard vs Hindsight content display
    let memoryNotice = '';
    if (!hindsightMemoryEnabled && !isResolved) {
      memoryNotice = `
        <div style="margin-top:12px; padding:10px; background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; color:#f87171; font-size:12px;">
          ⚠️ <strong>STATELESS LLM OUTPUT (No Hindsight Memory):</strong><br>
          "An error was detected in the microservice logs. Please inspect server memory using top or free, check your configuration files, and consider manually restarting your application container."
        </div>
      `;
    }

    incidentWorkspace.innerHTML = `
      <div class="incident-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h4 style="font-size:15px; color:#f87171;">${active.title}</h4>
          <span class="badge ${isResolved ? 'badge-green' : 'badge-red'}">${active.state}</span>
        </div>
        <p style="font-size:12px; color:#9ca3af;">Service: <strong>${active.serviceName}</strong> • Severity: <strong>${active.severity}</strong></p>
        <div style="font-family:var(--font-mono); font-size:11px; background:#020617; padding:8px; border-radius:6px; margin:8px 0; color:#f87171;">
          ${active.errorSignature}
        </div>

        ${memoryNotice}

        <div class="terminal-window">
          <div class="terminal-line info">[DIAGNOSTIC PIPELINE] Capturing telemetry signature...</div>
          ${active.logs
            .map(
              (l) => `
            <div class="terminal-line ${l.level}">${l.timestamp.slice(11, 19)} $ ${l.command} ➔ ${l.output}</div>
          `
            )
            .join('')}
        </div>

        ${actionHTML}
      </div>
    `;

    // Bind Remediation Action Event Listeners
    document.querySelectorAll('.btn-execute-remediation').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const incidentId = btn.getAttribute('data-incident-id');
        const actionId = btn.getAttribute('data-action-id');
        try {
          const res = await fetch(`${API_BASE}/api/incidents/${incidentId}/remediate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actionId }),
          });
          if (res.ok) {
            fetchServices();
            fetchIncidents();
          }
        } catch (err) {
          console.error('Error executing remediation:', err);
        }
      });
    });
  }

  // Fetch Memory Bank Records
  async function fetchMemories() {
    try {
      const res = await fetch(`${API_BASE}/api/incidents/memories`);
      const data = await res.json();
      renderMemories(data.memories || []);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    }
  }

  function renderMemories(memories) {
    if (!memoryList) return;
    memoryList.innerHTML = memories
      .map(
        (m) => `
      <div class="memory-card">
        <div class="memory-card-header">
          <span style="color:#60a5fa;">${m.impactedService}</span>
          <span class="badge badge-purple">Match 96%</span>
        </div>
        <div style="font-size:12px; margin-bottom:4px; font-weight:600;">${m.errorSignature}</div>
        <div style="font-size:11px; color:#9ca3af;">Root Cause: ${m.rootCause}</div>
        <div class="memory-runbook">
          $ ${m.remediationCommand}
        </div>
      </div>
    `
      )
      .join('');
  }

  // Initial Data Load
  fetchServices();
  fetchIncidents();
  fetchMemories();
});
