import { QuickActionType } from "@/constants";
import SpotlightCard from "./ui/SpotlightCard";

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number) {
  let c = hex.trim();
  if (c[0] === "#") c = c.substring(1);
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})` as `rgba(${number}, ${number}, ${number}, ${number})`;
}

function ActionCard({
  action,
  onClick,
}: {
  action: QuickActionType;
  onClick: () => void;
}) {
  // Extract first color from gradient string
  const firstColor = action.gradient.split(",")[0].trim();
  // If it's a hex, convert to rgba, else fallback to a default
  const spotlightColor = firstColor.startsWith("#")
    ? hexToRgba(firstColor, 0.45)
    : ("rgba(59,130,246,0.45)" as `rgba(${number}, ${number}, ${number}, ${number})`);

  return (
    <SpotlightCard
      className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 border border-black/10 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10"
      spotlightColor={spotlightColor}
    >
      <div
        className="w-full h-full"
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        {/* Icon */}
        <div className="flex items-start justify-start mb-6">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
            style={{
              background: `linear-gradient(135deg, ${action.gradient})`,
            }}
          >
            <action.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
          </div>
        </div>
        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
          {action.title}
        </h3>
        {/* Description */}
        <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
          {action.description}
        </p>
      </div>
    </SpotlightCard>
  );
}

export default ActionCard;
