import { createContext, useContext } from "react";
import useVenue from "../hooks/useVenue";

const VenueContext = createContext(null);

export const VenueProvider = ({ children }) => {
  const venue = useVenue();

  return (
    <VenueContext.Provider value={venue}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenueContext = () => {
  const context = useContext(VenueContext);

  if (!context) {
    throw new Error("useVenueContext must be used inside VenueProvider");
  }

  return context;
};