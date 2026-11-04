<template>
  <Loading :active="isLoading"></Loading>

  <!-- ===== 上方：商品分類 ===== -->
  <div class="card shadow-sm mb-4">
    <div class="card-header bg-white">
      <h6 class="mb-0 fw-bold">商品分類</h6>
    </div>
    <div class="card-body">
      <div class="d-flex flex-wrap align-items-center gap-2">
        <!-- 新增分類（放最前面） -->
        <div class="input-group input-group-sm" style="width: 260px">
          <input
            type="text"
            class="form-control"
            v-model.trim="newCategory"
            placeholder="輸入新分類"
            aria-label="新分類名稱"
            @keydown.enter.prevent="addCategory"
          />
          <button type="button" class="btn btn-primary" @click="addCategory">
            <i class="bi bi-plus-lg"></i> 新增
          </button>
        </div>

        <!-- 分類標籤 -->
        <span
          v-for="cat in categories"
          :key="cat"
          class="d-inline-flex align-items-center gap-2 border rounded-pill px-3 py-1 small"
          :class="cat === DEFAULT_CATEGORY ? 'bg-white text-muted' : 'bg-light'"
        >
          {{ cat }}
          <span class="bg-white border rounded-pill px-2">{{ counts[cat] || 0 }}</span>
          <button
            v-if="cat !== DEFAULT_CATEGORY"
            type="button"
            class="btn-close"
            style="font-size: 0.5rem"
            :disabled="counts[cat] > 0"
            :title="counts[cat] > 0 ? '有商品使用，無法刪除' : `刪除 ${cat}`"
            :aria-label="`刪除 ${cat}`"
            @click="removeCategory(cat)"
          ></button>
        </span>
      </div>
      <div class="form-text mt-2">數字是使用中的商品數，有商品使用的分類不能刪除</div>
    </div>
  </div>

  <!-- ===== 下方：每個分類的說明和 Size & Fit ===== -->
  <table class="table align-middle">
    <thead>
      <tr>
        <th width="160">分類</th>
        <th>分類說明</th>
        <th>Size & Fit</th>
        <th width="100">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cat in categories" :key="cat">
        <td>{{ cat }}</td>
        <td>
          <span v-if="descs[cat]" class="d-inline-block text-truncate" style="max-width: 300px">{{
            descs[cat]
          }}</span>
          <span v-else class="text-muted">（未設定）</span>
        </td>
        <td>
          <span
            v-if="sizeFits[cat]"
            class="d-inline-block text-truncate"
            style="max-width: 300px"
            >{{ sizeFits[cat] }}</span
          >
          <span v-else class="text-muted">（未設定）</span>
        </td>
        <td>
          <button type="button" class="btn btn-outline-primary btn-sm" @click="openEditModal(cat)">
            編輯
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ===== 編輯 modal ===== -->
  <div class="modal fade" tabindex="-1" ref="editModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">{{ editingCategory }} 的設定</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="updateProgress.total > 0"
          ></button>
        </div>
        <div class="modal-body">
          <!-- 分類說明 -->
          <div class="mb-4">
            <label for="descInput" class="form-label fw-bold">分類說明</label>
            <textarea
              id="descInput"
              class="form-control"
              rows="3"
              v-model="editingDesc"
              placeholder="顯示在前台商品列表的分類標題下方"
            ></textarea>
          </div>

          <!-- Size & Fit -->
          <div>
            <label for="sizeFitInput" class="form-label fw-bold">Size & Fit</label>
            <textarea
              id="sizeFitInput"
              class="form-control"
              rows="6"
              v-model="editingSizeFit"
              placeholder="純文字或 HTML 表格都可以"
            ></textarea>
          </div>

          <div class="form-text mt-3">
            儲存後，會一併更新「{{ editingCategory }}」底下的
            {{ counts[editingCategory] || 0 }} 個商品
          </div>

          <!-- 更新進度 -->
          <p v-if="updateProgress.total" class="form-text mt-3 mb-0">
            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
            更新商品中 {{ updateProgress.done }} / {{ updateProgress.total }}
          </p>
          <p v-if="updateErrors.length" class="form-text text-danger mt-2 mb-0">
            更新失敗：{{ updateErrors.join("、") }}
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            :disabled="updateProgress.total > 0"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="updateProgress.total > 0"
            @click="saveSettings"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal";
