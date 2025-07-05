import { createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h3>Togglin!</h3>
			<ModeToggle />
		</div>
	);
}
