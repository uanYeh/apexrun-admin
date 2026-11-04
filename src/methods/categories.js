// ===== 分類 =====

// 預設分類，不能刪除
export const DEFAULT_CATEGORY = "Uncategorized";

// 自己新增的分類存在 localStorage 的名稱
const STORAGE_KEY = "customCategories";

// 讀取自己新增過的分類
export function loadCustomCategories() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

// 儲存自己新增的分類
export function saveCustomCategories(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // 瀏覽器不允許存資料時就不存，不影響其他功能
  }
}

// 統計每個分類有幾個商品在用，例如 { Apparel: 5, Bags: 2 }
export function countCategories(products) {
  return products.reduce((counts, p) => {
    const cat = p.category || DEFAULT_CATEGORY;
    counts[cat] = (counts[cat] || 0) + 1;
    return counts;
  }, {});
}

// 合併成完整的分類清單：預設分類排第一，其他依字母排序
export function mergeCategories(customCategories, counts) {
  const others = new Set([...customCategories, ...Object.keys(counts)]);
  others.delete(DEFAULT_CATEGORY);
  return [DEFAULT_CATEGORY, ...[...others].sort((a, b) => a.localeCompare(b))];
}

// ===== Size & Fit =====

// 每個分類的 Size & Fit 存在 localStorage 的名稱
const SIZE_FIT_KEY = "categorySizeFit";

// 讀取所有分類的 Size & Fit，例如 { Apparel: "Regular fit...", Bags: "" }
export function loadSizeFits() {
  try {
    return JSON.parse(localStorage.getItem(SIZE_FIT_KEY) || "{}");
  } catch {
    return {};
  }
}

// 儲存所有分類的 Size & Fit
export function saveSizeFits(sizeFits) {
  try {
    localStorage.setItem(SIZE_FIT_KEY, JSON.stringify(sizeFits));
  } catch {
    // 瀏覽器不允許存資料時就不存
  }
}
// 每個分類的說明存在 localStorage 的名稱
const DESC_KEY = "categoryDesc";

// 讀取所有分類的說明，例如 { Accessories: "From hats and gloves..." }
export function loadCategoryDescs() {
  try {
    return JSON.parse(localStorage.getItem(DESC_KEY) || "{}");
  } catch {
    return {};
  }
}

// 儲存所有分類的說明
export function saveCategoryDescs(descs) {
  try {
    localStorage.setItem(DESC_KEY, JSON.stringify(descs));
  } catch {
    // 瀏覽器不允許存資料時就不存
  }
}
