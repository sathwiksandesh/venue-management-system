import { useState } from "react";
import useVenue from "../hooks/useVenue";
import StaffDashboard from "../apps/StaffDashboard";
import AttendeeApp from "../apps/AttendeeApp";
import Header from "../components/Header";

export default function MainLayout() {
  const [mode, setMode] = useState("staff");

  // ✅ MAIN DATA SOURCE
  const venue = useVenue();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ✅ CORRECT HEADER */}
      <Header
        tick={venue.tick}
        paused={venue.paused}
        speed={venue.speed}
        metrics={venue.metrics}
        onTogglePause={() => venue.setPaused(p => !p)}
        onSpeedChange={venue.setSpeed}
      />

      {/* 🔁 MODE SWITCH BUTTON */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setMode(mode === "staff" ? "attendee" : "staff")}
          className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg"
        >
          Switch to {mode === "staff" ? "Attendee" : "Staff"}
        </button>
      </div>

      {/* ✅ PASS DATA PROPERLY */}
      {mode === "staff" ? (
        <StaffDashboard {...venue} />
      ) : (
        <AttendeeApp concessions={venue.concessions} />
      )}

    </div>
  );
}