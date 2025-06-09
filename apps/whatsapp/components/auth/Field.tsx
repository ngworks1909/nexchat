"use client"

import { ChangeEvent, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AuthState } from '@/atoms/AuthState'

type PropTypes = {
  type: string,
  name: "email" | "password" | "username",
  placeholder: string,
  label: string,
}

const getIcon = (name: string) => {
  if (name === "username") return <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />;
  if (name === "email") return <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />;
  return <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />;
};

const getInputType = (name: string, type: string, showPassword: boolean) => {
  if (name !== "password") return type;
  return showPassword ? "text" : "password";
}

export default function Field({type, placeholder, name, label}: Readonly<PropTypes>) {
  const [showPassword, setShowPassword] = useState(false)
  const user = useRecoilValue(AuthState);
  const setUser = useSetRecoilState(AuthState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let val = e.target.value;
    setUser(prevUser => ({...prevUser, [name]:val}));
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {getIcon(name)}
        <Input
          id={name}
          placeholder={placeholder}
          type={getInputType(name, type, showPassword)}
          value={user[name]}
          onChange={handleChange}
          className="pl-10"
          required
        />
        {name === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
