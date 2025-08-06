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
  const [loading, setLoading] = useState(true)
  const toast = useToast().toast

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const response = await getUserByClerkId(user.id)

          // Handle the response based on its structure
          if ('error' in response && response.error) {
            console.error('Error fetching user role:', response.error)
            setRole(null)
          } else if ('user' in response && response.user) {
            // Extract the role from the user object
            // Adjust this based on your actual user object structure
            setRole(response.user.role || response.member?.role || null)
          } else {
            setRole(null)
          }
        } else {
          setRole(null)
        }

        const statsData = await getDashboardStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded) {
      fetchData()
    }
  }, [user?.id, isLoaded])

  if (!isLoaded || loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Loading...</p>
      </div>
    )
  }

  // Check if user has admin role - adjust this condition based on your UserRole enum/type
  const isAdmin = role === 'Admin' || role === 'Trainer' // Adjust based on your role values
  const email = user?.primaryEmailAddress?.emailAddress
  const isSuperAdmin = email === 'ntlal0e182@gmail.com'

  // If not admin, show access denied
  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
      </div>
    )
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncClerkUsersToMongoDB()
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.success ? result.message : result.error,
        variant: result.success ? 'default' : 'destructive',
      })
    } catch (error) {
      console.error('Sync error:', error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of members and sign-ups</p>
        </div>
        {role && (
          <div className="text-sm text-gray-500">
            Role: <span className="font-medium">{role}</span>
          </div>
        )}
      </div>

      {stats ? (
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
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Failed to load statistics</p>
        </div>
      )}

      {isSuperAdmin && (
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