import { Button } from "@/components/ui/flow-hover-button";
import { ArrowRight } from "lucide-react";

export default function DemoOne() {
  return (
    <Button icon={<ArrowRight size={18} />} variant="dark">
      Hover Over Me
    </Button>
  );
}
