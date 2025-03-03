import React from 'react'

function Promptpage({role}) {
    if (role === 'client') {
        window.history.back()
    }
  return (
    <div>Promptpage</div>
  )
}

export default Promptpage