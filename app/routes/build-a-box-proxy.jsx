import { authenticate } from "../shopify.server";
import { getBuilders } from "../services/builder.server";

export async function loader({ request }) {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return Response.json({ builders: [] }, { status: 400 });
  }

  const builders = await getBuilders(shop);

  return Response.json({ builders });
}


