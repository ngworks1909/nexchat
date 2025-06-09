import Sidebar from '../sidebar/Sidebar'
import SidebarWrapper from '../sidebar/SidebarWrapper'
import Chat from '../chat/Chat'
import ChatWrapper from '../chat/ChatWrapper'

export default function Home() {
  return (
    <div className="h-dvh flex bg-background">
      <Sidebar><SidebarWrapper/></Sidebar>
      <Chat><ChatWrapper/></Chat>
    </div>
  )
}












