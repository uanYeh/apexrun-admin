<template>
  <Loading :active="isLoading"></Loading>

  <!-- 篩選（左）+ 新增產品（右） -->
  <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center">
    <div class="d-flex flex-wrap align-items-center gap-3">
      <!-- 搜尋商品 -->
      <div class="input-group" style="width: 240px">
        <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
        <input
          type="search"
          class="form-control"
          v-model.trim="keyword"
          placeholder="搜尋商品名稱"
          aria-label="搜尋商品"
        />
      </div>

      <!-- 分類下拉 -->
      <select
        class="form-select"
        style="width: 180px"
        v-model="filterCategory"
        aria-label="依分類篩選"
      >
        <option value="">全部分類</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <!-- 啟用 / 未啟用 -->
      <div class="d-flex gap-3">
        <div class="form-check mb-0">
          <input
            class="form-check-input"
            type="checkbox"
            id="filter-enabled"
            value="enabled"
            v-model="statusFilter"
          />
          <label class="form-check-label" for="filter-enabled">啟用</label>
        </div>
        <div class="form-check mb-0">
          <input
            class="form-check-input"
            type="checkbox"
            id="filter-disabled"
            value="disabled"
            v-model="statusFilter"
          />
          <label class="form-check-label" for="filter-disabled">未啟用</label>
        </div>
      </div>
    </div>

    <button class="btn btn-primary text-nowrap" type="button" @click.prevent="openModal(true)">
      新增一個產品
    </button>
  </div>

  <!-- 篩選結果數量 + 清除（下一行） -->
  <div v-if="isFiltering" class="d-flex align-items-center gap-3 mt-2">
    <span class="text-muted">找到 {{ filteredProducts.length }} 個商品</span>
    <button type="button" class="btn btn-link btn-sm p-0" @click="clearFilters">清除篩選</button>
  </div>

  <table class="table align-middle mt-4">
    <thead>
      <tr>
        <th width="70">圖片</th>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody v-for="item in displayProducts" :key="item.id">
      <tr>
        <td>
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            class="border rounded object-fit-cover"
            width="50"
            height="50"
          />
          <div
            v-else
            class="border rounded bg-light d-flex align-items-center justify-content-center text-muted"
            style="width: 50px; height: 50px"
          >
            <i class="bi bi-image"></i>
          </div>
        </td>
        <td>{{ item.category || DEFAULT_CATEGORY }}</td>
        <td>{{ item.title }}</td>
        <td
          class="text-right"
          style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
        >
          {{ $filters.currency(item.origin_price) }}
        </td>
        <td class="text-right">{{ $filters.currency(item.price) }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click.prevent="openModal(false, item)">
              編輯
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelProductModal(item)">
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="isFiltering && !filteredProducts.length" class="text-center text-muted">
    找不到符合條件的商品
  </p>

  <!-- 分頁（最新的商品在第 1 頁） -->
  <Pagination v-if="filteredProducts.length" :pages="filterPagination" @emit-pages="changePage" />
  <ProductModal
    ref="ProductModal"
    :product="tempProduct"
    :categories="categories"
    @update-product="updateProduct"
  />
  <DelModal ref="delModal" :item="tempProduct" @del-item="delProduct" />
</template>

<script>
import ProductModal from "@/components/ProductModal.vue";
import Pagination from "@/components/Pagination.vue";
import DelModal from "@/components/DelModal.vue";
import { currency } from "@/methods/filters";
import {
  DEFAULT_CATEGORY,
  loadCustomCategories,
  countCategories,
  mergeCategories,
  loadSizeFits,
  loadCategoryDescs,
} from "@/methods/categories";

// 每頁幾筆
const PER_PAGE = 10;

export default {
  components: { ProductModal, DelModal, Pagination },
  data() {
    return {
      tempProduct: {},
      isNew: false,
      isLoading: false,
      DEFAULT_CATEGORY,
      allProducts: [], // 全部商品
      customCategories: loadCustomCategories(), // 在分類頁新增的分類

      // ===== 篩選 =====
      keyword: "", // 搜尋商品名稱
      filterCategory: "", // 分類下拉，空字串代表全部
      statusFilter: ["enabled", "disabled"], // 勾選的狀態，預設兩個都勾
      filterPage: 1, // 目前在第幾頁
    };
  },
  inject: ["emitter"],
  computed: {
    // 完整的分類清單（給篩選下拉和 modal 用）
    categories() {
      return mergeCategories(this.customCategories, countCategories(this.allProducts));
    },
    // 有沒有任何篩選條件（用來顯示「找到 X 個商品」）
    isFiltering() {
      return Boolean(this.keyword || this.filterCategory || this.statusFilter.length !== 2);
    },
    // 最新的商品排最前面
    sortedProducts() {
      return [...this.allProducts].reverse();
    },
    // 符合篩選條件的商品（沒有篩選時就是全部）
    filteredProducts() {
      const kw = this.keyword.toLowerCase();
      return this.sortedProducts.filter((p) => {
        const matchKeyword =
          !kw || [p.title, p.description].some((t) => (t || "").toLowerCase().includes(kw));
        const matchCategory =
          !this.filterCategory || (p.category || DEFAULT_CATEGORY) === this.filterCategory;
        const status = p.is_enabled ? "enabled" : "disabled";
        const matchStatus = this.statusFilter.includes(status);
        return matchKeyword && matchCategory && matchStatus;
      });
    },
    // 頁碼資訊（格式和 API 的 pagination 一樣）
    filterPagination() {
      const totalPages = Math.max(1, Math.ceil(this.filteredProducts.length / PER_PAGE));
      return {
        total_pages: totalPages,
        current_page: this.filterPage,
        has_pre: this.filterPage > 1,
        has_next: this.filterPage < totalPages,
      };
    },
    // 這一頁要顯示的商品
    displayProducts() {
      const start = (this.filterPage - 1) * PER_PAGE;
      return this.filteredProducts.slice(start, start + PER_PAGE);
    },
  },
  watch: {
    // 改任何篩選條件，都回到第 1 頁
    keyword() {
      this.filterPage = 1;
    },
    filterCategory() {
      this.filterPage = 1;
    },
    statusFilter: {
      handler() {
        this.filterPage = 1;
      },
      deep: true,
    },
    // 刪除商品後，如果這一頁變空了，退回最後一頁
    filterPagination(val) {
      if (this.filterPage > val.total_pages) this.filterPage = val.total_pages;
    },
  },
  methods: {
    currency,
    // 取得全部商品
    getAllProducts() {
      const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/products/all`;
      this.isLoading = true;
      return this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            const list = res.data.products || [];
            this.allProducts = Array.isArray(list) ? list : Object.values(list);
          }
        })
        .catch((err) => {
          console.error("取得商品失敗：", err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 換頁
    changePage(page) {
      this.filterPage = page;
    },
    // 清除所有篩選條件
    clearFilters() {
      this.keyword = "";
      this.filterCategory = "";
      this.statusFilter = ["enabled", "disabled"];
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = { category: DEFAULT_CATEGORY }; // 新商品預設未分類
      } else {
        this.tempProduct = { ...item };
      }
      this.isNew = isNew;
      this.$refs.ProductModal.showModal();
    },
    updateProduct(item) {
      // 自動帶入這個分類的說明和 Size & Fit
      const category = item.category || DEFAULT_CATEGORY;
      const sizeFit = loadSizeFits()[category] || "";
      const categoryDesc = loadCategoryDescs()[category] || "";
      this.tempProduct = { ...item, category, sizeFit, categoryDesc };

      this.isLoading = true;
      //新增
      let api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product`;
      let httpMethod = "post";
      //編輯
      if (!this.isNew) {
        api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = "put";
      }
      const productComponent = this.$refs.ProductModal;
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          productComponent.hideModal();
          this.$httppageMessageState(res, this.isNew ? "新增" : "更新");
          if (res.data.success) {
            // 新增的話回到第 1 頁，新商品就在最上面
            if (this.isNew) {
              this.clearFilters();
              this.filterPage = 1;
            }
            // 等列表抓完才關 Loading
            return this.getAllProducts();
          }
        })
        .catch((err) => {
          productComponent.hideModal();
          this.emitter.emit("push-message", {
            style: "danger",
            title: "API 錯誤",
            content: err.response?.data?.message?.join("、") || "請確認欄位填寫完整",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      this.$refs.delModal.showModal();
    },
    delProduct() {
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(url).then((res) => {
        this.$refs.delModal.hideModal();
        if (res.data.success) this.getAllProducts();
        this.$httppageMessageState(res, "刪除");
      });
    },
  },
  created() {
    this.getAllProducts();
  },
};
</script>
