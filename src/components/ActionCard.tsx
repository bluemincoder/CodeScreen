import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";

function ActionCard({
    action,
    onClick,
}: {
    action: QuickActionType;
    onClick: () => void;
}) {
    return (
        <Card
            className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer h-full"
            onClick={onClick}
        >
            {/* ABSOLUTE GRADIENT BACKGROUND */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(to bottom right, ${action.gradient})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.5,
                    pointerEvents: "none",
                }}
            />

            {/* CONTENT */}
            <div className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col h-full">
                <div className="space-y-2 sm:space-y-3">
                    {/* ICON */}
                    <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 group-hover:scale-110 transition-transform`}
                    >
                        <action.icon
                            className={`h-5 w-5 sm:h-6 sm:w-6 text-white`}
                        />
                    </div>

                    {/* TITLE + DESCRIPTION */}
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg sm:text-xl group-hover:text-primary transition-colors">
                            {action.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {action.description}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ActionCard;
