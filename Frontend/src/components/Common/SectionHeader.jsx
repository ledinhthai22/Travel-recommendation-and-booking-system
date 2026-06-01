export default function SectionHeader({
  title,
  subtitle,
  action,       
  align = "center" 
}) {
  const isBetween = align === "between" && action;

  return (
    <div
      className={`mb-12 flex ${
        isBetween ? "justify-between items-center" : "flex-col items-center text-center"
      }`}
    >
      <div>
        {subtitle && (
          <span className="uppercase text-blue-600 font-light tracking-widest text-sm">
            {subtitle}
          </span>
        )}

        <h2 className="text-[36px] font-bold mt-3 uppercase">
          {title}
        </h2>
      </div>
      {isBetween && (
        <div className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
          {action}
        </div>
      )}
    </div>
  );
}