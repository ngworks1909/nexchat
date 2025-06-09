import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Field from "./Field"
import LoginButton from "./LoginButton"
import OtpModal from "./OtpModal"

export default function Auth({type} : Readonly<{type: "login" | "signup" | "details"}>) {
  const getTitle = () => {
    if(type === "signup") return "Sign Up"
    if(type === "login") return "Login"
    return "Complete Your Profile"
  }

  const getDescription = () => {
    if(type === "signup") return "Create an account to start chatting"
    if(type === "login") return "Welcome back! Let's get you chatting"
    return "Just a few more details to get you started"
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Magic UI Dot Pattern for entire page */}
      <div className="absolute inset-0 z-0 opacity-50">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#94a3b8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{getTitle()}</CardTitle>
            <CardDescription className="text-center">
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {(type === "login" || type === "signup") && 
                <Field type="email" name="email" placeholder="Enter your email" label="Email" />
              }
              {type === "details" && 
                <Field type="text" name="username" placeholder="Enter your name" label="Name" />
              }
              {(type === "login" || type === "details") && 
                <Field type="password" name="password" placeholder="Enter your password" label="Password" />
              }
              <LoginButton type={type} />
            </form>
          </CardContent>
          <CardFooter>
            {type === "signup" ? (
              <p className="text-center text-sm text-gray-600 mt-2 w-full">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            ) : type === "login" && (
              <p className="text-center text-sm text-gray-600 mt-2 w-full">
                {`Don't have an account?`}{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-200/80 backdrop-blur-sm p-8 relative z-10">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">Welcome to NexGN Chat</h2>
          <p className="text-xl mb-8">Connect with friends and make new ones in our next-generation chat platform.</p>
          <blockquote className="text-xl italic mt-4">
            {`"NexGN Chat has revolutionized the way I communicate with my team. It's fast, intuitive, and packed with features!"`}
            <footer className="mt-2 font-semibold">- Nithin Kumar, Tech Enthusiast</footer>
          </blockquote>
        </div>
      </div>
      <OtpModal />
    </div>
  )
}

