import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'

function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  // 09XXXXXXXXX → +639XXXXXXXXX
  if (digits.startsWith('0') && digits.length === 11) return '+63' + digits.slice(1)
  // 9XXXXXXXXX (10 digits) → +639XXXXXXXXX
  if (digits.length === 10 && digits.startsWith('9')) return '+63' + digits
  // already has country code
  if (digits.startsWith('63') && digits.length === 12) return '+' + digits
  return '+63' + digits
}

function isValidPH(raw: string): boolean {
  const d = raw.replace(/\D/g, '')
  return (
    (d.startsWith('09') && d.length === 11) ||
    (d.startsWith('9') && d.length === 10) ||
    (d.startsWith('639') && d.length === 12) ||
    (d.startsWith('63') && d.length === 12)
  )
}

export default function PhoneScreen() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    setError('')
    setLoading(true)
    const e164 = toE164(phone)
    const { error } = await supabase.auth.signInWithOtp({ phone: e164 })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/onboarding/otp', { state: { phone: e164 } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="font-mono text-[11px] tracking-widest uppercase text-gray-400 mb-1">
          Lucena City · Quezon
        </div>
        <div className="font-mono text-[13px] tracking-widest text-ink font-medium">
          PARKSAFE
        </div>
      </div>

      {/* Body */}
      <div className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-3">
          Step 1 of 2
        </p>
        <h1 className="text-4xl font-semibold text-ink leading-tight mb-3">
          Enter your<br />phone number.
        </h1>
        <p className="font-mono text-[10px] text-gray-400 leading-relaxed mb-10">
          We'll send a one-time code to verify your number. No password needed.
        </p>

        {/* Phone input */}
        <div className="mb-2">
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
            Mobile Number
          </div>
          <div className="flex items-center border-b-2 border-ink pb-2 gap-3">
            <span className="font-mono text-lg text-gray-400 shrink-0">+63</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="917 123 4567"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && isValidPH(phone) && handleSend()}
              className="flex-1 text-2xl font-semibold text-ink bg-transparent outline-none placeholder-gray-200 tracking-wide"
              autoFocus
            />
          </div>
          {error && (
            <p className="font-mono text-[9px] text-zone-red mt-2">{error}</p>
          )}
        </div>

        <p className="font-mono text-[9px] text-gray-300 mb-10">
          Enter the last 10 digits of your Globe, Smart, or DITO number
        </p>

        <Button
          fullWidth
          size="lg"
          loading={loading}
          disabled={!isValidPH(phone)}
          onClick={handleSend}
        >
          Send Code
        </Button>
      </div>

      <p className="font-mono text-[9px] text-gray-300 text-center leading-relaxed mt-8">
        By continuing you agree to ParkSafe's Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
