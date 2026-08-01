import { getBuilder } from "./builderRepository.server"
import prisma from "../../db.server";
import { resolveStepOptionsByStepId } from "./builderStepOptions.server";

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


async function syncBuilderSteps(
  tx,
  { builderId, steps, resolvedOptionsByStepId },
) {

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

