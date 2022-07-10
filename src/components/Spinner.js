import React from 'react'

export default function({ type }) {
  if (type === 'table')
    return <tbody className="spinner-border text-light text-center"></tbody>

  return <div className="spinner-border text-light text-center"></div>
}
