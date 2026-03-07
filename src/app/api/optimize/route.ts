import { optimizeOrder } from "@/lib/tools/optimize-order";

export async function POST(req: Request) {
  try {
    const { projectId, bypassPending } = await req.json();

    if (!projectId) {
      return Response.json(
        { error: "projectId is required" },
        { status: 400 },
      );
    }

    const result = await optimizeOrder(projectId, bypassPending);

    return Response.json(result);
  } catch (err) {
    console.error("Optimize error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Optimization failed" },
      { status: 500 },
    );
  }
}
