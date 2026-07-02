# Build-a-Box Refactor Plan

## Goal

Replace the old `BuilderOption` architecture with a cleaner `BuilderStepProduct` model that represents Shopify products attached directly to a builder step.

The merchant experience should become:

> Builder → Step → Select Products (Shopify Resource Picker)

instead of manually creating options one by one.

---

## Why?

The current `BuilderOption` model is acting as a wrapper around Shopify products.

Since Shopify products already provide their own title, image, handle, variants, etc., the extra "option" layer adds unnecessary complexity.

Instead:

* BuilderStep = the rules
* BuilderStepProduct = available Shopify products
* Customer selections = runtime/cart state

---

## New Data Structure

```
Builder
└── BuilderStep
    ├── title
    ├── minSelections
    ├── maxSelections
    ├── selectionMode
    └── BuilderStepProducts[]
```

Each `BuilderStepProduct` represents one Shopify product available in that step.

---

## BuilderStep Responsibilities

A step defines **rules**, not products.

Examples:

* Choose Snacks
* Choose Drinks
* Choose Desserts

Fields include:

* title
* minSelections
* maxSelections
* selectionMode

  * UNIQUE
  * QUANTITY
* isRequired
* isVisible

---

## BuilderStepProduct Responsibilities

Represents an attached Shopify product.

Fields:

* productId
* variantId (optional)
* productTitle
* variantTitle
* image
* handle
* position

One row = one selectable product.

---

## Customer Selections

These are **not** stored in BuilderStepProduct.

Later, the storefront will hold temporary state such as:

```
Choose Snacks

Takis x2
Doritos x1
```

BuilderStepProduct is simply the menu of available choices.

---

## Future Architecture

Keep Shopify products and custom items separate.

Eventually:

```
BuilderStep
├── BuilderStepProducts
└── BuilderStepCustomItems
```

Examples of custom items:

* Gift Wrap
* Greeting Card
* Engraving
* Warranty

Avoid mixing PRODUCT and CUSTOM into a single table with many nullable fields.

---

## Implementation Order

1. Commit current work to Git.
2. Replace `BuilderOption` with `BuilderStepProduct` in Prisma.
3. Run Prisma migration.
4. Update loader/service includes.
5. Update save actions.
6. Add Shopify Resource Picker (multi-select).
7. Display attached products in each step.
8. Remove all remaining BuilderOption code.

---

## End Goal

Merchant workflow:

```
Create Builder

↓

Add Step

↓

Click "Select Products"

↓

Shopify Resource Picker

↓

Choose multiple products

↓

Products appear under that step

↓

Configure rules (min/max, unique vs quantity)
```

This becomes the foundation for Build-a-Box while leaving room for future additions like collections, custom items, and dynamic rules.
