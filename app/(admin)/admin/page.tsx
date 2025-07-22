// app/admin/sync-users/page.tsx
'use client'

import { syncClerkUsersToMongoDB } from '@/app/_actions/users.actions'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

export default function SyncUsersPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncClerkUsersToMongoDB()
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.success ? result.message : result.error,
        variant: result.success ? 'default' : 'destructive'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sync Clerk Users to MongoDB</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <p className="mb-4">
          This will fetch all users from Clerk and sync them to your MongoDB database.
          Only users not already in MongoDB will be added.
        </p>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing...' : 'Sync Users Now'}
        </Button>
      </div>
    </div>
  )
}