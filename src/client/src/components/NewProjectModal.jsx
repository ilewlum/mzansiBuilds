// ─── NewProjectModal.jsx ──────────────────────────────────────────────────────
import { useState } from "react";
import "./NewProjectModal.css";

export default function NewProjectModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", stack: "",status:"",visibility:"",stage:""});
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

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-submit" onClick={handleSubmit}>Post Project</button>
        </div>
      </div>
    </div>
  );
}
