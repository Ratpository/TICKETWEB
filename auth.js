// Google OAuth configuration
const CLIENT_ID = '770233034060-6h18rtujn6mp8mq4dis29oooddbo72mn.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC1KJihykIgAqSrKQQJnqNZvcaYxkS3LcU';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/userinfo.email';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let currentUser = null;

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('signin-btn').style.visibility = 'visible';
  }
}

function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    
    // Get user email
    const userInfo = await gapi.client.request({
      path: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });
    
    currentUser = {
      email: userInfo.result.email,
      name: userInfo.result.name
    };
    
    // Check access
    checkUserAccess(currentUser.email);
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}

async function checkUserAccess(email) {
  try {
    const response = await fetch('access_emails.json');
    const accessData = await response.json();
    
    if (accessData.admins.includes(email)) {
      currentUser.role = 'admin';
      initializeApp();
    } else if (accessData.viewers.includes(email)) {
      currentUser.role = 'viewer';
      initializeApp();
    } else {
      alert('You do not have access to this application.');
      signOut();
    }
  } catch (error) {
    console.error('Error checking access:', error);
    alert('Error checking access permissions.');
  }
}

function signOut() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    currentUser = null;
    document.getElementById('app-content').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
  }
}

function initializeApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-content').style.display = 'block';
  document.getElementById('user-email').textContent = currentUser.email;
  document.getElementById('user-role').textContent = currentUser.role;
  
  if (currentUser.role === 'viewer') {
    // Disable edit functionality for viewers
    document.getElementById('add-ticket-btn').style.display = 'none';
    document.querySelectorAll('.editable').forEach(el => {
      el.style.display = 'none';
    });
  }
  
  // Now load the ticket management system
  loadTicketSystem();
}