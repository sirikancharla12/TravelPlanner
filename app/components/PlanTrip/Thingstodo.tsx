type ThingsToDoType = {
  morning: string
  afternoon: string
  evening: string
}

export default function ThingsToDo({ things }: { things: ThingsToDoType }) {
  return (
    <>
      <h3>Things to do</h3>
      <h4>🌅 Morning</h4>
      <p>{things.morning}</p>
      <h4>🌇 Afternoon</h4>
      <p>{things.afternoon}</p>
      <h4>🌃 Evening</h4>
      <p>{things.evening}</p>
    </>
  )
}
