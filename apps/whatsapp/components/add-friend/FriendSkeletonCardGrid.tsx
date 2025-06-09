import React from 'react'
import FriendCardSkeleton from '../skeletons/FriendCardSkeleton'

export default function FriendSkeletonCardGrid({count = 6}) {
  return (
    <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <FriendCardSkeleton key={index} />
          ))}
        </div>
      </div>
  )
}
  