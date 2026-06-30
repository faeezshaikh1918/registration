import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadRecords, saveRecords } from './storage.js'
import Toast from './Toast.jsx'
import './RecordsPage.css'

export default function RecordsPage() {
  const [records, setRecords] = useState(loadRecords())
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [editErrors, setEditErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [confirmId, setConfirmId] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(t => ({ ...t, show: false })), 2600)
  }

  function startEdit(record) {
    setEditingId(record.id)
    setEditValues({ ...record })
    setEditErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValues({})
    setEditErrors({})
  }

  function validateEdit(values) {
    const errors = {}
    if (!values.firstName.trim()) errors.firstName = 'Required'
    if (!values.lastName.trim()) errors.lastName = 'Required'
    if (!/^\d{1,3}$/.test(values.age) || Number(values.age) < 1 || Number(values.age) > 120)
      errors.age = 'Invalid'
    if (!values.country?.trim()) errors.country = 'Required'
    if (!values.state?.trim()) errors.state = 'Required'
    if (!values.city?.trim()) errors.city = 'Required'
    if (!/^\d{4,10}$/.test(values.pinCode)) errors.pinCode = 'Invalid'
    return errors
  }

  function saveEdit() {
    const errors = validateEdit(editValues)
    setEditErrors(errors)
    if (Object.keys(errors).length > 0) {
      showToast('Please fix the highlighted fields', 'error')
      return
    }
    const updated = records.map(r => (r.id === editingId ? { ...editValues } : r))
    setRecords(updated)
    saveRecords(updated)
    setEditingId(null)
    showToast('Record updated successfully', 'success')
  }

  function deleteRecord(id) {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    saveRecords(updated)
    setConfirmId(null)
    showToast('Record deleted', 'success')
  }

  return (
    <div className="page">
      <Toast {...toast} />

      <p className="eyebrow">Entry Registry · Ledger</p>
      <h1 className="page-title">Registry Table</h1>
      <p className="page-sub">All entries saved on this device. Edit or remove a record at any time.</p>

      <Link to="/" className="nav-link-btn" style={{ marginBottom: 28 }}>← Back to registration form</Link>

      <div className="table-wrap">
        {records.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No entries yet</p>
            <p className="empty-sub">Submit the registration form to see records here.</p>
          </div>
        ) : (
          <table className="ledger-table">
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Age</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Pin code</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => {
                const isEditing = editingId === record.id
                return (
                  <tr key={record.id} className={isEditing ? 'row-editing' : ''}>
                    {isEditing ? (
                      <>
                        <Cell name="firstName" values={editValues} setValues={setEditValues} errors={editErrors} />
                        <Cell name="lastName" values={editValues} setValues={setEditValues} errors={editErrors} />
                        <Cell name="age" values={editValues} setValues={setEditValues} errors={editErrors} mono />
                        <Cell name="country" values={editValues} setValues={setEditValues} errors={editErrors} />
                        <Cell name="state" values={editValues} setValues={setEditValues} errors={editErrors} />
                        <Cell name="city" values={editValues} setValues={setEditValues} errors={editErrors} />
                        <Cell name="pinCode" values={editValues} setValues={setEditValues} errors={editErrors} mono />
                        <td className="col-actions">
                          <button className="btn-mini btn-mini-save" onClick={saveEdit}>Save</button>
                          <button className="btn-mini btn-mini-cancel" onClick={cancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{record.firstName}</td>
                        <td>{record.lastName}</td>
                        <td className="mono">{record.age}</td>
                        <td>{record.country}</td>
                        <td>{record.state}</td>
                        <td>{record.city}</td>
                        <td className="mono">{record.pinCode}</td>
                        <td className="col-actions">
                          <button className="btn-mini btn-mini-edit" onClick={() => startEdit(record)}>Edit</button>
                          {confirmId === record.id ? (
                            <span className="confirm-group">
                              <button className="btn-mini btn-mini-delete" onClick={() => deleteRecord(record.id)}>Confirm</button>
                              <button className="btn-mini btn-mini-cancel" onClick={() => setConfirmId(null)}>×</button>
                            </span>
                          ) : (
                            <button className="btn-mini btn-mini-delete" onClick={() => setConfirmId(record.id)}>Delete</button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Cell({ name, values, setValues, errors, mono }) {
  return (
    <td>
      <input
        className={`cell-input ${mono ? 'mono' : ''} ${errors[name] ? 'cell-input-error' : ''}`}
        value={values[name] || ''}
        onChange={e => setValues(v => ({ ...v, [name]: e.target.value }))}
      />
    </td>
  )
}
