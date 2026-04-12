// ─── NewProjectModal.jsx ──────────────────────────────────────────────────────
import { useState } from "react";
import { addMilestone, deleteMilestone} from "../services/milestone-api";
import "./NewProjectModal.css";
 
const MAX_MILESTONES = 10;
 
// Pass `initialData` to open in edit mode:
//   <NewProjectModal initialData={project} onClose={...} onSubmit={handleEdit} />
// Leave it undefined to open in create mode:
//   <NewProjectModal onClose={...} onSubmit={handleCreate} />
 
export default function NewProjectModal({ onClose, onSubmit, initialData }) {
  const isEditing = Boolean(initialData);
  const [removedMilestoneIds, setRemovedMilestoneIds] = useState([]);
 
  const [form, setForm] = useState({
    title:       initialData?.title       ?? "",
    description: initialData?.description ?? "",
    stack:       initialData?.techStack   ?? "",
    status:      initialData?.status      ?? "ACTIVE",
    visibility:  initialData?.visibility  ?? "PUBLIC",
    stage:       initialData?.stage       ?? "PLANNING",
    support:     initialData?.support     ?? "",
  });
 
  // In edit mode seed with existing milestones, mapping description → message
  // so the chip display and submit logic stay consistent.
  const [milestones, setMilestones] = useState(
    isEditing
      ? (initialData.milestones ?? []).map((m) => ({
          milestoneId: m.milestoneId,
          title: m.title,
          message: m.description ?? "",
        }))
      : []
  );
 
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneInput, setMilestoneInput] = useState({ title: "", message: "" });
  const [isSavingMilestone, setIsSavingMilestone] = useState(false);
 
  const isMilestoneValid = milestoneInput.title.trim() !== "" && milestoneInput.message.trim() !== "";
 
  const handleSubmit = async () => {
    const project = await onSubmit({ ...form });
    const newMilestones = milestones.filter((m) => !m.milestoneId);
 
    // FIX: In edit mode, onSubmit (updateProject) returns undefined, so fall
    // back to initialData.projectId which is already available in scope.
    const projectId = project?.projectId ?? initialData?.projectId;
 
    if (projectId) {
      setIsSavingMilestone(true);
      try {
        await Promise.all([
          ...newMilestones.map((m) => addMilestone(projectId, m.title, m.message)),
          ...removedMilestoneIds.map((id) => deleteMilestone(id)),
        ]);
      } catch (err) {
        console.error("[Milestone] Failed to sync milestones:", err);
      } finally {
        setIsSavingMilestone(false);
      }
    }
 
    onClose();
  };
 
  const handleShowMilestoneForm = () => {
    setMilestoneInput({ title: "", message: "" });
    setShowMilestoneForm(true);
  };
 
  const handleCancelMilestone = () => {
    setMilestoneInput({ title: "", message: "" });
    setShowMilestoneForm(false);
  };
 
  const handleAddMilestone = () => {
    if (!isMilestoneValid) return;
    const newMilestone = {
      title: milestoneInput.title.trim(),
      message: milestoneInput.message.trim(),
    };
    setMilestones((prev) => [...prev, newMilestone]);
    setMilestoneInput({ title: "", message: "" });
    setShowMilestoneForm(false);
  };
 
  const handleRemoveMilestone = (index) => {
    const milestone = milestones[index];
    if (milestone.milestoneId) {
      setRemovedMilestoneIds((prev) => [...prev, milestone.milestoneId]);
    }
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isEditing ? "Edit Project" : "New Project"}</div>
 
        <div className="modal-field">
          <label className="field-label">Project Title</label>
          <input
            className="modal-input"
            placeholder="e.g. SafePay Gateway"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
 
        <div className="modal-field">
          <label className="field-label">Description</label>
          <textarea
            className="modal-textarea"
            placeholder="What are you building and why?"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
 
        <div className="modal-field">
          <label className="field-label">Tech Stack (comma separated)</label>
          <input
            className="modal-input"
            placeholder="React, Node.js, PostgreSQL"
            value={form.stack}
            onChange={(e) => setForm((p) => ({ ...p, stack: e.target.value }))}
          />
        </div>
 
        <div className="modal-field">
          <label className="field-label">Support (comma separated)</label>
          <input
            className="modal-input"
            placeholder="Testing, Code Review, Design"
            value={form.support}
            onChange={(e) => setForm((p) => ({ ...p, support: e.target.value }))}
          />
        </div>
 
        <div className="modal-field">
          <label className="field-label">Stage</label>
          <select
            className="modal-input"
            value={form.stage}
            onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))}
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETE">Complete</option>
          </select>
        </div>
 
        <div className="modal-field">
          <label className="field-label">Status</label>
          <select
            className="modal-input"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETE">Complete</option>
            <option value="ON_HOLD">On hold</option>
          </select>
        </div>
 
        <div className="modal-field">
          <label className="field-label">Visibility</label>
          <select
            className="modal-input"
            value={form.visibility}
            onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value }))}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
 
        {/* ── Milestones ── */}
        <div className="modal-field">
          <label className="field-label">
            Milestones
            {milestones.length > 0 && (
              <span className="milestone-counter">
                {milestones.length} / {MAX_MILESTONES}
              </span>
            )}
          </label>
 
          {milestones.length > 0 && (
            <ul className="milestone-list">
              {milestones.map((m, i) => (
                <li key={m.milestoneId ?? i} className="milestone-chip">
                  <div className="milestone-chip-text">
                    <span className="milestone-chip-title">{m.title}</span>
                    <span className="milestone-chip-message">{m.message}</span>
                  </div>
                  <button
                    className="milestone-chip-remove"
                    onClick={() => handleRemoveMilestone(i)}
                    title="Remove milestone"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
 
          {showMilestoneForm && (
            <div className="milestone-form">
              <input
                className="modal-input"
                placeholder="Milestone title"
                value={milestoneInput.title}
                onChange={(e) =>
                  setMilestoneInput((p) => ({ ...p, title: e.target.value }))
                }
              />
              <textarea
                className="modal-textarea milestone-textarea"
                placeholder="Describe this milestone..."
                value={milestoneInput.message}
                onChange={(e) =>
                  setMilestoneInput((p) => ({ ...p, message: e.target.value }))
                }
              />
              <div className="milestone-form-actions">
                <button className="milestone-cancel" onClick={handleCancelMilestone}>
                  Cancel
                </button>
                <button
                  className="milestone-add"
                  onClick={handleAddMilestone}
                  disabled={!isMilestoneValid}
                >
                  Add
                </button>
              </div>
            </div>
          )}
 
          {!showMilestoneForm && milestones.length < MAX_MILESTONES && (
            <button className="milestone-add-trigger" onClick={handleShowMilestoneForm}>
              <span className="milestone-plus">+</span> Add milestone
            </button>
          )}
        </div>
        {/* ── /Milestones ── */}
 
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={isSavingMilestone}
          >
            {isSavingMilestone ? "Saving…" : isEditing ? "Save Changes" : "Post Project"}
          </button>
        </div>
      </div>
    </div>
  );
}