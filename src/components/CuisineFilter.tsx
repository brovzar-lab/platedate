interface CuisineFilterProps {
  cuisines: string[];
  selected: string;
  onSelect: (cuisine: string) => void;
}

export function CuisineFilter({ cuisines, selected, onSelect }: CuisineFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {cuisines.map((cuisine) => (
        <button
          key={cuisine}
          onClick={() => onSelect(cuisine)}
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            selected === cuisine
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-slate-600 shadow-sm hover:bg-rose-50'
          }`}
        >
          {cuisine}
        </button>
      ))}
    </div>
  );
}
