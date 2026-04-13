import { useState } from "react";
import "./NotificationDrawer.css";
import { updateCollaboration } from "../services/collaboration-api";
import { useProject } from "../context/ProjectContext";
import { useUser } from "../context/UserContext";

// ----------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------- Page Defined Constants ----------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
const STATUS_TABS = ["NOTIFICATIONS", "ACCEPTED", "REJECTED"];

const TAB_LABELS = {
  NOTIFICATIONS: "notifications",
  ACCEPTED: "accepted",
  REJECTED: "declined",
};

const TAB_EMPTY = {
  NOTIFICATIONS: "No notifications yet.",
  ACCEPTED: "No accepted collaborations yet.",
  REJECTED: "No declined requests.",
};

// ----------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------- Helper function -------------------------------------------------------
function Avatar({ initial }) {
  return <div className="drawer-avatar">{initial?.toUpperCase()}</div>;
}

// ----------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------- Component ---------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
function CollaborationCard({ collab, status, onAccept, onReject }) {
  const username = collab.users?.username ?? "unknown";
  const initial = username[0];
  const badgeStatus = status === "NOTIFICATIONS" ? collab.status : status;

  return (
    <div className={`collab-card collab-card--${collab.status.toLowerCase()}`}>
      <div className="collab-card__top">
        <Avatar initial={initial} />
        <div className="collab-card__meta">
          <span className="collab-card__username">{username}</span>
          <span className="collab-card__title">{collab.title}</span>
          <span className="collab-card__project">on {collab.projectTitle}</span>
        </div>
        <span className={`collab-card__badge badge--${badgeStatus.toLowerCase()}`}>
          {TAB_LABELS[badgeStatus] ?? badgeStatus.toLowerCase()}
        </span>
      </div>

      {collab.message && (
        <p className="collab-card__message">"{collab.message}"</p>
      )}

      {status === "NOTIFICATIONS" && collab.status === "PENDING" && collab._incoming && (
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
  
  const [activeTab, setActiveTab] = useState("NOTIFICATIONS");
  const { refreshProjects, sentCollaborations } = useProject();
  const { userProfile } = useUser();

  // --------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------- Computed Constants -----------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------
  // Incoming: requests made to the logged-in user's own projects
  const incomingCollabs = projects.flatMap((project) =>
    (project.collaborations ?? [])
      .filter((c) => c.requestingUserId !== userProfile?.userId)
      .map((c) => ({
        ...c,
        projectTitle: project.title,
        _incoming: true,
      }))
  );

  // Outgoing: requests the logged-in user sent to other projects, that got responded to
  const outgoingResponded = sentCollaborations
    .filter((c) => c.status === "ACCEPTED" || c.status === "REJECTED")
    .map((c) => ({
      ...c,
      projectTitle: c.projects?.title ?? "a project",
      // show the project owner as the "actor" on the card
      users: c.projects?.users ?? { username: "unknown" },
      _incoming: false,
    }));

  // returns a filtered array of notification objects
  const getFiltered = (tab) => {
    if (tab === "NOTIFICATIONS") {
      return [
        ...incomingCollabs.filter((c) => c.status === "PENDING"),
        ...outgoingResponded,
      ].sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });
    }
    if (tab === "ACCEPTED") {
      return incomingCollabs.filter((c) => c.status === "ACCEPTED");
    }
    if (tab === "REJECTED") {
      return incomingCollabs.filter((c) => c.status === "REJECTED");
    }
    return [];
  };

  const filtered = getFiltered(activeTab);

  const getCount = (tab) => {
    if (tab === "NOTIFICATIONS") {
      return (
        incomingCollabs.filter((c) => c.status === "PENDING").length +
        outgoingResponded.length
      );
    }
    if (tab === "ACCEPTED") {
      return incomingCollabs.filter((c) => c.status === "ACCEPTED").length;
    }
    if (tab === "REJECTED") {
      return incomingCollabs.filter((c) => c.status === "REJECTED").length;
    }
    return 0;
  };

  //---------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- Handlers -------------------------------------------------------------- 
  //---------------------------------------------------------------------------------------------------------------------------------
  // handles updating collaboration request to accepted
  async function handleAccept(collaborationId) {
    await updateCollaboration(collaborationId, "ACCEPTED");
    await refreshProjects();
  }

  // handles updating collaboration request to rejected
  async function handleReject(collaborationId) {
    await updateCollaboration(collaborationId, "REJECTED");
    await refreshProjects();
  }

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}

      {/* ----- Drawer ----- */}
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <h3 className="drawer-header__title">notifications</h3>
          <button className="drawer-header__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/*  Drawer tabs  */}
        <div className="drawer-tabs">
          {STATUS_TABS.map((tab) => {
            const count = getCount(tab);
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

          {/*  Drawer content with collaboration cards  */}
        <div className="drawer-content">
          {filtered.length === 0 ? (
            <p className="drawer-empty">{TAB_EMPTY[activeTab]}</p>
          ) : (
            filtered.map((collab, i) => (
              <CollaborationCard
                key={collab.collaborationId ?? i}
                collab={collab}
                status={activeTab}
                onAccept={() => handleAccept(collab.collaborationId)}
                onReject={() => handleReject(collab.collaborationId)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}