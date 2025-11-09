// ========== Dashboard logic for index.html ==========

// SET THESE TO YOUR REAL ENDPOINTS IF AVAILABLE
const HACKATHON_API_URL = 'https://api.example.com/hackathons?location=india';
// ========== Load student profile on dashboard ==========
function loadStudentProfile() {
  if (localStorage.studentProfile) {
    const profile = JSON.parse(localStorage.studentProfile);
    document.getElementById('student-name').textContent = profile.name;
    document.getElementById('student-branch').textContent = profile.branch;
    document.getElementById('student-college').textContent = profile.college;
  }
  if (localStorage.studentLocation) {
    document.getElementById('student-location').textContent = localStorage.studentLocation;
  }
}

// Call on page load
if (document.getElementById('student-name')) {
  loadStudentProfile();
}


async function fetchHackathons() {
  try {
    // Real API call
    const res = await fetch(HACKATHON_API_URL);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    showHackathons(data);
    populateCalendar(data);
  } catch (err) {
    // Fallback to mock data
    fetch('data/hackathons.json')
      .then(res => res.json())
      .then(data => {
        showHackathons(data);
        populateCalendar(data);
      })
      .catch(() => {
        document.getElementById('hackathon-list').innerHTML =
          '<div style="color:#c0392b; padding:20px;">Could not load hackathons.</div>';
        document.getElementById('calendar-dates').innerHTML = '';
      });
  }
}

function showHackathons(hackathons) {
  const container = document.getElementById('hackathon-list');
  container.innerHTML = '';
  hackathons.forEach(h => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${h.name}</h3>
      <p><strong>Location:</strong> ${h.location}</p>
      <p><strong>Prize:</strong> ${h.prize}</p>
      <p><strong>Eligibility:</strong> ${h.eligibility}</p>
      <p><strong>Timeline:</strong> ${h.timeline}</p>
      <button onclick="viewHackathon(${h.id})">View Journey Plan</button>
    `;
    container.appendChild(card);
  });
}

function viewHackathon(id) {
  localStorage.setItem('selectedHackathonId', id);
  window.location.href = 'hackathon.html';
}

function populateCalendar(hackathons) {
  const datesDiv = document.getElementById('calendar-dates');
  datesDiv.innerHTML = hackathons.map(h =>
    `<span title="${h.name}" class="calendar-date">${h.date}</span>`
  ).join(' ');
}

// Call at startup
fetchHackathons();
