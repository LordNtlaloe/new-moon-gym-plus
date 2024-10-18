import React from 'react'
import CreateSessionPage from './CreateSessionPage'
import Banner from '@/components/main/Banner'

export default function page() {
    return (
        <div>
            <Banner page={"Start Your Online Session"} />
            <CreateSessionPage />
        </div>
    )
}
