'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { syncClerkUsersToMongoDB, getUserByClerkId } from '@/app/_actions/users.actions'
import { getDashboardStats } from '@/app/_actions/dashboard.actions'
import { UserRole } from '@/lib/types'

type DashboardStats = {
  totalMembers: number
  newSignUpsThisMonth: number
  activeSubscriptions: number
  weightLossProgram: number
  trainers: number
  cancelledSubscriptions: number
}

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<UserRole | null | undefined>(undefined)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const toast = useToast().toast

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const roleFromDb = await getUserByClerkId(user.id)
        setRole(roleFromDb)
      }
      const statsData = await getDashboardStats()
      setStats(statsData)
    }
    fetchData()
  }, [user?.id])

  if (!isLoaded || role === undefined) return <div className="p-6 text-center">Loading...</div>
  const email = user?.primaryEmailAddress?.emailAddress

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncClerkUsersToMongoDB()
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.success ? result.message : result.error,
        variant: result.success ? 'default' : 'destructive',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const statsList = stats
    ? [
      { label: 'Total Members', value: stats.totalMembers },
      { label: 'New Sign-ups This Month', value: stats.newSignUpsThisMonth },
      { label: 'Active Subscriptions', value: stats.activeSubscriptions },
      { label: 'Weight-loss Program Members', value: stats.weightLossProgram },
      { label: 'Trainers', value: stats.trainers },
      { label: 'Cancelled Subscriptions', value: stats.cancelledSubscriptions },
    ]
    : []

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">Overview of members and sign-ups</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsList.map((stat, i) => (
          <Card key={i} className="shadow-lg dark:bg-[#1D1D1D]">
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {email === 'ntlal0e182@gmail.com' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Sync Clerk Users to MongoDB</h2>
          <p className="mb-4">
            This will fetch all users from Clerk and sync them to your MongoDB database.
            Only users not already in MongoDB will be added.
          </p>
          <Button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? 'Syncing...' : 'Sync Users Now'}
          </Button>
        </div>
      )}
    </div>
  )
}
