const QUIPS = {
  High: [
    "this patient needs immediate attention fr ",
    "high alert — get the care team on this asap",
    "not looking good ngl, priority care needed ",
  ],
  Medium: [
    "keep a close eye on this one ",
    "moderate risk — monitor and follow up",
    "could go either way, stay on top of it ",
  ],
  Low: [
    "patient is looking stable, we love to see it ",
    "low risk detected — routine follow up should do!",
    "all good here, keep up the care routine ",
  ],
};

function getQuip(riskLevel) {
  const pool = QUIPS[riskLevel] || QUIPS.Low;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function predict() {
  // Reset UI
  document.getElementById('errorMsg').textContent = '';
  document.getElementById('result').classList.remove('show');
  document.getElementById('spinner').style.display  = 'inline';
  document.getElementById('btn-text').style.display = 'none';
  document.getElementById('predictBtn').disabled    = true;

  // Collect form values
  const payload = {
    'Age':                document.getElementById('Age').value,
    'Gender':             document.getElementById('Gender').value,
    'Blood Type':         document.getElementById('BloodType').value,
    'Medical Condition':  document.getElementById('MedicalCondition').value,
    'Admission Type':     document.getElementById('AdmissionType').value,
    'Length of Stay':     document.getElementById('LengthOfStay').value,
    'Insurance Provider': document.getElementById('InsuranceProvider').value,
    'Billing Amount':     document.getElementById('BillingAmount').value,
  };

  // Log payload to console for debugging
  console.log('Sending payload:', payload);

  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      },
      body: JSON.stringify(payload),
    });

    // Log raw response status
    console.log('Response status:', response.status);

    // Parse the JSON response
    const text = await response.text();
    console.log('Raw response:', text);

    // Convert text to JSON
    const data = JSON.parse(text);
    console.log('Parsed data:', data);

    if (data.error) {
      showError('Error: ' + data.error);
      return;
    }

    renderResult(data);

  } catch (err) {
    // Log the actual error
    console.error('Fetch error:', err);
    showError('Error: ' + err.message);

  } finally {
    document.getElementById('spinner').style.display  = 'none';
    document.getElementById('btn-text').style.display = 'inline';
    document.getElementById('predictBtn').disabled    = false;
  }
}

function renderResult(data) {
  document.getElementById('probNumber').textContent = data.probability + '%';

  const badge = document.getElementById('riskBadge');
  badge.textContent = data.risk_level + ' Risk';
  badge.className   = 'risk-badge risk-' + data.risk_level;

  const verdict = document.getElementById('verdict');
  if (data.high_risk === 'High') {
    verdict.textContent = 'This patient is high risk for re-admission';
    verdict.className   = 'verdict churn';
  } else if (data.risk_level === 'Medium'){
    verdict.textContent = 'This patient is medium risk , monitor closely';
    verdict.className   = 'verdict churn';
  } else {
    verdict.textContent = 'This patient is low risk for addmission';
    verdict.className = 'verdict no-churn';
  }

  document.getElementById('quip').textContent = getQuip(data.risk_level);
  document.getElementById('result').classList.add('show');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
}