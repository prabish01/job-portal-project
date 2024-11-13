import JobSeekerProfile from '@/components/JobseekerProfile'
import React from 'react'

const page = () => {
  return (
    <div><JobSeekerProfile session={undefined} user={{
          name: '',
          email: '',
          mobile: '',
          permanent_address: ''
      }}/></div>
  )
}

export default page