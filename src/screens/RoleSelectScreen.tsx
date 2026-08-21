import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { supabase } from '../lib/supabase'

const roles = [
  {
    id: 'driver',
    label: 'Driver',
    icon: '🚗',
    desc: 'Find and book legal parking near you.',
    path: '/driver/map',
    color: 'bg-ink text-white',
  },
  {
    id: 'owner',
    label: 'Space Owner',
    icon: '🏢',
    desc: 'List your space and earn from idle capacity.',
    path: '/owner',
    color: 'bg-white border border-gray-200 text-ink',
  },
  {
    id: 'enforcer',
    label: 'Enforcer',
    icon: '🛡',
    desc: 'Check if a vehicle is legally parked.',
    path: '/enforcer',
    color: 'bg-white border border-gray-200 text-ink',
  },
]

export default function RoleSelectScreen() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuthStore()

  async function handleSignOut() {
    await supabase.auth.signOut()
    signOut()
    navigate('/onboarding/phone', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-gray-400 mb-1">
            Lucena City · Quezon
          </div>
          <div className="font-mono text-[13px] tracking-widest text-ink font-medium">
            PARKSAFE
          </div>
        </div>
        {profile && (
          <div className="text-right">
            <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
              {profile.full_name}
            </div>
            <button
              onClick={handleSignOut}
              className="font-mono text-[9px] text-gray-300 uppercase tracking-widest underline hover:text-ink mt-0.5"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="-mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">
          Select your role
        </p>
        <h1 className="text-4xl font-semibold text-ink leading-tight mb-10">
          Who are<br />you today?
        </h1>

        <div className="flex flex-col gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`w-full text-left p-5 flex items-center gap-4 transition-opacity hover:opacity-80 active:opacity-60 ${role.color}`}
            >
              <span className="text-2xl">{role.icon}</span>
              <div>
                <div className="font-semibold text-base leading-tight">{role.label}</div>
                <div
                  className={`font-mono text-[10px] tracking-wide mt-0.5 ${
                    role.id === 'driver' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {role.desc}
                </div>
              </div>
              <span className="ml-auto text-gray-300 text-lg">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="font-mono text-[9px] text-gray-300 tracking-wide text-center">
        PROTOTYPE · MOCK DATA · LUCENA 2026
      </div>
    </div>
  )
}
