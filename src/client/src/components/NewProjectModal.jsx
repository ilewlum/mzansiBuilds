// ─── NewProjectModal.jsx ──────────────────────────────────────────────────────
import { useState } from "react";
import { addMilestone } from "../services/milestone-api";
import "./NewProjectModal.css";

const MAX_MILESTONES = 10;

export default function NewProjectModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    stack: "",
    status: "ACTIVE",
    visibility: "PUBLIC",
    stage: "PLANNING",
    support: "",
  });

  const [milestones, setMilestones] = useState([]);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneInput, setMilestoneInput] = useState({ title: "", message: "" });
  const [isSavingMilestone, setIsSavingMilestone] = useState(false);

  const isMilestoneValid =
    milestoneInput.title.trim() !== "" && milestoneInput.message.trim() !== "";

  const handleSubmit = async () => {
    const project = await onSubmit({ ...form });
    console.log("[Project] Created:", project);

    if (milestones.length > 0 && project?.projectId) {
      console.log(`[Milestone] Firing addMilestone for ${milestones.length} milestone(s) with projectId: ${project.projectId}`);
      setIsSavingMilestone(true);
      try {
        await Promise.all(
          milestones.map((m) => {
            console.log(`[Milestone] → Calling addMilestone for: "${m.title}"`);
            return addMilestone(project.projectId , m.title, m.message);
          })
        );
        console.log("[Milestone] All milestones saved successfully");
      } catch (err) {
        console.error("[Milestone] Failed to save milestones:", err);
      } finally {
        setIsSavingMilestone(false);
      }
    } else if (milestones.length > 0 && !project?.projectId) {
      console.warn("[Milestone] Milestones exist but project.id is missing — skipping addMilestone", project);
    } else {
      console.log("[Milestone] No milestones to save");
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

    const newMilestone = { title: milestoneInput.title.trim(), message: milestoneInput.message.trim() };
    console.log("[Milestone] Added locally:", newMilestone);

    setMilestones((prev) => {
      const updated = [...prev, newMilestone];
      console.log("[Milestone] Local milestones array is now:", updated);
      return updated;
    });
    setMilestoneInput({ title: "", message: "" });
    setShowMilestoneForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">New Project</div>

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

        {/* ── Milestones ──────────────────────────────────────────────────────── */}
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
                <li key={i} className="milestone-chip">
                  <span className="milestone-chip-title">{m.title}</span>
                  <span className="milestone-chip-message">{m.message}</span>
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
                <button
                  className="milestone-cancel"
                  onClick={handleCancelMilestone}
                >
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
        {/* ── /Milestones ─────────────────────────────────────────────────────── */}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={isSavingMilestone}
          >
            {isSavingMilestone ? "Saving…" : "Post Project"}
          </button>
        </div>
      </div>
    </div>
  );
}