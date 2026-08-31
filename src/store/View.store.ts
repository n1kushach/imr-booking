import type { View } from "@/types/view";
import { proxy } from "valtio";

export const ViewStore = proxy<{ view: View }>({
  view: "rooms",
});
