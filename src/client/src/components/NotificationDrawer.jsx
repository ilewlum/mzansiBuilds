import { useState } from "react";
import "./NotificationDrawer.css";
import { updateCollaboration } from "../services/collaboration-api"; 
import { useProject } from "../context/ProjectContext";
const STATUS_TABS = ["PENDING", "ACCEPTED", "REJECTED"];
 
const TAB_LABELS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "declined",
};
 
const TAB_EMPTY = {
  PENDING: "No pending collaboration requests.",
  ACCEPTED: "No accepted collaborations yet.",
  REJECTED: "No declined requests.",
};
 
function Avatar({ initial }) {
  return <div className="drawer-avatar">{initial?.toUpperCase()}</div>;
}
 
function CollaborationCard({ collab, status, onAccept, onReject }) {
  const username = collab.users?.username ?? "unknown";
  const initial = username[0];
 
  return (
    <div className={`collab-card collab-card--${status.toLowerCase()}`}>
      <div className="collab-card__top">
        <Avatar initial={initial} />
        <div className="collab-card__meta">
          <span className="collab-card__username">{username}</span>
          <span className="collab-card__title">{collab.title}</span>
        </div>
        <span className={`collab-card__badge badge--${status.toLowerCase()}`}>
          {TAB_LABELS[status]}
        </span>
      </div>
 
      {collab.message && (
        <p className="collab-card__message">"{collab.message}"</p>
      )}
 
      {status === "PENDING" && (
        <div className="collab-card__actions">
          <button
            className="collab-btn collab-btn--accept"
            onClick={() => onAccept(collab)}
          >
            Accept
          </button>
          <button
            className="collab-btn collab-btn--reject"
            onClick={() => onReject(collab)}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
 
export default function NotificationDrawer({ open, onClose, projects = [] }) {
  const [activeTab, setActiveTab] = useState("PENDING");
  const { refreshProjects} = useProject();
 
  // Flatten all collaborations from all projects, attach project title
  const allCollabs = projects.flatMap((project) =>
    (project.collaborations ?? []).map((c) => ({
      ...c,
      projectTitle: project.title,
    }))
  );
 
  const filtered = allCollabs.filter((c) => c.status === activeTab);
 
  async function handleAccept(collaborationId) {
    // Replace with real backend call
    await updateCollaboration(collaborationId, "ACCEPTED");
    await refreshProjects();
  }
 
  async function handleReject(collaborationId) {
    // Replace with real backend call
    await updateCollaboration(collaborationId, "REJECTED");
    await refreshProjects();
  }
 
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
 
      <div className={`drawer ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-header__title">notifications</h3>
          <button className="drawer-header__close" onClick={onClose}>
            ✕
          </button>
        </div>
 
        {/* Tab Bar */}
        <div className="drawer-tabs">
          {STATUS_TABS.map((tab) => {
            const count = allCollabs.filter((c) => c.status === tab).length;
            return (
              <button
                key={tab}
                className={`drawer-tab ${activeTab === tab ? "drawer-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
                {count > 0 && (
                  <span className={`drawer-tab__badge tab-badge--${tab.toLowerCase()}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
 
        <div className="drawer-divider" />
 
        {/* Content */}
        <div className="drawer-content">
          {filtered.length === 0 ? (
            <p className="drawer-empty">{TAB_EMPTY[activeTab]}</p>
          ) : (
            filtered.map((collab, i) => (
              <CollaborationCard
                key={collab.collaborationId ?? i}
                collab={collab}
                status={activeTab}
                onAccept={() =>handleAccept(collab.collaborationId)}
                onReject={() =>handleReject(collab.collaborationId)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}