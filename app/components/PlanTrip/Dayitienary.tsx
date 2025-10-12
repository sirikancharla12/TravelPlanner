import CheapestStay from "./cheapeststay"
import DayCost from "./Daycost"
import HowToGetThere from "./HowTogetthere"
import Overview from "./Overview"
import ThingsToDo from "./Thingstodo"


type ThingsToDoType = {
  morning: string
  afternoon: string
  evening: string
}

export type DayPlan = {
  day: string
  title: string
  overview: string
  howToGetThere: string
  cheapestStay: string
  thingsToDo: ThingsToDoType
  totalCost: string
}

export default function DayItinerary({ dayPlan }: { dayPlan: DayPlan }) {
  return (
    <div className="prose max-w-none my-8">
      <h2 className="text-2xl font-bold mb-2">{dayPlan.day} - {dayPlan.title}</h2>

      <Overview text={dayPlan.overview} />
      <HowToGetThere text={dayPlan.howToGetThere} />
      <CheapestStay text={dayPlan.cheapestStay} />
      <ThingsToDo things={dayPlan.thingsToDo} />
      <DayCost cost={dayPlan.totalCost} />
    </div>
  )
}
