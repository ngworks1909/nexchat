import React from 'react'
import { Card, CardContent } from '../ui/card'

export default function FriendCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
      </CardContent>
    </Card>
  )
}
