import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadRecords, saveRecords } from './storage.js'
import Toast from './Toast.jsx'
import { locationData } from './locationData.js'
import './RegistrationForm.css'

const emptyForm = {
  firstName: '',
  lastName: '',
  age: '',
  country: '',
  state: '',
  city: '',
  pinCode: '',
}

function validate(values) {
  const errors = {}

  if (!values.firstName.trim()) errors.firstName = 'First name is required'
  else if (!/^[A-Za-z\s'-]{2,40}$/.test(values.firstName.trim()))
    errors.firstName = 'Only letters, 2-40 characters'

  if (!values.lastName.trim()) errors.lastName = 'Last name is required'
  else if (!/^[A-Za-z\s'-]{1,40}$/.test(values.lastName.trim()))
    errors.lastName = 'Only letters, max 40 characters'

  if (!values.age.toString().trim()) errors.age = 'Age is required'
  else if (!/^\d{1,3}$/.test(values.age) || Number(values.age) < 1 || Number(values.age) > 120)
    errors.age = 'Enter a valid age (1-120)'

  if (!values.country.trim()) errors.country = 'Country is required'
  if (!values.state.trim()) errors.state = 'State is required'
  if (!values.city.trim()) errors.city = 'City is required'

  if (!values.pinCode.toString().trim()) errors.pinCode = 'Pin code is required'
  else if (!/^\d{4,10}$/.test(values.pinCode))
    errors.pinCode = 'Enter a valid pin code (4-10 digits)'

  return errors
}

export default function RegistrationForm() {
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [stamp, setStamp] = useState(false)
  const navigate = useNavigate()

  const selectedCountry = locationData.find(item => item.name === values.country) || null
  const availableStates = selectedCountry?.states || []
  const selectedState = availableStates.find(item => item.name === values.state) || null
  const availableCities = selectedState?.cities || []

  function showToast(message, type = 'success') {
    setToast({ show: true, message, type })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValues(prev => {
      const next = { ...prev, [name]: value }
      if (touched[name]) setErrors(validate(next))
      return next
    })
  }

  function handleCountryChange(e) {
    const { value } = e.target
    setValues(prev => {
      const next = { ...prev, country: value, state: '', city: '' }
      if (touched.country || touched.state || touched.city) setErrors(validate(next))
      return next
    })
  }

  function handleStateChange(e) {
    const { value } = e.target
    setValues(prev => {
      const next = { ...prev, state: value, city: '' }
      if (touched.state || touched.city) setErrors(validate(next))
      return next
    })
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validate(values)
    setErrors(validation)
    setTouched({
      firstName: true, lastName: true, age: true, country: true, state: true, city: true, pinCode: true,
    })

    if (Object.keys(validation).length > 0) {
      showToast('Please fix the highlighted fields', 'error')
      return
    }

    const records = loadRecords()
    const newRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      country: values.country.trim(),
      createdAt: new Date().toISOString(),
    }
    saveRecords([...records, newRecord])

    setStamp(true)
    showToast('Registration successful — record saved', 'success')
    setValues(emptyForm)
    setTouched({})
    setErrors({})
    window.setTimeout(() => setStamp(false), 1800)
  }

  return (
    <div className="page">
      <Toast {...toast} />

      <p className="eyebrow">Entry Registry · Form 01</p>
      <h1 className="page-title">Registration Card</h1>
      <p className="page-sub">Fill in the details below to add a new entry to the registry ledger.</p>

      <div className="card-wrap">
        <form className="reg-card" onSubmit={handleSubmit} noValidate>
          <div className="reg-card-head">
            <div className="badge">
              {(values.firstName[0] || 'R').toUpperCase()}{(values.lastName[0] || 'C').toUpperCase()}
            </div>
            <div>
              <p className="reg-card-label">New Entrant</p>
              <p className="reg-card-no">No. {Math.floor(Math.random() * 90000 + 10000)}</p>
            </div>
          </div>

          <div className="perforation" />

          {stamp && <div className="stamp-mark">Registered</div>}

          <div className="field-grid">
            <Field
              label="First name" name="firstName" value={values.firstName}
              onChange={handleChange} onBlur={handleBlur} error={touched.firstName && errors.firstName}
              placeholder="Asha"
            />
            <Field
              label="Last name" name="lastName" value={values.lastName}
              onChange={handleChange} onBlur={handleBlur} error={touched.lastName && errors.lastName}
              placeholder="Verma"
            />
            <Field
              label="Age" name="age" value={values.age} type="text" inputMode="numeric"
              onChange={handleChange} onBlur={handleBlur} error={touched.age && errors.age}
              placeholder="24"
            />
            <SelectField
              label="Country" name="country" value={values.country}
              onChange={handleCountryChange} onBlur={handleBlur}
              error={touched.country && errors.country}
            >
              <option value="">Select country</option>
              {locationData.map(country => (
                <option key={country.code} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="State" name="state" value={values.state}
              onChange={handleStateChange} onBlur={handleBlur}
              error={touched.state && errors.state}
              disabled={!values.country}
            >
              <option value="">{values.country ? 'Select state' : 'Select country first'}</option>
              {availableStates.map(item => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="City" name="city" value={values.city}
              onChange={handleChange} onBlur={handleBlur}
              error={touched.city && errors.city}
              disabled={!values.state}
            >
              <option value="">{values.state ? 'Select city' : 'Select state first'}</option>
              {availableCities.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
            <Field
              label="Pin code" name="pinCode" value={values.pinCode} type="text" inputMode="numeric"
              onChange={handleChange} onBlur={handleBlur} error={touched.pinCode && errors.pinCode}
              placeholder="302001"
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn-primary">Submit registration</button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/records')}
            >
              View registry table →
            </button>
          </div>
        </form>
      </div>

      <Link to="/records" className="nav-link-btn footer-link">
        See all saved entries
      </Link>
    </div>
  )
}

function Field({ label, name, value, onChange, onBlur, error, type = 'text', placeholder, inputMode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className={`field-input ${error ? 'field-input-error' : ''}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

function SelectField({ label, name, value, onChange, onBlur, error, disabled = false, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        className={`field-input ${error ? 'field-input-error' : ''}`}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      >
        {children}
      </select>
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