import {
  DEFAULT_CATEGORY,
  loadCustomCategories,
  saveCustomCategories,
  countCategories,
  mergeCategories,
  loadSizeFits,
  saveSizeFits,
  loadCategoryDescs,
  saveCategoryDescs,
} from "@/methods/categories";

export default {
  inject: ["emitter"],
  data() {
    return {
      DEFAULT_CATEGORY,
      isLoading: false,
      allProducts: [], // 全部商品，用來統計數量、更新設定
      customCategories: loadCustomCategories(), // 自己新增的分類
      newCategory: "", // 正在輸入的新分類

      // ===== 分類設定 =====
      descs: loadCategoryDescs(), // 每個分類的說明
      sizeFits: loadSizeFits(), // 每個分類的 Size & Fit
      modal: null,
      editingCategory: "", // 正在編輯的分類
      editingDesc: "", // modal 裡的分類說明
      editingSizeFit: "", // modal 裡的 Size & Fit
      updateProgress: { done: 0, total: 0 }, // 更新商品的進度
      updateErrors: [], // 更新失敗的商品名稱
    };
  },
  computed: {
    // 每個分類有幾個商品
    counts() {
      return countCategories(this.allProducts);
    },
    // 完整的分類清單
    categories() {
      return mergeCategories(this.customCategories, this.counts);
    },
  },
  methods: {
    // 抓全部商品
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
        .finally(() => {
          this.isLoading = false;
        });
    },

    // ===== 分類 =====
    // 新增分類（不能空白、不能重複，不分大小寫）
    addCategory() {
      const name = this.newCategory;
      if (!name) return;
      const exists = this.categories.some((c) => c.toLowerCase() === name.toLowerCase());
      if (exists) {
        this.emitter.emit("push-message", {
          style: "warning",
          title: "分類已存在",
          content: `「${name}」已經在分類清單裡了`,
        });
        return;
      }
      this.customCategories.push(name);
      saveCustomCategories(this.customCategories);
      this.newCategory = "";
    },
    // 刪除分類（只有沒有商品使用的才能刪）
    removeCategory(cat) {
      if (cat === DEFAULT_CATEGORY || this.counts[cat] > 0) return;
      this.customCategories = this.customCategories.filter((c) => c !== cat);
      saveCustomCategories(this.customCategories);
      // 一併刪掉這個分類的設定
      delete this.descs[cat];
      saveCategoryDescs(this.descs);
      delete this.sizeFits[cat];
      saveSizeFits(this.sizeFits);
    },

    // ===== 分類設定 =====
    // 打開編輯 modal
    openEditModal(cat) {
      this.editingCategory = cat;
      this.editingDesc = this.descs[cat] || "";
      this.editingSizeFit = this.sizeFits[cat] || "";
      this.updateErrors = [];
      this.modal.show();
    },
    // 儲存：先存在後台，再更新這個分類底下的所有商品
    async saveSettings() {
      const cat = this.editingCategory;
      const desc = this.editingDesc.trim();
      const sizeFit = this.editingSizeFit.trim();

      // 1. 存在後台瀏覽器
      this.descs = { ...this.descs, [cat]: desc };
      saveCategoryDescs(this.descs);
      this.sizeFits = { ...this.sizeFits, [cat]: sizeFit };
      saveSizeFits(this.sizeFits);

      // 2. 找出這個分類的商品，一個一個更新
      const products = this.allProducts.filter((p) => (p.category || DEFAULT_CATEGORY) === cat);
      this.updateErrors = [];
      this.updateProgress = { done: 0, total: products.length };

      for (const product of products) {
        const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product/${product.id}`;
        try {
          const res = await this.$http.put(api, {
            data: { ...product, categoryDesc: desc, sizeFit },
          });
          if (!res.data.success) this.updateErrors.push(product.title);
        } catch {
          this.updateErrors.push(product.title);
        }
        this.updateProgress.done += 1;
      }

      this.updateProgress = { done: 0, total: 0 };

      // 3. 全部成功就關閉 modal，有失敗就留著讓你看到是哪幾個
      if (!this.updateErrors.length) {
        this.modal.hide();
        this.emitter.emit("push-message", {
          style: "success",
          title: "已儲存",
          content: `「${cat}」的設定已更新到 ${products.length} 個商品`,
        });
      }
      this.getAllProducts();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.editModal);
  },
  beforeUnmount() {
    if (this.modal) this.modal.dispose();
  },
  created() {
    this.getAllProducts();
  },
};
</script>
