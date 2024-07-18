import React from 'react'

const AbiTab = ({abi}:{abi:any[]}) => {
  return (
      <div>
          <h2>ABI</h2>
          <pre>{JSON.stringify(abi,null,2)}</pre>
    </div>
  )
}

export default AbiTab