import { Users } from "lucide-react";

export default function NoFriendsFound({message}: {message: string}) {
  return (
    <div className="flex-grow flex flex-col items-center p-6 bg-gray-50">
      <p className="text-md font-medium text-gray-500">{message}</p>
    </div>
  )
}