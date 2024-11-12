import EmployerPostJob from '@/components/EmployerPostJob'
import React from 'react'
import { auth } from '../../../../../auth';

const page = async() => {
    const getSession = await auth();
  return (
    <div><EmployerPostJob session={getSession} user={getSession?.user}/></div>
  )
}

export default page