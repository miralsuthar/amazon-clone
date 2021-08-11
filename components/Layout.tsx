import { useRouter } from 'next/dist/client/router';
import React from 'react'

const Layout = ({children}: {children: any}) => {
  const router = useRouter()

  return (<div>
    <div className='flex gap-6 p-4 items-end'>
      <div onClick={() => {
        router.push('/')
      }} className='cursor-pointer font-bold text-2xl'>
        Amazon
      </div>
      <div onClick={() => {
        router.push('/orders')
      }} className='cursor-pointer text-lg'>Orders</div>
    </div>
    <div className='p-6'>{children}</div>
  </div>)
}

export default Layout