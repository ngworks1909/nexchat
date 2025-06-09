"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowRight, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { verifySchema } from '@/zod/validateUser'
import { useAuthState } from '@/atoms/AuthState'
import { useOtpState } from '@/atoms/OtpState'
import { toast } from 'sonner'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 120 // 2 minutes in seconds

export default function OTPModal() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [activeIndex, setActiveIndex] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const {status, setStatus} = useOtpState()
  const {email} = useAuthState()

  useEffect(() => {
    if (!canResend) {
      const timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [canResend])

  const verifyOTP = async () => {
    const joinedOtp = otp.join('');
    if(!verifySchema.safeParse({email, otp: joinedOtp}).success){
      toast('Please enter a valid OTP.')
      return
    }
    setIsVerifying(true)
    // Simulate OTP verification
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({email, otp: joinedOtp})
    })
    const json = await response.json();
    if(json.success){
      setIsVerifying(false)
      setStatus(false)
      sessionStorage.setItem("authId", json.authId);

      toast.success('OTP verified successfully!')
      router.push('/details');
    }
    else{
      setIsVerifying(false)
      toast.error(json.message)
    }
  }

  useEffect(() => {
    if (otp.every(digit => digit !== '') && otp.length === OTP_LENGTH) {
      verifyOTP()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value && index < OTP_LENGTH - 1) {
        setActiveIndex(index + 1)
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      if (newOtp[index]) {
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        newOtp[index - 1] = ''
        setOtp(newOtp)
        setActiveIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleResend = async () => {
    if (canResend) {
      // Simulate resend OTP
      toast.success('OTP Sent to your email.')
      setOtp(Array(OTP_LENGTH).fill(''))
      setActiveIndex(0)
      inputRefs.current[0]?.focus()
      setCanResend(false)
      setCooldownTime(RESEND_COOLDOWN)
    }
  }

  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={status} onOpenChange={setStatus}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Verify Your Identity</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-black" />
          </div>
          <p className="text-center text-sm text-gray-600">
            {`We've sent a 6-digit code to your email. Please enter it below to verify your identity.`}
          </p>
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center text-2xl font-bold"
                autoFocus={index === activeIndex}
                disabled={isVerifying}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-4 mt-4">
          <Button
            onClick={handleResend}
            disabled={!canResend || isVerifying}
            variant="outline"
            className="w-full"
          >
            {isVerifying ? (
              <>Verifying...</>
            ) : (
              <>
                {canResend ? (
                  <>RESEND OTP</>
                ) : (
                  <>
                    Resend in {formatTime(cooldownTime)}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

