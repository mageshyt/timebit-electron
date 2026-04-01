import { RefreshCw } from "lucide-react";

export default function SystemFooter() {
  return (
    <footer className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <span>Terminal:</span>
          <span className="text-[#e4e4e6]">Idle</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>CPU:</span>
          <div className="w-16 h-1 bg-[#201f22] rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-[#8083ff]"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>MEM:</span>
          <div className="w-16 h-1 bg-[#201f22] rounded-full overflow-hidden">
            <div className="w-[30%] h-full bg-[#8083ff]"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 hover:text-[#e4e4e6] transition-colors">
          <RefreshCw className="h-3 w-3" />
          <span>Force Sync</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Global Node: US-EAST-1</span>
        </div>
      </div>
    </footer>
  );
}