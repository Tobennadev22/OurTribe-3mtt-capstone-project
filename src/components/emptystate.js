import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./ui/empty";
import { Button } from "./ui/button";
import { Cloud } from "lucide-react";

export function EmptyOutline() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Cloud />
        </EmptyMedia>
        <EmptyTitle>Activity Empty</EmptyTitle>
        <EmptyDescription>You have no active activity here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Create
        </Button>
      </EmptyContent>
    </Empty>
  );
}
