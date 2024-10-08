import { createFileRoute, useParams } from "@tanstack/react-router";
import Trip from "@/components/Trip";
import { Trip as TripType, TripProps } from "@server/sharedTypes";
import { tripQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Define the type for the data fetched by the query
type TripData = TripType;

const TripPage = () => {
  // Ottieni il parametro tripId dalla route
  const params = useParams({ from: "/_authenticated/trips/$tripId" });
  const tripId = params.tripId;

  // Usa tripId per recuperare i dati
  const { data, isLoading, isError } = useQuery(tripQueryOptions(tripId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading trip details.</div>;
  }

  // Parsing the text field from the trip data
  let tripData: TripProps = {
    city: "",
    country: "",
    daysNumber: 0,
    description: "",
    history: "",
    itinerary: [],
  };

  const trip = data as unknown as TripData;

  try {
    if (typeof trip.text === "string" && isValidJSON(trip.text)) {
      tripData = JSON.parse(trip.text) as TripProps;
    } else {
      console.error("Invalid trip text:", trip.text);
    }
  } catch (error) {
    console.error("Error parsing trip text:", error);
  }

  console.log("tripData", tripData);
  function isValidJSON(text: string) {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Trip
      city={tripData.city}
      country={tripData.country}
      itinerary={tripData.itinerary}
      daysNumber={tripData.daysNumber}
      description={tripData.description}
      history={tripData.history}
    />
  );
};

// Usa il componente direttamente nella definizione della route
export const Route = createFileRoute("/_authenticated/trips/$tripId")({
  component: TripPage,
});
