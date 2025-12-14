import { NAVBAR_HEIGHT } from "@/lib/constants";

export default function BackgroundImage() {
  return (
    <div
      className="fixed left-0 right-0 -z-10"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/utah.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/20" />

    <div
  className="absolute inset-0 bg-gradient-to-b
  from-blue-200/30 
  via-transparent
  to-white/40"
/>
 {/* 40 80 */}
    </div>
  );
}
