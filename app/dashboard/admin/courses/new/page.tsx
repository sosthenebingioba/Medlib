.new-course-page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 32px 18px 60px;
  color: #0f172a;
}

.new-course-container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.new-course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.new-course-eyebrow {
  margin: 0 0 7px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.new-course-header h1 {
  margin: 0 0 8px;
  font-size: clamp(30px, 5vw, 44px);
  letter-spacing: -0.03em;
}

.new-course-header p:not(.new-course-eyebrow) {
  margin: 0;
  color: #64748b;
}

.new-course-back {
  flex-shrink: 0;
  padding: 11px 15px;
  border: 1px solid #dbe3ea;
  border-radius: 12px;
  background: #fff;
  color: #334155;
  text-decoration: none;
  font-weight: 800;
}

.course-form {
  display: grid;
  gap: 18px;
}

.form-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #e6ebf0;
  border-radius: 20px;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
}

.form-card-header {
  margin-bottom: 22px;
}

.form-card-header h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.form-card-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 13px;
  font-weight: 800;
  color: #334155;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dbe3ea;
  border-radius: 12px;
  background: #fff;
  color: #0f172a;
  padding: 12px 13px;
  font: inherit;
  outline: none;
}

.form-field textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.55;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.access-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.access-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px;
  border: 1px solid #dbe3ea;
  border-radius: 14px;
  cursor: pointer;
}

.access-option.selected {
  border-color: #0f766e;
  background: #f0fdfa;
}

.access-option input {
  margin-top: 3px;
}

.access-option strong,
.access-option small {
  display: block;
}

.access-option small {
  margin-top: 5px;
  color: #64748b;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.create-button {
  padding: 13px 18px;
  border-radius: 12px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  border: 1px solid #dbe3ea;
  background: #fff;
  color: #334155;
}

.create-button {
  border: 0;
  background: #0f766e;
  color: #fff;
}

@media (max-width: 700px) {
  .new-course-header {
    flex-direction: column;
  }

  .new-course-back {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .form-grid,
  .access-options {
    grid-template-columns: 1fr;
  }

  .form-field.full {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .create-button {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
}
