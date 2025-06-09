import { Bell } from "lucide-react";

export default function NotificationBanner() {
    return (
      <div className="flex items-center gap-3 p-3 bg-emerald-50 border-b">
        <div className="p-2 bg-blue-100 rounded-full">
          <Bell className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Get notified of new messages</h3>
          <p className="text-sm text-muted-foreground">Turn on desktop notifications ›</p>
        </div>
      </div>
    )
}