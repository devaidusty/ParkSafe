import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/auth.store'

export default function App() {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    // Resolve initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    // Keep store in sync on sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (!u) {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading])

  return <RouterProvider router={router} />
}
