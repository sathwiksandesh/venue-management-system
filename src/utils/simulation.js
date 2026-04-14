// Deterministic pseudo-random seeded by time bucket
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export const ZONES = [
  { id: 'N1', name: 'North Gate',    capacity: 8000,  x: 45, y: 8,  type: 'gate'     },
  { id: 'N2', name: 'North Stand',   capacity: 12000, x: 45, y: 20, type: 'stand'    },
  { id: 'E1', name: 'East Gate',     capacity: 6000,  x: 82, y: 45, type: 'gate'     },
  { id: 'E2', name: 'East Stand',    capacity: 10000, x: 72, y: 45, type: 'stand'    },
  { id: 'S1', name: 'South Gate',    capacity: 8000,  x: 45, y: 82, type: 'gate'     },
  { id: 'S2', name: 'South Stand',   capacity: 11000, x: 45, y: 70, type: 'stand'    },
  { id: 'W1', name: 'West Gate',     capacity: 6000,  x: 8,  y: 45, type: 'gate'     },
  { id: 'W2', name: 'West Stand',    capacity: 10000, x: 22, y: 45, type: 'stand'    },
  { id: 'C1', name: 'Concourse A',   capacity: 3000,  x: 35, y: 35, type: 'concourse'},
  { id: 'C2', name: 'Concourse B',   capacity: 3000,  x: 55, y: 35, type: 'concourse'},
  { id: 'C3', name: 'Concourse C',   capacity: 3000,  x: 55, y: 55, type: 'concourse'},
  { id: 'C4', name: 'Concourse D',   capacity: 3000,  x: 35, y: 55, type: 'concourse'},
  { id: 'F1', name: 'Food Court 1',  capacity: 1500,  x: 38, y: 28, type: 'food'     },
  { id: 'F2', name: 'Food Court 2',  capacity: 1500,  x: 58, y: 28, type: 'food'     },
  { id: 'F3', name: 'Food Court 3',  capacity: 1500,  x: 58, y: 62, type: 'food'     },
  { id: 'F4', name: 'Food Court 4',  capacity: 1500,  x: 38, y: 62, type: 'food'     },
  { id: 'M1', name: 'Medical Bay',   capacity: 200,   x: 30, y: 45, type: 'medical'  },
  { id: 'P1', name: 'Parking Zone A',capacity: 5000,  x: 45, y: 2,  type: 'parking'  },
  { id: 'P2', name: 'Parking Zone B',capacity: 5000,  x: 92, y: 45, type: 'parking'  },
  { id: 'PL', name: 'Playing Field', capacity: 0,     x: 45, y: 45, type: 'field'    },
]

export const CONCESSION_STANDS = [
  { id: 'CS1', name: 'Burger King — Stand 1',  zone: 'N2', items: ['Burger', 'Fries', 'Cola'],   avgWait: 4  },
  { id: 'CS2', name: 'Pizza Palace — Stand 2', zone: 'E2', items: ['Pizza', 'Garlic Bread'],       avgWait: 6  },
  { id: 'CS3', name: 'Hot Dog Express — 3',    zone: 'S2', items: ['Hot Dog', 'Nachos', 'Water'],  avgWait: 3  },
  { id: 'CS4', name: 'Drink Station — 4',      zone: 'W2', items: ['Beer', 'Juice', 'Soda'],       avgWait: 2  },
  { id: 'CS5', name: 'Snack Corner — 5',       zone: 'C1', items: ['Popcorn', 'Chips', 'Candy'],   avgWait: 2  },
  { id: 'CS6', name: 'Grill Zone — 6',         zone: 'C2', items: ['Steak Wrap', 'Grilled Corn'],  avgWait: 8  },
  { id: 'CS7', name: 'Coffee & Tea — 7',       zone: 'C3', items: ['Coffee', 'Tea', 'Muffin'],     avgWait: 3  },
  { id: 'CS8', name: 'Seafood Express — 8',    zone: 'C4', items: ['Fish & Chips', 'Prawn'],       avgWait: 7  },
]

export const GATES = [
  { id: 'G1', name: 'North Gate',  lanes: 8, zone: 'N1' },
  { id: 'G2', name: 'East Gate',   lanes: 6, zone: 'E1' },
  { id: 'G3', name: 'South Gate',  lanes: 8, zone: 'S1' },
  { id: 'G4', name: 'West Gate',   lanes: 6, zone: 'W1' },
]

export const INCIDENTS = [
  { id: 'I1', type: 'medical',    severity: 'medium', message: 'Medical assistance required at Section C-14',       zone: 'C2', time: '18:42' },
  { id: 'I2', type: 'crowd',      severity: 'high',   message: 'Crowd density exceeding 92% at North Stand',        zone: 'N2', time: '18:39' },
  { id: 'I3', type: 'queue',      severity: 'low',    message: 'Long queue detected at Food Court 2 — redirecting', zone: 'F2', time: '18:35' },
  { id: 'I4', type: 'security',   severity: 'medium', message: 'Unattended bag reported near West Gate entry',      zone: 'W1', time: '18:28' },
  { id: 'I5', type: 'crowd',      severity: 'low',    message: 'Congestion forming at East concourse exit',         zone: 'C2', time: '18:22' },
]

