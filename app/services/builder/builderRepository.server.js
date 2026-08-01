import prisma from "../../db.server";

import { getStarterSteps } from "./builderTemplates.server";
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
