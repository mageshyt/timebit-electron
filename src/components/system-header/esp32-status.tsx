import { Radio } from "lucide-react";

export function Esp32Status() {
  return (
    <div className="flex items-center space-x-2">
      <Radio className="h-3 w-3" />
      <span>ESP32: Connected (v1.0.4)</span>
    </div>
  );
}