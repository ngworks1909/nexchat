import { SocketProvider } from "@/providers/SocketProvider";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}