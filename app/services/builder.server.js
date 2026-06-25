import prisma from "../db.server";

/**
 * Get all builders for a shop.
 */
export async function getBuilders(shop) {
  return prisma.builder.findMany({
    where: { shop },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

/**
 * Get a single builder by ID.
 */
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

/**
 * Attach a product to a Builder. 
 */
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

/**
 * Create a new builder.
 */

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

/**
 * Update a builder.
 */
export async function updateBuilder(id, data) {
  return prisma.builder.update({
    where: { id },
    data,
  });
}

/**
 * Delete a builder.
 */
export async function deleteBuilder(id) {
  return prisma.builder.delete({
    where: { id },
  });
}

function getStarterSteps(mode) {
  if (mode === "MIX_AND_MATCH") {
    return {
      create: [
        {
          title: "Choose your items",
          position: 1,
        },
      ],
    };
  }

  if (mode === "FIXED_BUNDLE") {
    return {
      create: [
        {
          title: "Included products",
          position: 1,
        },
      ],
    };
  }
  return undefined;
}

export async function addBuilderStep({ builderId, shop, title }) {
   console.log("addBuilderStep()");
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

