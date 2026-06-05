import { useState } from 'react'
import { Mail, Lock } from '../icons.jsx'
import { validateEmail, validatePassword, runValidation } from '../utils/validation.js'

export default function Login({ onSignIn }) {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    const { valid, errors: nextErrors } = runValidation({
      email: [() => validateEmail(email)],
      password: [() => validatePassword(password)],
    })

    setErrors(nextErrors)
    if (!valid) {
      setFormError('Please fix the errors below before signing in.')
      return
    }

    onSignIn(role)
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-sub">Sign into your careerwave account</p>

        {formError && <div className="form-alert form-alert-error">{formError}</div>}

        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn${role === 'admin' ? ' active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button
            type="button"
            className={`role-btn${role === 'teacher' ? ' active' : ''}`}
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
        </div>

        <label className="field-label">Email</label>
        <div className={`field${errors.email ? ' has-error' : ''}`}>
          <Mail size={18} />
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: null })) }}
          />
        </div>
        {errors.email && <span className="login-field-error">{errors.email}</span>}

        <label className="field-label">Password</label>
        <div className={`field${errors.password ? ' has-error' : ''}`}>
          <Lock size={18} />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: null })) }}
          />
        </div>
        {errors.password && <span className="login-field-error">{errors.password}</span>}

        <button type="submit" className="login-btn">Sign in</button>
      </form>
    </div>
  )
}
