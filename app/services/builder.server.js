import prisma from "../db.server";
import { syncBuilderMetaobject } from "./builderMetaobject.server";
import { syncBuilderProductMetafield } from "./builderProductMetafield.server";

export async function saveBuilderDraft({ shop, builder, admin }) {
  const resolvedOptionsByStepId = await resolveStepOptionsByStepId({
    admin,
    steps: builder.steps ?? [],
  });

  await prisma.$transaction(async (tx) => {
    await tx.builder.update({
      where: {
        id: builder.id,
        shop,
      },
      data: {
        name: builder.name,
        mode: builder.mode,
        status: builder.status || "draft",

        productId: builder.productId || null,
        productTitle: builder.productTitle || null,
        productHandle: builder.productHandle || null,
        productImage: builder.productImage || null,

        ruleType: builder.ruleType || "NONE",
        minSelections: builder.minSelections ?? null,
        maxSelections: builder.maxSelections ?? null,
        exactSelections: builder.exactSelections ?? null,
      },
    });

    await syncBuilderSteps(tx, {
      builderId: builder.id,
      steps: builder.steps ?? [],
      resolvedOptionsByStepId,
    });
  });

  return getBuilder(builder.id, shop);
}

async function resolveStepOptionsByStepId({ admin, steps }) {
  const resolvedOptionsByStepId = {};

  if (!admin) return resolvedOptionsByStepId;

  for (const step of steps) {
    const resolvedOptions = await resolveStepOptions(admin, step);

    if (resolvedOptions) {
      resolvedOptionsByStepId[step.id] = resolvedOptions;
    }
  }

  return resolvedOptionsByStepId;
}

async function resolveStepOptions(admin, step) {
  if (!step.sourceType) return null;

  if (step.sourceType === "TAG" && step.sourceValue) {
    const products = await getProductsByTag(admin, step.sourceValue);
    return mapProductsToOptions(products);
  }

  if (step.sourceType === "COLLECTION" && step.sourceValue) {
    const products = await getProductsByCollection(admin, step.sourceValue);
    return mapProductsToOptions(products);
  }

  if (step.sourceType === "ALL_PRODUCTS") {
    const products = await getAllProducts(admin);
    return mapProductsToOptions(products);
  }

  return null;
}

function mapProductsToOptions(products) {
  return products.map((product, index) => ({
    title: product.title,
    position: index,
    type: "PRODUCT",

    productId: product.id,
    variantId: null,

    productTitle: product.title,
    variantTitle: null,

    image: product.featuredImage?.url ?? null,
    priceAdjustment: null,
  }));
}

async function syncBuilderSteps(
  tx,
  { builderId, steps, resolvedOptionsByStepId },
) {

  //removes creates an array of IDs falsey steps
  const existingStepIds = steps.map((step) => step.id).filter(Boolean);

  await tx.builderStep.deleteMany({
    where: {
      builderId,
      id: {
        notIn: existingStepIds.length ? existingStepIds : ["__none__"],
      },
    },
  });

  for (const [index, step] of steps.entries()) {
    const stepData = {
      title: step.title,
      position: index,
      minSelections: Number(step.minSelections ?? 0),
      maxSelections:
        step.maxSelections === "" || step.maxSelections == null
          ? null
          : Number(step.maxSelections),
      isRequired: step.isRequired ?? true,
      isVisible: step.isVisible ?? true,
      sourceType: step.sourceType ?? "SPECIFIC_PRODUCTS",
      sourceValue: step.sourceValue || null,
    };

    const savedStep = step.id
      ? await tx.builderStep.update({
          where: { id: step.id },
          data: stepData,
        })
      : await tx.builderStep.create({
          data: {
            builderId,
            ...stepData,
          },
        });

    const resolvedOptions = resolvedOptionsByStepId?.[step.id];

    await syncBuilderOptions(tx, {
      stepId: savedStep.id,
      options: resolvedOptions ?? step.options ?? [],
    });
  }
}

