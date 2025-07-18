import { useEffect, useState, useCallback } from "react";

const GoogleDrivePicker = ({ onSelect }) => {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

  // Load Google APIs
  useEffect(() => {
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      script.onerror = () => setError(`Failed to load script: ${src}`);
      document.body.appendChild(script);
    };

    // Load Google Identity Services (OAuth)
    if (!window.google?.accounts) {
      loadScript("https://accounts.google.com/gsi/client", () => {
        console.log("✅ Google Identity Services Loaded");
      });
    }

    // Load Google Picker API
    if (!window.google?.picker) {
      loadScript("https://apis.google.com/js/picker.js", () => {
        console.log("✅ Google Picker Loaded");
        setPickerLoaded(true);
      });
    } else {
      setPickerLoaded(true);
    }

    // Load Google API (gapi)
    if (!window.gapi) {
      loadScript("https://apis.google.com/js/api.js", () => {
        window.gapi.load("client", async () => {
          try {
            await window.gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              scope: SCOPES,
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            });
            console.log("✅ Google API Loaded");
            setGapiLoaded(true);
          } catch (err) {
            setError("Failed to initialize Google API client");
            console.error("Google API Error:", err);
          }
        });
      });
    } else {
      setGapiLoaded(true);
    }
  }, [API_KEY, CLIENT_ID]);

  // Handle Authentication
  const handleAuth = useCallback(() => {
    if (!window.google?.accounts?.oauth2) {
      setError("Google OAuth not available");
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error) {
          setError("Authentication failed");
          console.error("Auth Error:", response);
          return;
        }
        setToken(response.access_token);
        console.log("✅ Authentication successful:", response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  }, [CLIENT_ID]);

  // Open Google Picker
  const openPicker = () => {
    if (!gapiLoaded || !pickerLoaded || !token) {
      setError("Picker is not ready or user is not authenticated");
      return;
    }

    if (!window.google?.picker) {
      setError("Google Picker API is not loaded yet.");
      return;
    }

    try {
      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
      const picker = new window.google.picker.PickerBuilder()
        .setOAuthToken(token) // Ensure correct OAuth token
        .addView(view)
        .setDeveloperKey(API_KEY)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            console.log("✅ File Selected:", data.docs);
            fetchFileData(data.docs[0].id); // Fetch selected file details
          }
        })
        .build();
      picker.setVisible(true);
    } catch (err) {
      setError("Failed to open Google Picker");
      console.error("Picker Error:", err);
    }
  };

  // Fetch selected file details using Google Drive API
  const fetchFileData = async (fileId) => {
    if (!fileId || !token) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Bad Request: ${response.statusText}`);
      }

      const fileData = await response.blob();
      console.log("✅ File Downloaded:", fileData);
      onSelect({ id: fileId, blob: fileData });
    } catch (error) {
      setError("Failed to fetch file");
      console.error("Fetch Error:", error);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!token ? (
        <button onClick={handleAuth} disabled={!gapiLoaded}>
          {gapiLoaded ? "Sign in with Google" : "Loading..."}
        </button>
      ) : (
        <button onClick={openPicker} disabled={!pickerLoaded}>
          {pickerLoaded ? "Open Google Drive Picker" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default GoogleDrivePicker;
