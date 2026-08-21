import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/auth.store'
import Button from '../../components/ui/Button'

const RESEND_SECONDS = 30

export default function OTPScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const phone = (location.state as { phone?: string })?.phone ?? ''
  const setUser = useAuthStore((s) => s.setUser)

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const [resending, setResending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  async function handleVerify() {
    if (otp.length < 6) return
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    })
    setLoading(false)
    if (error) {
      setError('Invalid code. Please try again.')
      setOtp('')
      return
    }
    if (data.user) {
      setUser(data.user)
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      if (profile) {
        navigate('/', { replace: true })
      } else {
        navigate('/onboarding/profile', { state: { phone }, replace: true })
      }
    }
  }

  async function handleResend() {
    setResending(true)
    await supabase.auth.signInWithOtp({ phone })
    setResending(false)
    setCountdown(RESEND_SECONDS)
    setOtp('')
    setError('')
  }

  function handleOtpChange(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 6)
    setOtp(digits)
    setError('')
    if (digits.length === 6) {
      // auto-submit
      setTimeout(() => {
        const btn = document.getElementById('verify-btn') as HTMLButtonElement
        btn?.click()
      }, 150)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <button
          onClick={() => navigate('/onboarding/phone')}
          className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-6 block"
        >
          ← Back
        </button>
        <div className="font-mono text-[13px] tracking-widest text-ink font-medium">
          PARKSAFE
        </div>
      </div>

      <div className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-3">
          Step 2 of 2
        </p>
        <h1 className="text-4xl font-semibold text-ink leading-tight mb-3">
          Enter the<br />6-digit code.
        </h1>
        <p className="font-mono text-[10px] text-gray-400 leading-relaxed mb-10">
          Sent to {phone}. Check your SMS.
        </p>

        {/* OTP input */}
        <div className="mb-3">
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
            Verification Code
          </div>
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(e) => handleOtpChange(e.target.value)}
            maxLength={6}
            className="w-full text-4xl font-bold text-ink tracking-[0.3em] border-b-2 border-ink pb-2 bg-transparent outline-none placeholder-gray-200"
          />
          {error && (
            <p className="font-mono text-[9px] text-zone-red mt-2">{error}</p>
          )}
        </div>

        {/* Resend */}
        <div className="mb-10">
          {countdown > 0 ? (
            <p className="font-mono text-[9px] text-gray-300">
              Resend code in {countdown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="font-mono text-[9px] uppercase tracking-widest text-ink underline disabled:opacity-40"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        <Button
          id="verify-btn"
          fullWidth
          size="lg"
          loading={loading}
          disabled={otp.length < 6}
          onClick={handleVerify}
        >
          Verify &amp; Continue
        </Button>
      </div>
    </div>
  )
}
