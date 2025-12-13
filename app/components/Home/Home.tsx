
import { NAVBAR_HEIGHT } from "@/lib/constants";
import BackgroundImage from "./Background";
import Searchtrip from "./Searchtrip";

export default function MainHome() {
  return (
    <>
      <BackgroundImage />

      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          marginTop: `${NAVBAR_HEIGHT}px`,
        }}
      >
         <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Searchtrip />
        </div>
      </div>
      </section>
    </>
  );
}
