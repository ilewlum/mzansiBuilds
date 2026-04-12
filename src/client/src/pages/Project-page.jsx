import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import "./Project-page.css";
import { useUser } from "../context/UserContext";
import NewProjectModal from "../components/NewProjectModal";

//// ------------------------------------------------------------  page constants  ---------------------------------------------------
const STAGE_COLORS = {
  IN_PROGRESS: "status--progress",
  PLANNING: "status--planning",
  COMPLETED: "status--completed",
};

const STAGE_LABELS = {
  IN_PROGRESS: "in progress",
  PLANNING: "planning",
  COMPLETED: "completed",
};

//// ----------------------------------------------------------------------------------------------------------------------------------
//// ------------------------------------------------------ page formating helper functions -------------------------------------------

// geneerates the avatar
function Avatar({ initial }) {
  return <div className="avatar">{initial?.toUpperCase()}</div>;
}

// formats the date for when the project was created
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)} / ${d.getFullYear()}   ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

////   ------------------------------------------------------------------------------------------------------------------------------------
////   ----------------------------------------------------------- Component functions ----------------------------------------------------

// component function which returns the milestone list within each project card
function MilestoneList({ milestones }) {
  if (!milestones?.length) return null;
  const half = Math.ceil(milestones.length / 2);
  const columns = [milestones.slice(0, half), milestones.slice(half)];

  return (
    <div className="milestones">
      <p className="milestones__label">milestones :</p>
      <div className="milestones__grid">
        {columns.map((col, i) => (
          <ul key={i} className="milestones__col">
            {col.map((m) => (
              <li key={m.milestoneId}>
                <span className="milestone__title">{m.title}</span>
                {m.description && (
                  <span className="milestone__desc"> — {m.description}</span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

// function that returns a project card
function ProjectCard({ project, index = 0, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const username = project.users?.username ?? "unknown";

  function handleEditClick(e) {
    e.stopPropagation();
    onEdit(project);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      onDelete(project.projectId);
    }
  }

  return (
    <article
      className="project-card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="project-card__header">
        <h2 className="project-card__title">{project.title}</h2>
        <div className="project-card__header-right">
          <span className={`project-card__status ${STAGE_COLORS[project.stage] ?? ""}`}>
            {STAGE_LABELS[project.stage] ?? project.stage}
          </span>
          <button className="project-card__edit-btn" onClick={handleEditClick}>Edit</button>
          <button className="project-card__delete-btn" onClick={handleDeleteClick}>Delete</button>
        </div>
      </div>

      <p className="project-card__desc">{project.description}</p>
      {project.techStack && <p className="project-card__stack">{project.techStack}</p>}
      {project.support && <p className="project-card__support">support needed: {project.support}</p>}
      {expanded && <MilestoneList milestones={project.milestones} />}

      <div className="project-card__footer">
        <span className="project-card__date">created &nbsp; {formatDate(project.createdAt)}</span>
        <div className="project-card__contributors">
          <Avatar initial={username[0]} />
          <span>{username}</span>
        </div>
      </div>
    </article>
  );
}

////------------------------------------------------------------------------------------------------------------------------------------------

export default function ProjectsPage() {
  // page component states
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // context variables and methods
  const { userProfile } = useUser();
  const { userProjects, addProject, updateProject, deleteProject } = useProject();

  // Handles editing and project creation
  async function handleSubmitProject(form) {
    try {
      if (editingProject) {
        await updateProject(editingProject.projectId, form.title, form.description, form.support, form.stack, form.stage, form.visibility, form.status);
        setEditingProject(null);
      } else {
        await addProject(userProfile.userId, form.title, form.description, form.support, form.stack, form.stage, form.visibility, form.status);
        setShowNewProjectModal(false);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  }

  //  Handles project deletion
  async function handleDeleteProject(projectId) {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }

  // filters projects pages based on selected filters within the page
  const filtered = userProjects
    .filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStage = stageFilter === "All" || p.stage === stageFilter;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      if (sortOrder === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === "A–Z") return a.title.localeCompare(b.title);
      return 0;
    });

  const activeModal = showNewProjectModal || editingProject;

  return (
    <>
      {/* create project modal*/}
      {activeModal && (
        <NewProjectModal
          initialData={editingProject ?? undefined}
          onClose={() => editingProject ? setEditingProject(null) : setShowNewProjectModal(false)}
          onSubmit={handleSubmitProject}
        />
      )}

      {/* main page window */}
      <main className="main">

        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="toolbar__search"
            type="text"
            placeholder="find a project......"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="toolbar__select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PLANNING">Planning</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select className="toolbar__select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option>Newest</option>
            <option>Oldest</option>
            <option>A–Z</option>
          </select>
          <button className="toolbar__new-btn" onClick={() => setShowNewProjectModal(true)}>
            New project
          </button>
        </div>

        <div className="divider" />

        {/* Project list section */}
        <div className="project-list">
          {filtered.length > 0 ? (
            filtered.map((p, i) => (
              <ProjectCard
                key={p.projectId}
                project={p}
                index={i}
                onEdit={setEditingProject}
                onDelete={handleDeleteProject}
              />
            ))
          ) : (
            <p className="no-results">No projects match your search.</p>
          )}
        </div>
      </main>
    </>
  );
}