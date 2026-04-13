// A modal component that prompts new users to set up their profile with a username and bio. 
// It includes validation, error handling, and a warning if they attempt to exit without completing the setup.
import { useState, useEffect } from "react";
import "./OnboardingModal.css";
import { addUserProfile, handleLogout } from "../services/user-api";

const USERNAME_RE = /^[a-zA-Z0-9_]+$/;
const USERNAME_MIN = 3;
const BIO_MIN = 10;

export default function OnboardingModal({onComplete }) 
{
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [showExitWarning, setShowExitWarning] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // -------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------- Helper methods ------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------
    // Derive initials for avatar preview
    const initials = username.slice(0, 2).toUpperCase() || "?";

    // Username validation
    function validateUsername(value) {
        if (value.length > 0 && value.length < USERNAME_MIN)
            return "Username must be at least 3 characters.";
        if (value.length > 0 && !USERNAME_RE.test(value))
            return "Only letters, numbers, and underscores allowed.";
        return "";
    }

    // Check if form can be saved
    const usernameOk =
        username.trim().length >= USERNAME_MIN && USERNAME_RE.test(username.trim());
    const bioOk = bio.trim().length >= BIO_MIN;
    const canSave = usernameOk && bioOk;

    // -------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------ Handlers ---------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------------
    // Limit input and validate on change
    function handleUsernameChange(e) {
        const val = e.target.value.slice(0, 30);
        setUsername(val);
        setUsernameError(validateUsername(val));
    }
    
    // Limit bio input
    function handleBioChange(e) {
        setBio(e.target.value.slice(0, 200));
    }

    // Save profile and handle errors
    async function handleSave() {
        if (!canSave || saving) return;
            setSaving(true);
            setSaveError("");
        
            try{
                await addUserProfile(username.trim(), bio.trim());
                onComplete?.();       
            }
            catch (err) {
                setSaveError(err.message || "Something went wrong. Please try again.");
                setSaving(false);
            }
    }

    // Handle logout if user confirms exit
    async function handleConfirmLogout() {
        setLoggingOut(true);
        try{
            await handleLogout();
            window.location.href = "/";
        }catch{
            setLoggingOut(false);
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------

    // Block browser back / accidental navigation while modal is open
    useEffect(() => {
        function handleBeforeUnload(e) {
            e.preventDefault();
            e.returnValue = "";
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [])

    return (
    <div className="ob-backdrop">
      <div className="ob-modal" role="dialog" aria-modal="true" aria-labelledby="ob-title">
 
        {/* Close button – triggers exit warning instead of closing */}
        <button
          className="ob-close-btn"
          aria-label="Close"
          onClick={() => setShowExitWarning(true)}
        >
          ✕
        </button>
 
        {/* ── Header ── */}
        <div className="ob-header">
          <div className="ob-avatar-preview">{initials}</div>
          <h2 className="ob-title" id="ob-title">Welcome! Let's set up your profile</h2>
          <p className="ob-subtitle">
            Just two quick things before you dive in
          </p>
        </div>
 
        {/* ── Exit warning banner ── */}
        {showExitWarning && (
          <div className="ob-warn-box" role="alert">
            <p className="ob-warn-title">⚠ You'll be logged out</p>
            <p className="ob-warn-text">
              You must complete your profile to continue. Closing this screen
              will automatically sign you out.
            </p>
            <div className="ob-warn-actions">
              <button
                className="ob-warn-back"
                onClick={() => setShowExitWarning(false)}
              >
                ← Stay & finish
              </button>
              <button
                className="ob-warn-logout"
                onClick={handleConfirmLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out…" : "Log me out"}
              </button>
            </div>
          </div>
        )}
 
        {/* ── Form ── */}
        <div className="ob-body">
          {/* Username */}
          <div className="ob-field">
            <label htmlFor="ob-username">Username</label>
            <input
              id="ob-username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="e.g. alex_builds"
              maxLength={30}
              autoComplete="off"
              className={usernameError ? "error" : ""}
            />
            <div className="ob-field-footer">
              <span className={`ob-hint ${usernameError ? "ob-hint--error" : ""}`}>
                {usernameError || "Letters, numbers, and underscores only"}
              </span>
              <span className="ob-counter">{username.length} / 30</span>
            </div>
          </div>
 
          {/* Bio */}
          <div className="ob-field">
            <label htmlFor="ob-bio">Bio</label>
            <textarea
              id="ob-bio"
              value={bio}
              onChange={handleBioChange}
              placeholder="Tell the community a bit about yourself and what you're building…"
              rows={4}
              maxLength={200}
            />
            <div className="ob-field-footer">
              <span className="ob-hint">A short intro for your profile card</span>
              <span className="ob-counter">{bio.length} / 200</span>
            </div>
          </div>
 
          {/* Save error */}
          {saveError && <p className="ob-save-error">{saveError}</p>}
 
          {/* Save button */}
          <button
            className="ob-save-btn"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? "Saving…" : "Save & enter the feed →"}
          </button>
        </div>
      </div>
    </div>
  );
}