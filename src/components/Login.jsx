import { useState } from 'react'
import { Mail, Lock } from '../icons.jsx'
import { validateEmail, validatePassword, runValidation } from '../utils/validation.js'
import { PARENT_LOGIN_ACCOUNTS, PARENT_PASSWORD, validateParentLogin } from '../utils/auth.js'

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

    if (role === 'parent') {
      const parentError = validateParentLogin(email, password)
      if (parentError) {
        setFormError(parentError)
        return
      }
      onSignIn(role, email)
      return
    }

    onSignIn(role)
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-sub">Sign into your EduSmart account</p>

        {formError && <div className="form-alert form-alert-error">{formError}</div>}

        <div className="role-toggle role-toggle--3">
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
          <button
            type="button"
            className={`role-btn${role === 'parent' ? ' active' : ''}`}
            onClick={() => setRole('parent')}
          >
            Parent
          </button>
        </div>

        {role === 'parent' && (
          <div className="login-hint">
            <strong>Parent demo accounts</strong>
            <ul>
              {PARENT_LOGIN_ACCOUNTS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="login-hint-email"
                    onClick={() => {
                      setEmail(p.email)
                      setPassword(PARENT_PASSWORD)
                      setErrors({})
                      setFormError('')
                    }}
                  >
                    {p.email}
                  </button>
                </li>
              ))}
            </ul>
            <p>Password for all: <code>{PARENT_PASSWORD}</code></p>
          </div>
        )}

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
