export default function SectionHeader({
    title,
    subtitle,
    action,
    align = "center"
}) {
    const isBetween = align === "between" && action;

    return (
        <div
            className={`mb-10 flex ${
                isBetween
                    ? "items-end justify-between"
                    : "flex-col items-center text-center"
            }`}
        >
            <div>
                {subtitle && (
                    <div
                        className={`mb-3 flex items-center gap-3 ${
                            isBetween
                                ? ""
                                : "justify-center"
                        }`}
                    >
                        <span className="h-px w-10 bg-sky-500" />

                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">
                            {subtitle}
                        </span>

                        <span className="h-px w-10 bg-sky-500" />
                    </div>
                )}

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {title}
                </h2>
            </div>

            {isBetween && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}