import {
  getProductsByTag,
  getProductsByCollection,
  getAllProducts,
} from "../shopify/productRepository.server";

export async function resolveStepOptionsByStepId({ admin, steps }) {
  const optionsByStepId = {};

  
  if (!admin) return optionsByStepId;


  for (const step of steps) {
    const resolvedOptions = await resolveStepOptions(admin, step);

    if (resolvedOptions) {
      optionsByStepId[step.id] = resolvedOptions;
    }
  }

  return optionsByStepId;
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

