import { useState, useEffect, useCallback, useRef } from 'react'
import {
  simulateZoneData,
  simulateGateData,
  simulateConcessionData,
  getMetrics,
  getHistoricalFlow,
  getWaitHistory,
  INCIDENTS
} from '../utils/simulation'

export default function useVenue() {
  const [tick, setTick] = useState(720) // start at noon
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)

  // ✅ SAFE INITIAL STATE
  const [alerts, setAlerts] = useState(
    Array.isArray(INCIDENTS) ? INCIDENTS : []
  )

  const rafRef = useRef(null)
  const lastRef = useRef(null)

  // ⏱️ Live simulation tick
  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [paused, speed])

  // ✅ SAFE DATA (fallbacks added)
  const zones = simulateZoneData(tick) || []
  const gates = simulateGateData(tick) || []
  const concessions = simulateConcessionData(tick) || []
  const metrics = getMetrics(zones, tick) || {}
  const flowHistory = getHistoricalFlow(tick) || []
  const waitHistory = getWaitHistory(tick) || []

  // 🗑️ Remove alert safely
  const dismissAlert = useCallback((id) => {
    setAlerts(prev => (prev || []).filter(a => a.id !== id))
  }, [])

  // ➕ Add alert safely
  const addAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...(prev || [])].slice(0, 10))
  }, [])

  // 🚨 Simulate random alerts
  useEffect(() => {
    if (tick % 45 === 0) {
      const randomAlerts = [
        {
          type: 'crowd',
          severity: 'high',
          message: `Crowd surge detected at Zone ${['N2','E2','S2','W2'][tick % 4]}`,
          zone: ['N2','E2','S2','W2'][tick % 4],
          time: `${String(Math.floor(tick / 60) % 24).padStart(2, '0')}:${String(tick % 60).padStart(2, '0')}`
        },
        {
          type: 'queue',
          severity: 'medium',
          message: `Queue building at Gate ${['G1','G2','G3','G4'][tick % 4]} — opening lane`,
          zone: ['N1','E1','S1','W1'][tick % 4],
          time: `${String(Math.floor(tick / 60) % 24).padStart(2, '0')}:${String(tick % 60).padStart(2, '0')}`
        },
        {
          type: 'info',
          severity: 'low',
          message: 'Concession pre-order system reducing wait times by 34%',
          zone: 'F1',
          time: `${String(Math.floor(tick / 60) % 24).padStart(2, '0')}:${String(tick % 60).padStart(2, '0')}`
        },
      ]

      const r = randomAlerts[tick % randomAlerts.length]

      // ✅ UNIQUE + SAFE ID
      addAlert({
        ...r,
        id: `alert-${tick}-${Date.now()}`
      })
    }
  }, [tick, addAlert])

  return {
    tick,
    paused,
    speed,
    zones,
    gates,
    concessions,
    metrics,
    flowHistory,
    waitHistory,
    alerts,
    setPaused,
    setSpeed,
    dismissAlert,
  }
}