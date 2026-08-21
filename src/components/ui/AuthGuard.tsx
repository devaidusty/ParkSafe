import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/auth.store'

interface Props {
  children: React.ReactNode
}

export default function AuthGuard({ children }: Props) {
  const navigate = useNavigate()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/onboarding/phone', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-300">
          Loading...
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
