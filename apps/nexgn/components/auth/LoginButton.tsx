"use client"

import { useAuthState } from '@/atoms/AuthState'
import { useOtpState } from '@/atoms/OtpState'
import { Button } from '@/components/ui/button'
import { createSchema, loginSchema } from '@/zod/validateUser'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'


export default function LoginButton({type}: Readonly<{type: "login" | "signup" | "details"}>) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {setStatus} = useOtpState()
  const {username, email, password, setState} = useAuthState()

  const handleSignup = async() => {
    if(!createSchema.safeParse({email}).success){
      toast.error("Please enter a valid email.")
      return;
    }
    const response = await fetch('/api/auth/create-user', {
      method: 'POST',
      body: JSON.stringify({email})
    })
    const json = await response.json();
    if(json.success){
      setStatus(true);
      toast.success(json.message, {
        style: {
        background: "#15803d", // green-700
        color: "white",
        border: "1px solid #166534", // green-800
      },
      })
    }
    else{
      toast.error(json.message)
    }
  }

  const handleLogin = async() => {
    if(!loginSchema.safeParse({email, password}).success){
      toast.error('Please enter a valid email and password.')
      return;
    }
    const response = await signIn('credentials', {email: email, password: password, redirect: false});
    if(response?.ok){
      setState({password: ''})
      toast.success("Login successful!", {
        style: {
        background: "#15803d", // green-700
        color: "white",
        border: "1px solid #166534", // green-800
      },
      })
      router.push(`/`);
      router.refresh()
    }
    else{
      toast.error('Please enter a valid email and password.')
    }
  }

  const handleDetails = async() => {
    const authId = sessionStorage.getItem("authId");
    if(!authId){
      setStatus(false)
      toast.error("Something went wrong. Please try again.")
      return;
    }
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({authId, username, password})
    });
    const json = await response.json();
    if(json.success){
      sessionStorage.removeItem("authId");
      setIsLoading(false)
      toast.success(json.message, {
        style: {
        background: "#15803d", // green-700
        color: "white",
        border: "1px solid #166534", // green-800
      },
      })
      setState({password: ''})
      router.push('/login')
    }
    else{
      toast.error(json.message)
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (type === "signup") {
      await handleSignup()
    } else if (type === "login") {
      await handleLogin()
    } else {
      await handleDetails()
    }
    setIsLoading(false)
  }

  const getType = () => {
    return type === "login" ? "Login" : "Signup"
  }

  return (
    <Button
      type='submit'
      onClick={handleClick}
      variant={"default"}
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
           <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {type === "login" ? "Logging in..." : "Signing up..."}
        </>
      ) : (
        getType()
      )}
    </Button>
  )
}