async function syncBuilderOptions(tx, { stepId, options }) {
  const existingOptionIds = options.map((option) => option.id).filter(Boolean);

  await tx.builderOption.deleteMany({
    where: {
      stepId,
      id: {
        notIn: existingOptionIds.length ? existingOptionIds : ["__none__"],
      },
    },
  });

  for (const [index, option] of options.entries()) {
    const optionData = {
      title: option.title || option.productTitle || "Untitled option",
      position: option.position ?? index,
      type: option.type ?? "PRODUCT",

      productId: option.productId || null,
      variantId: option.variantId || null,
      productTitle: option.productTitle || null,
      variantTitle: option.variantTitle || null,
      image: option.image || null,

      priceAdjustment:
        option.priceAdjustment === "" || option.priceAdjustment == null
          ? null
          : Number(option.priceAdjustment),
    };

    if (option.id) {
      await tx.builderOption.update({
        where: { id: option.id },
        data: optionData,
      });
    } else {
      await tx.builderOption.create({
        data: {
          stepId,
          ...optionData,
        },
      });
    }
  }
}

async function getProductsByTag(admin, tag) {
  return getProductsByQuery(admin, `tag:${JSON.stringify(tag)}`);
}

async function getAllProducts(admin) {
  return getProductsByQuery(admin, "");
}

async function getProductsByQuery(admin, query) {
  const response = await admin.graphql(
    `#graphql
    query Products($query: String) {
      products(first: 50, query: $query) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
        }
      }
    }`,
    {
      variables: {
        query,
      },
    },
  );

  const payload = await response.json();

  return payload.data?.products?.nodes ?? [];
}

async function getProductsByCollection(admin, collectionId) {
  const response = await admin.graphql(
    `#graphql
    query CollectionProducts($id: ID!) {
      collection(id: $id) {
        products(first: 50) {
          nodes {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }`,
    {
      variables: {
        id: collectionId,
      },
    },
  );

  const payload = await response.json();

  return payload.data?.collection?.products?.nodes ?? [];
}

export async function getBuilders(shop) {
  return prisma.builder.findMany({
    where: { shop },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getBuilder(id, shop) {
  return prisma.builder.findUnique({
    where: { id, shop },
    include: {
      steps: {
        orderBy: {
          position: "asc",
        },
        include: {
          options: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });
}

export async function attachBuilderProduct(id, shop, product) {
  return prisma.builder.update({
    where: { id, shop },
    data: {
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: product.image,
    },
  });
}

export async function createBuilder({ shop, name, mode }) {
  return prisma.builder.create({
    data: {
      shop,
      name,
      mode,
      steps: getStarterSteps(mode),
    },
  });
}

export async function updateBuilder(id, data) {
  return prisma.builder.update({
    where: { id },
    data,
  });
}

export async function deleteBuilder(id) {
  return prisma.builder.delete({
    where: { id },
  });
}

export async function addBuilderStep({ builderId, shop, title }) {
  const builder = await prisma.builder.findFirst({
    where: {
      id: builderId,
      shop,
    },
    include: {
      steps: true,
    },
  });

  if (!builder) {
    throw new Response("Builder not found", { status: 404 });
  }

  return prisma.builderStep.create({
    data: {
      builderId,
      title,
      position: builder.steps.length,
      minSelections: 0,
      maxSelections: null,
    },
  });
}

export async function updateBuilderStepRules({
  stepId,
  shop,
  minSelections,
  maxSelections,
}) {
  const step = await prisma.builderStep.findFirst({
    where: {
      id: stepId,
      builder: {
        shop,
      },
    },
  });

  if (!step) {
    throw new Response("Step not found", { status: 404 });
  }

  return prisma.builderStep.update({
    where: {
      id: stepId,
    },
    data: {
      minSelections,
      maxSelections,
    },
  });
}

function getStarterSteps(mode) {
  if (mode === "MIX_AND_MATCH") {
    return {
      create: [
        {
          title: "Choose your items",
          position: 0,
        },
      ],
    };
  }

  if (mode === "FIXED_BUNDLE") {
    return {
      create: [
        {
          title: "Included products",
          position: 0,
        },
      ],
    };
  }

  return undefined;
}

export async function saveAndSyncBuilder({ shop, builder, admin }) {
  const savedBuilder = await saveBuilderDraft({
    shop,
    builder,
    admin,
  });

  console.log("SYNC BUILDER PRODUCT:", savedBuilder.productId);

  const metaobject = await syncBuilderMetaobject({
    admin,
    builder: savedBuilder,
  });

  console.log("SYNC METAOBJECT:", metaobject.id);

  if (savedBuilder.productId) {
    const metafield = await syncBuilderProductMetafield({
      admin,
      productId: savedBuilder.productId,
      metaobjectId: metaobject.id,
    });

    console.log("SYNCED PRODUCT METAFIELD:", metafield);
  }

  return {
    builder: savedBuilder,
    metaobject,
  };
}