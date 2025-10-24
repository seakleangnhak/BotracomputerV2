import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

export type ProductFilterState = {
  brands: string[];
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  search: string;
};

interface ProductFiltersProps {
  products: ProductModel[];
  value: ProductFilterState;
  onChange: PropFunction<(state: ProductFilterState) => void>;
  title?: string;
  class?: string;
  enableBrandFilter?: boolean;
  enableCategoryFilter?: boolean;
}

type FilterChip =
  | { type: "brand"; id: string; label: string }
  | { type: "category"; id: string; label: string }
  | { type: "search"; label: string }
  | { type: "price" }
  | { type: "stock" };

const getPrice = (product: ProductModel) =>
  product.sale_price ?? product.regular_price ?? 0;

const toId = (id: number | null | undefined, fallback: string | null | undefined) => {
  if (id !== null && id !== undefined) {
    return `${id}`;
  }
  return (fallback ?? "").trim();
};

export default component$((props: ProductFiltersProps) => {
  const uniqueBrands = useComputed$(() => {
    const map = new Map<string, string>();
    props.products.forEach((product) => {
      const id = toId(product.brand_id, product.brand_name);
      const label = product.brand_name ?? "Unknown brand";
      if (id) {
        map.set(id, label);
      }
    });
    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  const uniqueCategories = useComputed$(() => {
    const map = new Map<string, string>();
    props.products.forEach((product) => {
      const id = toId(product.category_id, product.category_name);
      const label = product.category_name ?? "Miscellaneous";
      if (id) {
        map.set(id, label);
      }
    });
    return Array.from(map.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  const brandLookup = useComputed$(
    () => new Map(uniqueBrands.value.map((item) => [item.id, item.label])),
  );
  const categoryLookup = useComputed$(
    () => new Map(uniqueCategories.value.map((item) => [item.id, item.label])),
  );

  const priceBounds = useComputed$(() => {
    if (!props.products.length) {
      return { min: 0, max: 0 };
    }
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    props.products.forEach((product) => {
      const price = getPrice(product);
      if (price === null || price === undefined) {
        return;
      }
      if (price < min) {
        min = price;
      }
      if (price > max) {
        max = price;
      }
    });

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { min: 0, max: 0 };
    }

    return { min: Math.max(0, Math.floor(min)), max: Math.ceil(max) };
  });

  const includeBrand = props.enableBrandFilter !== false;
  const includeCategory = props.enableCategoryFilter !== false;
  const brandCategoryGridClass =
    includeBrand && includeCategory ? "grid gap-6 md:grid-cols-2" : "grid gap-6";

  const activeCount = useComputed$(() => {
    let count = 0;
    if (includeBrand) {
      count += props.value.brands.length;
    }
    if (includeCategory) {
      count += props.value.categories.length;
    }
    if (props.value.minPrice !== undefined || props.value.maxPrice !== undefined) {
      count += 1;
    }
    if (props.value.inStockOnly) {
      count += 1;
    }
    if (props.value.search.trim()) {
      count += 1;
    }
    return count;
  });

  const updateState = $((update: Partial<ProductFilterState>) => {
    props.onChange({
      ...props.value,
      ...update,
    });
  });

  const handleMinPriceChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    const value =
      input.value === "" ? undefined : Number.parseFloat(input.value);
    props.onChange({
      ...props.value,
      minPrice:
        value !== undefined && Number.isFinite(value) ? Math.max(0, value) : undefined,
    });
  });

  const handleMaxPriceChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    const value =
      input.value === "" ? undefined : Number.parseFloat(input.value);
    props.onChange({
      ...props.value,
      maxPrice:
        value !== undefined && Number.isFinite(value) ? Math.max(0, value) : undefined,
    });
  });

  const handleSearchChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    updateState({ search: input.value });
  });

  const handleAvailabilityChange = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    updateState({ inStockOnly: input.checked });
  });

  const clearAll = $(() => {
    props.onChange({
      brands: [],
      categories: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      search: "",
    });
  });

  const handleSelectChange = $(
    (event: Event, key: "brands" | "categories") => {
      const select = event.target as HTMLSelectElement;
      const values = Array.from(select.selectedOptions).map(
        (option) => option.value,
      );
      props.onChange({
        ...props.value,
        [key]: values,
      });
    },
  );

  const removeBrand = $((id: string) => {
    props.onChange({
      ...props.value,
      brands: props.value.brands.filter((brandId) => brandId !== id),
    });
  });

  const removeCategory = $((id: string) => {
    props.onChange({
      ...props.value,
      categories: props.value.categories.filter((categoryId) => categoryId !== id),
    });
  });

  const removeSearch = $(() => updateState({ search: "" }));
  const removePrice = $(() =>
    updateState({ minPrice: undefined, maxPrice: undefined }),
  );
  const removeStock = $(() => updateState({ inStockOnly: false }));

  const activeChips = useComputed$<FilterChip[]>(() => {
    const chips: FilterChip[] = [];

    if (includeBrand) {
      props.value.brands.forEach((id) => {
        chips.push({
          type: "brand",
          id,
          label: brandLookup.value.get(id) ?? `Brand ${id}`,
        });
      });
    }

    if (includeCategory) {
      props.value.categories.forEach((id) => {
        chips.push({
          type: "category",
          id,
          label: categoryLookup.value.get(id) ?? `Category ${id}`,
        });
      });
    }

    if (
      props.value.minPrice !== undefined ||
      props.value.maxPrice !== undefined
    ) {
      chips.push({ type: "price" });
    }

    if (props.value.inStockOnly) {
      chips.push({ type: "stock" });
    }

    if (props.value.search.trim()) {
      chips.push({
        type: "search",
        label: props.value.search.trim(),
      });
    }

    return chips;
  });

  const handleChipRemove = $((chip: FilterChip) => {
    switch (chip.type) {
      case "brand":
        return removeBrand(chip.id);
      case "category":
        return removeCategory(chip.id);
      case "search":
        return removeSearch();
      case "price":
        return removePrice();
      case "stock":
        return removeStock();
      default:
        return;
    }
  });

  const clearDisabled = activeCount.value === 0;
  const expanded = useSignal(activeCount.value > 0);
  const toggleExpanded = $(() => {
    expanded.value = !expanded.value;
  });

  return (
    <section
      class={
        (props.class ? `${props.class} ` : "") +
        "mb-6 rounded-2xl border border-blue-100/70 bg-white/80 p-4 shadow-lg backdrop-blur-md md:p-6"
      }
    >
      <header class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-blue-900">
            {props.title ?? "Filters"}
          </h2>
          <span class="rounded-full bg-blue-100 px-2 py-[2px] text-xs font-semibold text-blue-700">
            {activeCount.value}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          {activeChips.value.length > 0 && (
            <div class="flex flex-wrap gap-2 rounded-full bg-blue-50/60 px-3 py-1 text-xs text-blue-700 shadow-sm">
              {activeChips.value.map((chip, index) => (
                <button
                  key={`${chip.type}-${"id" in chip ? chip.id : index}`}
                  type="button"
                  onClick$={() => handleChipRemove(chip)}
                  class="group flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-[2px] text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                >
                  <span>
                    {chip.type === "price"
                      ? `Price: ${
                          props.value.minPrice ?? priceBounds.value.min
                        } – ${props.value.maxPrice ?? priceBounds.value.max}`
                      : chip.type === "stock"
                      ? "In stock only"
                      : chip.type === "search"
                      ? `Search: ${chip.label}`
                      : chip.label}
                  </span>
                  <svg
                    class="h-3 w-3 text-blue-500 group-hover:text-blue-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={clearDisabled}
            class={
              "rounded-full border border-blue-200 px-3 py-1 text-xs font-medium transition shadow-sm " +
              (clearDisabled
                ? "cursor-not-allowed text-slate-400"
                : "text-blue-700 hover:bg-blue-600 hover:text-white")
            }
            onClick$={clearAll}
          >
            Clear all
          </button>

          <button
            type="button"
            onClick$={toggleExpanded}
            class="flex items-center gap-1 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white"
          >
            <svg
              class={
                "h-4 w-4 transition-transform " +
                (expanded.value ? "rotate-180" : "")
              }
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clip-rule="evenodd"
              />
            </svg>
            {expanded.value ? "Hide" : "Show"}
          </button>
        </div>
      </header>

      <div
        class={
          "mt-4 grid gap-4 transition-all duration-200 ease-in-out " +
          (expanded.value ? "opacity-100" : "pointer-events-none h-0 opacity-0")
        }
      >
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="md:col-span-2">
            <label
              class="block text-sm font-semibold text-slate-700"
              for="filter-search"
            >
              Search products
            </label>
            <div class="relative mt-1">
              <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                  ></path>
                </svg>
              </span>
              <input
                id="filter-search"
                type="search"
                placeholder="Search by name, brand or category"
                value={props.value.search}
                onInput$={handleSearchChange}
                class="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-blue-200 transition focus:border-blue-400 focus:ring"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700">
              Availability
            </label>
            <div class="mt-2 flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white/60 px-3 py-2 shadow-inner">
              <input
                id="filter-stock"
                type="checkbox"
                checked={props.value.inStockOnly}
                onChange$={handleAvailabilityChange}
                class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label class="text-sm text-slate-600" for="filter-stock">
                Show in-stock items only
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700">
              Price range (USD)
            </label>
            <div class="mt-2 flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white/60 px-3 py-2 shadow-inner">
              <input
                type="number"
                min={priceBounds.value.min}
                max={props.value.maxPrice ?? priceBounds.value.max}
                placeholder={`${priceBounds.value.min}`}
                value={
                  props.value.minPrice === undefined ? "" : props.value.minPrice
                }
                onInput$={handleMinPriceChange}
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-200 transition focus:border-blue-400 focus:ring"
              />
              <span class="self-center text-sm text-slate-500">to</span>
              <input
                type="number"
                min={props.value.minPrice ?? priceBounds.value.min}
                max={priceBounds.value.max}
                placeholder={`${priceBounds.value.max}`}
                value={
                  props.value.maxPrice === undefined ? "" : props.value.maxPrice
                }
                onInput$={handleMaxPriceChange}
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-200 transition focus:border-blue-400 focus:ring"
              />
            </div>
            <p class="mt-1 text-xs text-slate-500">
              Default range: {priceBounds.value.min} – {priceBounds.value.max}
            </p>
          </div>
        </div>

        <div class={brandCategoryGridClass}>
          {includeBrand && (
            <div>
              <label
                class="block text-sm font-semibold text-slate-700"
                for="filter-brand"
              >
                Brand
              </label>
              {uniqueBrands.value.length ? (
                <>
                  <select
                    id="filter-brand"
                    multiple
                    size={Math.min(6, uniqueBrands.value.length)}
                    onChange$={(event) => handleSelectChange(event, "brands")}
                    class="mt-2 w-full rounded-lg border border-slate-300/70 bg-white/70 px-3 py-2 text-sm outline-none ring-blue-200 transition focus:border-blue-400 focus:ring overflow-y-auto"
                  >
                    {uniqueBrands.value.map((brand) => (
                      <option
                        key={brand.id}
                        value={brand.id}
                        selected={props.value.brands.includes(brand.id)}
                      >
                        {brand.label}
                      </option>
                    ))}
                  </select>
                  <p class="mt-1 text-xs text-slate-500">
                    Hold Ctrl/Cmd to select multiple brands.
                  </p>
                </>
              ) : (
                <p class="mt-2 text-sm text-slate-500">
                  No brand filters available.
                </p>
              )}
            </div>
          )}

          {includeCategory && (
            <div>
              <label
                class="block text-sm font-semibold text-slate-700"
                for="filter-category"
              >
                Category
              </label>
              {uniqueCategories.value.length ? (
                <>
                  <select
                    id="filter-category"
                    multiple
                    size={Math.min(6, uniqueCategories.value.length)}
                    onChange$={(event) => handleSelectChange(event, "categories")}
                    class="mt-2 w-full rounded-lg border border-slate-300/70 bg-white/70 px-3 py-2 text-sm outline-none ring-blue-200 transition focus:border-blue-400 focus:ring overflow-y-auto"
                  >
                    {uniqueCategories.value.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        selected={props.value.categories.includes(category.id)}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <p class="mt-1 text-xs text-slate-500">
                    Hold Ctrl/Cmd to select multiple categories.
                  </p>
                </>
              ) : (
                <p class="mt-2 text-sm text-slate-500">
                  No category filters available.
                </p>
              )}
            </div>
          )}
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            disabled={clearDisabled}
            class={
              "rounded-full px-4 py-2 text-sm font-semibold transition " +
              (clearDisabled
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600")
            }
            onClick$={clearAll}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </section>
  );
});
