import { useNavigate } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Activities from "./Activities"
import TravelDays from "./TravelDays"
import { CityCombobox } from "@/components/CityCombobox"
import BackButton from "./BackButton"
import { clientApi, getCity, addTrip } from "@/lib/api"
import { toast } from "sonner"
import { useState, useEffect } from "react"

const formSchema = z
  .object({
    city: z.string().min(1, "City is required"),
    days: z.number().min(1, "Number of days must be at least 1"),
    activities: z.array(z.string()).optional(), // Make activities optional
    other: z.string().optional(), // Optional field
  })
  .refine(
    (data) =>
      (data.activities && data.activities.length > 0) || // Activities can be optional
      (data.other && data.other.trim().length > 0), // Other must be non-empty if no activities are selected
    {
      message:
        "You must select at least one activity or provide other information.",
      path: ["activities"], // Error message for activities if validation fails
    }
  )

type FormSchemaType = z.infer<typeof formSchema>

export default function TripForm() {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      days: 1,
      activities: [],
      other: "",
    },
  })

  const { setValue, handleSubmit, control, watch } = form

  const activitiesValue = watch("activities")
  const daysValue = watch("days")

  useEffect(() => {
    if (selectedCity) {
      setValue("city", selectedCity)
    } else {
      setValue("city", "") // Set city to an empty string if it's null, triggering validation
    }
  }, [selectedCity, setValue])

  async function fetchOrCreateCity(city: string, country: string) {
    try {
      const cityJson = await getCity(city)

      if (cityJson) {
        return cityJson
      }

      const postCityRes = await clientApi.cities.$post({
        json: {
          name: city,
          country: country,
        },
      })

      return await postCityRes.json()
    } catch (error) {
      console.error("Error fetching or creating city:", error)
      throw new Error("Failed to fetch or create city")
    }
  }

  async function onSubmit(values: FormSchemaType) {
    setIsSubmitting(true)
    try {
      const [city, country] = values.city.split(",")
      const cityJson = await fetchOrCreateCity(city, country)

      if (!cityJson) {
        console.error("City not found or failed to create")
        return
      }

      const newTrip = await addTrip({
        city_id: `${cityJson.id}`,
        days: values.days,
        activities: values.activities,
        other: values.other,
      })

      if (!newTrip) {
        return toast("Error creating trip", {
          description: "An error occurred while creating the trip",
        })
      }

      toast("Trip Created", {
        description: "Successfully created a new trip to " + city,
      })

      navigate({
        to: "/trips/$tripId",
        params: { tripId: newTrip.id.toString() },
      })
    } catch (error) {
      toast("Error creating trip", {
        description: "An error occurred while creating the trip",
      })
      console.error("Error creating trip:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-full max-h-full pb-20">
      <div className="container mx-auto mt-8">
        <div className="sm:w-2/3 xl:w-1/2 mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
            Customize Your Travel Experience
          </h1>
          <p className="text-gray-500 mb-8">
            Provide us with some key details, and our trip planner will craft a
            personalized itinerary designed to give you unforgettable travel
            experience.
          </p>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="space-y-6">
                <FormField
                  name="city"
                  control={control}
                  render={() => (
                    <FormItem>
                      <FormLabel>Where do you want to go?</FormLabel>
                      <FormControl>
                        <CityCombobox
                          setSelectedCity={setSelectedCity}
                          selectedCity={selectedCity}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-6">
                <FormField
                  name="days"
                  control={control}
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        How many days will you be traveling?
                      </FormLabel>
                      <FormControl>
                        <TravelDays setValue={setValue} value={daysValue} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-6">
                <FormField
                  name="activities"
                  control={control}
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        What activities are you excited about?
                      </FormLabel>
                      <FormControl>
                        <Activities
                          setValue={setValue}
                          value={activitiesValue}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full justify-between">
                <BackButton />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
