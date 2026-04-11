import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import "./Project-page.css"
import { useUser } from "../context/UserContext";
import NewProjectModal from "../components/NewProjectModal";
 
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
 
function Avatar({ initial }) {
  return <div className="avatar">{initial?.toUpperCase()}</div>;
}
 
function MilestoneList({ milestones }) {
    console.log("Number of milesstones",milestones?.length);
  if (!milestones?.length) return null;
  const left = milestones.slice(0, Math.ceil(milestones.length / 2));
  const right = milestones.slice(Math.ceil(milestones.length / 2));
  return (
    <div className="milestones">
      <p className="milestones__label">milestones :</p>
      <div className="milestones__grid">
        <ul className="milestones__col">
          {left.map((m) => (
            <li key={m.milestoneId}>
              <span className="milestone__title">{m.title}</span>
              {m.description && (
                <span className="milestone__desc"> — {m.description}</span>
              )}
            </li>
          ))}
        </ul>
        <ul className="milestones__col">
          {right.map((m) => (
            <li key={m.milestoneId}>
              <span className="milestone__title">{m.title}</span>
              {m.description && (
                <span className="milestone__desc"> — {m.description}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
 
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd} / ${mm} / ${yyyy}   ${hh}:${min}`;
}
 
function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
 
  const username = project.users?.username ?? "unknown";
  const initial = username[0];
 
  return (
    <article className="project-card" onClick={() => setExpanded((e) => !e)}>
      <div className="project-card__header">
        <h2 className="project-card__title">{project.title}</h2>
        <span className={`project-card__status ${STAGE_COLORS[project.stage] ?? ""}`}>
          {STAGE_LABELS[project.stage] ?? project.stage}
        </span>
      </div>
 
      <p className="project-card__desc">{project.description}</p>
 
      {project.techStack && (
        <p className="project-card__stack">{project.techStack}</p>
      )}
 
      {project.support && (
        <p className="project-card__support">support needed: {project.support}</p>
      )}
 
      {expanded && <MilestoneList milestones={project.milestones} />}
 
      <div className="project-card__footer">
        <span className="project-card__date">created &nbsp; {formatDate(project.createdAt)}</span>
        <div className="project-card__contributors">
          <Avatar initial={initial} />
          <span>{username}</span>
        </div>
      </div>
    </article>
  );
}
 
export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
 
  const { userProfile } = useUser();
  const { projects, addProject } = useProject();
 
  async function handleNewProject(form) {
    try {
      return await addProject(
        userProfile.userId, form.title, form.description,
        form.support, form.stack, form.stage, form.visibility, form.status
      );
    } catch (error) {
      console.error("Error adding project:", error);
    }
  }
 
  const filtered = projects
    .filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStage =
        stageFilter === "All" || p.stage === stageFilter;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      if (sortOrder === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === "A–Z") return a.title.localeCompare(b.title);
      return 0;
    });
 
  return (
    <>
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onSubmit={handleNewProject}
        />
      )}
 
      <main className="main">
        <div className="toolbar">
          <input
            className="toolbar__search"
            type="text"
            placeholder="find a project......"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="toolbar__select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PLANNING">Planning</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            className="toolbar__select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>A–Z</option>
          </select>
          <button className="toolbar__new-btn" onClick={() => setShowNewProjectModal(true)}>
            New project
          </button>
        </div>
 
        <div className="divider" />
 
        <div className="project-list">
          {filtered.length > 0 ? (
            filtered.map((p) => <ProjectCard key={p.projectId} project={p} />)
          ) : (
            <p className="no-results">No projects match your search.</p>
          )}
        </div>
      </main>
    </>
  );
}