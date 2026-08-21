import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/auth.store'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const phone = (location.state as { phone?: string })?.phone ?? ''
  const { user, setProfile } = useAuthStore()

  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = fullName.trim().length >= 2

  async function handleSubmit() {
    if (!canSubmit || !user) return
    setError('')
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        phone: phone || user.phone,
        full_name: fullName.trim(),
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setProfile(data)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="font-mono text-[13px] tracking-widest text-ink font-medium">
          PARKSAFE
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-ink flex items-center justify-center mb-8">
          <span className="text-2xl">👋</span>
        </div>

        <h1 className="text-4xl font-semibold text-ink leading-tight mb-3">
          One last thing.
        </h1>
        <p className="font-mono text-[10px] text-gray-400 leading-relaxed mb-10">
          Tell us your name so space owners and enforcers can identify your bookings.
        </p>

        <div className="flex flex-col gap-6 mb-10">
          <Input
            label="Full Name"
            placeholder="Juan dela Cruz"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
            autoFocus
          />

          {/* Phone display — read only */}
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
              Mobile Number (verified)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zone-green" />
              <span className="font-medium text-sm text-ink">{phone}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="font-mono text-[9px] text-zone-red mb-4">{error}</p>
        )}

        <Button
          fullWidth
          size="lg"
          loading={loading}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Let's Go
        </Button>
      </div>
    </div>
  )
}
