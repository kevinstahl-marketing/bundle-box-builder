import { saveBuilderDraft } from "./builderPersistence.server";
import { syncBuilderMetaobject } from "./builderMetaobject.server";
import { syncBuilderProductMetafield } from "./builderProductMetafield.server";

export async function saveAndSyncBuilder({ shop, builder, admin }) {
  const savedBuilder = await saveBuilderDraft({
    shop,
    builder,
    admin,
  });


  const metaobject = await syncBuilderMetaobject({
    admin,
    builder: savedBuilder,
  });


  if (savedBuilder.productId) {
    const metafield = await syncBuilderProductMetafield({
      admin,
      productId: savedBuilder.productId,
      metaobjectId: metaobject.id,
    });

  }

  return {
    builder: savedBuilder,
    metaobject,
  };
}