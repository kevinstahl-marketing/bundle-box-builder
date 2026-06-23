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
export async function getBuilder(id) {
  return prisma.builder.findUnique({
    where: { id },
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
 * Create a new builder.
 */
export async function createBuilder({ shop, name }) {
  return prisma.builder.create({
    data: {
      shop,
      name,
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