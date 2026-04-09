// ─── NewProjectModal.jsx ──────────────────────────────────────────────────────
import { useState } from "react";
import "./NewProjectModal.css";
 
export default function NewProjectModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", stack: "", status: "ACTIVE", visibility: "PUBLIC", stage: "PLANNING", support: "" });
 
  const handleSubmit = () => {
    onSubmit(form);
    onClose();
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
          {/* FIX: removed stray backtick from label text */}
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
 
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-submit" onClick={handleSubmit}>Post Project</button>
        </div>
      </div>
    </div>
  );
}