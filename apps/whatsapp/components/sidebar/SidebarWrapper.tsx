"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogOut, MoreVertical, PlusCircle, Search, UserPlus, Users } from 'lucide-react';

import { ScrollArea } from '../ui/scroll-area';
import UserSearchInput from './UserSearchInput';
import Chats from './Chats';
import NotificationBanner from './NotificationBanner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Logout from './Logout';
import DropNavigator from './DropNavigator';
import PlusButton from './PlusButton';
import { useContacts } from '@/hooks/useContacts';

export default function SidebarWrapper() {
  const {loading, contacts} = useContacts()
  return (
    <>
      <div className="h-16 p-3 flex items-center justify-between border-b">
            <Link href={'/'} className="text-xl text-emerald-500 font-semibold">NexGN</Link>
          <div className="flex items-center gap-2">
            <PlusButton/>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='rounded-full focus-visible:ring-0 focus-visible:ring-offset-0' size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-56 min-w-48" align="end">
                <DropNavigator text='Profile'/>
                <DropNavigator text='Friends'/>
                <DropNavigator text='Requests'/>
                <DropdownMenuSeparator />
                <Logout/>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start gap-2 p-3 h-auto bg-background border-b">
            <TabsTrigger value="all" className="rounded-full px-3 py-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-primary-foreground">All</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-full px-3 py-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-primary-foreground">Unread</TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full px-3 py-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-primary-foreground">Favorites</TabsTrigger>
            <TabsTrigger value="groups" className="rounded-full px-3 py-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-primary-foreground">Groups</TabsTrigger>
          </TabsList>

          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <UserSearchInput />
            </div>
          </div>

          <TabsContent value="all" className="flex-1 m-0">
            <ScrollArea className="h-[75dvh]">
              <div className="flex flex-col">
                <NotificationBanner />
                {!loading && <Chats contacts = {contacts}/>}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
    </>
  )
}






  
  

