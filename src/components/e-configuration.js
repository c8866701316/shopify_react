import React from 'react'

function Econfiguration({role}) {
    if (role === 'client') {
        window.history.back()
    }
  return (
    <div>e-configuration</div>
  )
}

export default Econfiguration