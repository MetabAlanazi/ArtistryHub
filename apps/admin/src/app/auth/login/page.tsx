'use client'

import { useState, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@artistry-hub/ui'
import { Input } from '@artistry-hub/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@artistry-hub/ui'
import { Alert, AlertDescription } from '@artistry-hub/ui'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already authenticated
  if (status === 'authenticated' && session?.user) {
    const redirectUrl = searchParams.get('redirect') || '/dashboard'
    router.replace(redirectUrl)
    return null
  }

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    setIsSubmitting(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        appName: 'admin', // Specify this is for admin app
        redirectUrl: searchParams.get('redirect') || '/dashboard',
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        setMessage('Sign in successful! Redirecting...')
        // Redirect to the intended destination
        const redirectUrl = searchParams.get('redirect') || '/dashboard'
        setTimeout(() => {
          router.replace(redirectUrl)
        }, 1000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            Admin Portal Login
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <div className="text-center">
              <Link
                href="http://localhost:3000/store"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Main Store
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
