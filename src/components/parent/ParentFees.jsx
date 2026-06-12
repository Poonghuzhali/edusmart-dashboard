import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { loadParentEmail } from '../../utils/session.js'
import { getParentAccountByEmail } from '../../utils/auth.js'

function childNamesForParent(parent, students) {
  if (!parent) return new Set()
  const guardianKey = parent.name.trim().toLowerCase()
  return new Set(
    students
      .filter((s) => s.guardian?.trim().toLowerCase() === guardianKey)
      .map((s) => s.name.toLowerCase()),
  )
}

export default function ParentFees() {
  const { parents, students, payments, pendingDues } = useData()
  const parentEmail = loadParentEmail()

  const parent = useMemo(
    () => getParentAccountByEmail(parentEmail, parents.items),
    [parentEmail, parents.items],
  )

  const childNames = useMemo(
    () => childNamesForParent(parent, students.items),
    [parent, students.items],
  )

  const myPayments = useMemo(
    () => payments.items.filter((p) => childNames.has(p.name.toLowerCase())),
    [payments.items, childNames],
  )

  const myDues = useMemo(
    () => pendingDues.items.filter((p) => childNames.has(p.name.toLowerCase())),
    [pendingDues.items, childNames],
  )

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Fee Details</h1>
          <p>Payments and pending dues for your children</p>
        </div>
      </div>

      <div className="card um-card">
        <div className="card-head"><h3>Recent Payments</h3></div>
        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.feeType}</td>
                  <td>{row.amount}</td>
                  <td><span className={`fee-status fee-status--${row.status.toLowerCase()}`}>{row.status}</span></td>
                  <td>{row.paidDate}</td>
                </tr>
              ))}
              {!myPayments.length && (
                <tr><td colSpan={5}>No payment records for your children.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card um-card" style={{ marginTop: 20 }}>
        <div className="card-head"><h3>Pending Dues</h3></div>
        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Fee Type</th>
                <th>Due Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myDues.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.feeType}</td>
                  <td>{row.dueAmount}</td>
                  <td>{row.dueDate}</td>
                  <td><span className={`fee-status fee-status--${row.status.toLowerCase()}`}>{row.status}</span></td>
                </tr>
              ))}
              {!myDues.length && (
                <tr><td colSpan={5}>No pending dues for your children.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