// Simulate realistic crowd occupancy for each zone
export function simulateZoneData(tick) {
  const matchProgress = (tick % 180) / 180  // 0–1 across a 3-hour match window
  const halfTimeBoost = Math.max(0, 1 - Math.abs(matchProgress - 0.5) * 8)  // spike at half-time

  return ZONES.map((zone, i) => {
    if (zone.type === 'field') return { ...zone, occupancy: 0, count: 0, status: 'clear', waitMin: 0 }

    const base = seededRand(i * 100 + Math.floor(tick / 10))
    const drift = seededRand(i * 200 + tick) * 0.08
    let level = 0

    switch (zone.type) {
      case 'gate':
        // Gates busy at start and end, quieter during match
        level = matchProgress < 0.15 ? 0.6 + base * 0.3
              : matchProgress > 0.85 ? 0.5 + base * 0.4
              : halfTimeBoost * 0.5 + base * 0.15
        break
      case 'stand':
        level = 0.7 + base * 0.25 + drift
        break
      case 'concourse':
        level = halfTimeBoost * 0.8 + matchProgress * 0.3 + base * 0.2
        break
      case 'food':
        level = halfTimeBoost * 0.9 + base * 0.3
        break
      case 'medical':
        level = 0.1 + base * 0.2
        break
      case 'parking':
        level = 0.6 + base * 0.3
        break
      default:
        level = base * 0.5
    }

    level = Math.min(0.99, Math.max(0.02, level))
    const count = Math.round(zone.capacity * level)
    const status = level > 0.85 ? 'critical' : level > 0.7 ? 'busy' : level > 0.4 ? 'moderate' : 'low'
    const waitMin = zone.type === 'gate' ? Math.round(level * 15)
                  : zone.type === 'food' ? Math.round(level * 20)
                  : 0

    return { ...zone, occupancy: level, count, status, waitMin }
  })
}

export function simulateGateData(tick) {
  return GATES.map((gate, i) => {
    const throughput = Math.round(80 + seededRand(i * 50 + tick) * 120)
    const queueLen   = Math.round(seededRand(i * 70 + tick + 5) * 80)
    const activeLanes = gate.lanes - Math.round(seededRand(i * 30 + tick) * 2)
    const waitMin    = Math.round(queueLen / (activeLanes * 15))
    const status     = waitMin > 8 ? 'critical' : waitMin > 4 ? 'busy' : 'normal'
    return { ...gate, throughput, queueLen, activeLanes, waitMin, status }
  })
}

export function simulateConcessionData(tick) {
  return CONCESSION_STANDS.map((stand, i) => {
    const base = seededRand(i * 40 + tick)
    const halfTimeMultiplier = 1 + (seededRand(tick * 0.1) > 0.6 ? 1.8 : 0)
    const queue = Math.round((base * 0.6 + 0.2) * 30 * halfTimeMultiplier)
    const waitMin = Math.round(queue / 3) + stand.avgWait
    const salesRate = Math.round(40 + base * 60)
    const status = waitMin > 12 ? 'critical' : waitMin > 7 ? 'busy' : 'normal'
    return { ...stand, queue, waitMin, salesRate, status }
  })
}

export function getMetrics(zones, tick) {
  const totalOccupancy = zones.filter(z => z.capacity > 0)
  const totalCap = totalOccupancy.reduce((s, z) => s + z.capacity, 0)
  const totalCount = totalOccupancy.reduce((s, z) => s + z.count, 0)
  const overallPct = Math.round((totalCount / totalCap) * 100)

  const criticalZones = zones.filter(z => z.status === 'critical').length
  const incidents = Math.round(seededRand(tick) * 3 + 1)
  const npsScore = Math.round(72 + seededRand(tick * 2) * 15)
  const avgWait = Math.round(3 + seededRand(tick * 3) * 8)

  return { overallPct, totalCount, totalCap, criticalZones, incidents, npsScore, avgWait }
}

export function getHistoricalFlow(tick) {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${6 + i}:00`,
    inflow: Math.floor(Math.random() * 3000),
    outflow: Math.floor(Math.random() * 2000),
    wait: Math.floor(Math.random() * 20),
    incidents: Math.floor(Math.random() * 4),
  }));
}

export function getWaitHistory(tick) {
  return Array.from({ length: 12 }, (_, i) => {
    const t = tick - (11 - i) * 2
    return {
      time: `${String(Math.floor((t / 60) % 24)).padStart(2,'0')}:${String(t % 60).padStart(2,'0')}`,
      gate: Math.round(2 + seededRand(i * 10 + t) * 10),
      food: Math.round(3 + seededRand(i * 20 + t) * 18),
      avg:  Math.round(2 + seededRand(i * 30 + t) * 10),
    }
  })
}