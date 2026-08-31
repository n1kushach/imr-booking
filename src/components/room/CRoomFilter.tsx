import { Input } from "@/components/ui/input";
import { RoomsStore, type capacityFilter } from "@/store/Rooms.store";
import { useSnapshot } from "valtio";

const CRoomFilter = () => {
  const snapshot = useSnapshot(RoomsStore) as typeof RoomsStore;
  const capacities: capacityFilter[] = ["any", "small", "medium", "large"];
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Search rooms..."
        value={snapshot.search}
        onChange={(e) => (RoomsStore.search = e.target.value)}
        className="sm:max-w-xs"
      />
      <div className="flex gap-2">
        {capacities.map((cap) => (
          <button
            key={cap}
            onClick={() => (RoomsStore.capacityFilter = cap)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors capitalize ${
              snapshot.capacityFilter === cap
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {cap === "any"
              ? "All sizes"
              : cap === "small"
                ? "1–4"
                : cap === "medium"
                  ? "5–10"
                  : "11+"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CRoomFilter;
