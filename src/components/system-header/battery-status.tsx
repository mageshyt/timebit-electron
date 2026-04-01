import { useEffect, useState } from "react";
import { BatteryCharging, BatteryFull } from "lucide-react";

export function BatteryStatus() {
  const [level, setLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if ("getBattery" in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).getBattery().then((battery: any) => {
        setLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener("levelchange", () => {
          setLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener("chargingchange", () => {
          setIsCharging(battery.charging);
        });
      });
    }
  }, []);

  if (level === null) {
    return (
      <div className="flex items-center space-x-2">
        <BatteryFull className="h-3 w-3 text-[#c0c1ff]/50" />
        <span className="text-[#8e8d92]/50">--%</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {isCharging ? (
        <BatteryCharging className="h-3 w-3 text-emerald-400" />
      ) : (
        <BatteryFull className="h-3 w-3 text-[#c0c1ff]" />
      )}
      <span>{level}%</span>
    </div>
  );
}