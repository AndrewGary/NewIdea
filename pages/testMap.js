import React from 'react'

const testMap = () => {
  return (
    <div className='w-full min-h-screen flex relative'>
        <div className='w-1/2 min-h-screen flex flex-col items-center'>
            <div className='border border-black h-10 w-3/4'></div>
        </div>
        <div className='w-1/2 min-h-screen flex flex-col items-center justify-center space-y-24'>
            <div className='border border-black h-20 w-3/4'></div>
            <div className='border border-black h-48 w-3/4'></div>

        </div>
    </div>
  )
}

export default testMap