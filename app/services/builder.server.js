import prisma from "../db.server";

export async function saveBuilderDraft({ shop, builder }) {
  return prisma.$transaction(async (tx) => {
    await tx.builder.update({
      where: {
        id: builder.id,
        shop,
      },
      data: {
        name: builder.name,
        mode: builder.mode,
        status: builder.status,

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
    });
  });
}

async function syncBuilderSteps(tx, { builderId, steps }) {
  const existingStepIds = steps
    .map((step) => step.id)
    .filter(Boolean);

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

    await syncBuilderOptions(tx, {
      stepId: savedStep.id,
      options: step.options ?? [],
    });
  }
}

async function syncBuilderOptions(tx, { stepId, options }) {
  const existingOptionIds = options
    .map((option) => option.id)
    .filter(Boolean);

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
      title: option.title,
      position: index,
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
