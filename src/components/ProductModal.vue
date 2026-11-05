<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <!-- 請同學自行新增 v-model -->
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>新增產品</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <!-- 圖片區：上傳全部，再勾選主圖，其他用拖的排序 -->
            <div class="col-sm-4">
              <label class="form-label fw-bold d-block">商品圖片</label>

              <!-- 一次選多張 -->
              <label
                for="imageFiles"
                class="btn btn-outline-primary btn-sm d-block w-100 mb-2"
                :class="{ disabled: uploadProgress.total }"
              >
                上傳圖片（可多選）
              </label>
              <input
                type="file"
                id="imageFiles"
                class="d-none"
                ref="fileInput"
                accept="image/*"
                multiple
                @change="uploadFiles"
              />

              <!-- 用網址新增 -->
              <div class="input-group input-group-sm mb-2">
                <input
                  type="url"
                  class="form-control"
                  v-model.trim="newImageUrl"
                  placeholder="或貼上圖片網址"
                  aria-label="圖片網址"
                  @keydown.enter.prevent="addImageUrl"
                />
                <button type="button" class="btn btn-outline-secondary" @click="addImageUrl">
                  新增
                </button>
              </div>

              <!-- 上傳進度與錯誤 -->
              <p v-if="uploadProgress.total" class="form-text mb-2">
                <i class="fas fa-spinner fa-spin me-1"></i>
                上傳中 {{ uploadProgress.done }} / {{ uploadProgress.total }}
              </p>
              <p v-if="uploadErrors.length" class="form-text text-danger mb-2">
                上傳失敗：{{ uploadErrors.join("、") }}
              </p>

              <!-- 圖片清單（可拖曳排序，封面不能拖） -->
              <p v-if="!images.length" class="form-text">還沒有圖片</p>
              <VueDraggable
                v-else
                v-model="images"
                class="row g-2"
                :animation="150"
                filter=".is-main"
                :prevent-on-filter="false"
                ghost-class="opacity-50"
                @end="keepMainFirst"
              >
                <div
                  v-for="(url, index) in images"
                  :key="url"
                  class="col-6"
                  :class="{ 'is-main': mainImage === url }"
                >
                  <div
                    class="border p-1 position-relative"
                    :class="{ 'border-primary border-2': mainImage === url }"
                  >
                    <!-- 順序號碼 -->
                    <span
                      class="badge position-absolute top-0 start-0 m-2"
                      :class="mainImage === url ? 'bg-primary' : 'bg-dark'"
                    >
                      {{ mainImage === url ? "封面" : index + 1 }}
                    </span>
                    <img
                      :src="url"
                      class="img-fluid w-100"
                      :alt="`商品圖片 ${index + 1}`"
                      draggable="false"
                    />
                    <div class="d-flex justify-content-between align-items-center mt-1">
                      <div class="form-check mb-0">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="mainImage"
                          :id="`main-${index}`"
                          :value="url"
                          v-model="mainImage"
                        />
                        <label class="form-check-label small" :for="`main-${index}`">主圖</label>
                      </div>
                      <button
                        type="button"
                        class="btn btn-link btn-sm text-danger p-0"
                        @click="removeImage(index)"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              </VueDraggable>
              <div class="form-text mt-2">
                勾選「主圖」的那張會當作商品封面，固定在第一張；其他圖片可以拖曳調整順序
              </div>
            </div>

            <div class="col-sm-8">
              <!-- 標題 -->
              <div class="mb-3">
                <label for="title" class="form-label"
                  >標題 <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': showError('title') }"
                  id="title"
                  v-model="tempProduct.title"
                  placeholder="請輸入標題"
                />
                <div class="invalid-feedback">{{ errors.title }}</div>
              </div>

              <div class="row gx-2">
                <!-- 分類 -->
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label"
                    >分類 <span class="text-danger">*</span></label
                  >
                  <select
                    class="form-select"
                    :class="{ 'is-invalid': showError('category') }"
                    id="category"
                    v-model="tempProduct.category"
                  >
                    <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                      {{ cat }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.category }}</div>
                  <div class="form-text">要新的分類，請先到「分類頁」新增</div>
                </div>
                <!-- 單位 -->
                <div class="mb-3 col-md-6">
                  <label for="unit" class="form-label"
                    >單位 <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': showError('unit') }"
                    id="unit"
                    v-model="tempProduct.unit"
                    placeholder="請輸入單位"
                  />
                  <div class="invalid-feedback">{{ errors.unit }}</div>
                </div>
              </div>

              <div class="row gx-2">
                <!-- 原價（API 的 origin_price） -->
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label"
                    >原價 <span class="text-danger">*</span></label
                  >
                  <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': showError('origin_price') }"
                    id="origin_price"
                    min="1"
                    v-model="tempProduct.origin_price"
                    placeholder="請輸入原價"
                  />
                  <div class="invalid-feedback">{{ errors.origin_price }}</div>
                </div>
                <!-- 售價（API 的 price） -->
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': showError('price') }"
                    id="price"
                    min="1"
                    v-model="tempProduct.price"
                    placeholder="沒有打折可以留空"
                  />
                  <div class="invalid-feedback">{{ errors.price }}</div>
                  <div class="form-text">不可以大於原價，留空代表沒有打折</div>
                </div>
              </div>
              <hr />

              <!-- 尺寸 -->
              <div class="mb-3">
                <label class="form-label d-block">尺寸</label>
                <div class="form-check form-check-inline" v-for="size in sizeOptions" :key="size">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`size-${size}`"
                    :value="size"
                    v-model="tempProduct.sizes"
                    :disabled="isSizeDisabled(size)"
                  />
                  <label class="form-check-label" :for="`size-${size}`">{{ size }}</label>
                </div>
                <div class="form-text">
                  勾選這個商品有的尺寸，都不勾就代表沒有尺寸。One Size 不能和其他尺寸同時勾選
                </div>
              </div>

              <!-- 顏色（名稱 + 色碼） -->
              <div class="mb-3">
                <label for="newColorName" class="form-label">顏色</label>
                <div v-if="tempProduct.colors.length" class="d-flex flex-wrap gap-2 mb-2">
                  <span
                    v-for="(color, index) in tempProduct.colors"
                    :key="color.name"
                    class="d-inline-flex align-items-center gap-2 border rounded px-2 py-1"
                  >
                    <span
                      class="d-inline-block rounded-circle border"
                      :style="{ width: '1rem', height: '1rem', backgroundColor: color.code }"
                    ></span>
                    <span>{{ color.name }}</span>
                    <small class="text-muted">{{ color.code }}</small>
                    <button
                      type="button"
                      class="btn-close"
                      style="font-size: 0.5rem"
                      :aria-label="`刪除 ${color.name}`"
                      @click="removeColor(index)"
                    ></button>
                  </span>
                </div>
                <div class="input-group">
                  <input
                    type="color"
                    class="form-control form-control-color"
                    v-model="newColorCode"
                    title="選擇顏色"
                    aria-label="選擇色碼"
                  />
                  <input
                    type="text"
                    class="form-control"
                    id="newColorName"
                    v-model.trim="newColorName"
                    placeholder="顏色名稱，例如 Black"
                    @keydown.enter.prevent="addColor"
                  />
                  <button type="button" class="btn btn-outline-primary" @click="addColor">
                    新增
                  </button>
                </div>
                <div class="form-text">
                  先點左邊的色塊選顏色，再輸入名稱，按「新增」或 Enter。沒有顏色可以留空
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="description"
                  v-model="tempProduct.description"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="content"
                  v-model="tempProduct.content"
                  placeholder="請輸入產品說明內容"
                ></textarea>
              </div>
              <!-- 材料／成分 -->
              <div class="mb-3">
                <label for="material" class="form-label">材料／成分</label>
                <textarea
                  class="form-control"
                  id="material"
                  rows="3"
                  v-model="tempProduct.material"
                  placeholder="例如：88% Polyester, 12% Spandex（可換行）"
                ></textarea>
                <div class="form-text">
                  沒填的話，前台會顯示「No material information available.」
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    v-model="tempProduct.is_enabled"
                    id="is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled"> 是否啟用 </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <!-- 上傳中不能按確認，避免圖片還沒傳完就存檔 -->
          <button
            type="button"
            class="btn btn-primary"
            :disabled="uploadProgress.total > 0"
            @click="submit"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { VueDraggable } from "vue-draggable-plus";
import modalMaixins from "@/mixins/modalMixins";

// 把輸入框的值轉成數字，空的回傳 null
const toNumber = (val) => (val === "" || val === null || val === undefined ? null : Number(val));

export default {
  components: { VueDraggable },
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
    // 分類清單（從商品列表傳進來）
    categories: {
      type: Array,
      default() {
        return ["Uncategorized"];
      },
    },
  },
  emits: ["update-product"],
  watch: {
    product: {
      handler(newVal) {
        this.tempProduct = { ...newVal };
        this.tempProduct.category = newVal.category || "Uncategorized"; // 沒有分類就是未分類
        this.tempProduct.sizes = Array.isArray(newVal.sizes) ? [...newVal.sizes] : [];
        this.tempProduct.colors = Array.isArray(newVal.colors)
          ? newVal.colors.map((c) => ({ ...c }))
          : [];

        // 售價和原價一樣，代表沒有打折，售價欄位顯示空的
        if (newVal.price && newVal.price === newVal.origin_price) {
          this.tempProduct.price = "";
        }

        // 圖片：主圖 + 其他圖片合成一個清單，主圖排第一個（Set 用來去掉重複）
        const extra = Array.isArray(newVal.imagesUrl) ? newVal.imagesUrl : [];
        this.images = [...new Set([newVal.imageUrl, ...extra].filter(Boolean))];
        this.mainImage = newVal.imageUrl || this.images[0] || "";
        this.newImageUrl = "";
        this.uploadErrors = [];

        this.newColorName = "";
        this.newColorCode = "#000000";
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = "";
        }

        // 重新打開 modal 時，紅框先不顯示
        this.submitted = false;
      },
      deep: true,
    },
    // 換主圖時，把它移到第一張
    mainImage() {
      this.keepMainFirst();
    },
  },
  data() {
    return {
      modal: {},
      tempProduct: {
        sizes: [],
        colors: [],
      },
      sizeOptions: ["XS", "S", "M", "L", "XL", "One Size"],
      newColorName: "",
      newColorCode: "#000000",

      // 圖片相關
      images: [], // 所有圖片網址（畫面上的順序就是存檔的順序）
      mainImage: "", // 勾選的主圖網址
      newImageUrl: "", // 正在輸入的圖片網址
      uploadProgress: { done: 0, total: 0 }, // 上傳進度
      uploadErrors: [], // 上傳失敗的檔名

      submitted: false, // 按過確認才顯示紅框
    };
  },
  methods: {
    // ===== 圖片 =====

    // 加入一張圖片：不能重複；還沒有主圖的話，這張就是主圖
    pushImage(url) {
      if (!url || this.images.includes(url)) return;
      this.images.push(url);
      if (!this.mainImage) this.mainImage = url;
    },

    // 主圖固定在第一張（拖曳完或換主圖時呼叫）
    keepMainFirst() {
      const index = this.images.indexOf(this.mainImage);
      if (index > 0) {
        this.images.splice(index, 1);
        this.images.unshift(this.mainImage);
      }
    },

    // 上傳一張圖到六角，回傳網址
    async upload(file) {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/upload`;
      const res = await this.$http.post(api, formData);
      return res.data.success ? res.data.imageUrl : "";
    },

    // 一次選多張，依檔名排序後一張一張上傳
    async uploadFiles(event) {
      const files = Array.from(event.target.files)
        .filter((f) => f.type.startsWith("image/"))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      if (!files.length) return;

      this.uploadErrors = [];
      this.uploadProgress = { done: 0, total: files.length };

      for (const file of files) {
        try {
          const url = await this.upload(file);
          if (url) this.pushImage(url);
          else this.uploadErrors.push(file.name);
        } catch {
          this.uploadErrors.push(file.name);
        }
        this.uploadProgress.done += 1;
      }

      this.uploadProgress = { done: 0, total: 0 };
      event.target.value = ""; // 清空，下次選同樣的檔案也能觸發
    },

    // 用網址新增
    addImageUrl() {
      this.pushImage(this.newImageUrl);
      this.newImageUrl = "";
    },

    // 移除一張；移除的是主圖的話，下一張自動變主圖
    removeImage(index) {
      const [removed] = this.images.splice(index, 1);
      if (removed === this.mainImage) {
        this.mainImage = this.images[0] || "";
      }
    },

    // ===== 檢查 =====
    // 按過確認，而且這個欄位有錯，才顯示紅框
    showError(field) {
      return this.submitted && Boolean(this.errors[field]);
    },

    // 捲到第一個有錯的欄位
    focusFirstError() {
      this.$nextTick(() => {
        const el = this.$refs.modal.querySelector(".is-invalid");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus({ preventScroll: true });
        }
      });
    },

    // 按確認：先檢查，沒問題再把清單拆回 imageUrl（主圖）和 imagesUrl（其他圖片，照畫面順序）
    submit() {
      this.submitted = true;
      if (Object.keys(this.errors).length) {
        this.focusFirstError();
        return;
      }

      // 沒有勾選主圖的話，預設第一張
      const main = this.mainImage || this.images[0] || "";
      const originPrice = toNumber(this.tempProduct.origin_price);
      const price = toNumber(this.tempProduct.price);
      const product = {
        ...this.tempProduct,
        origin_price: originPrice,
        price: price ?? originPrice, // 售價沒填就等於原價
        imageUrl: main,
        imagesUrl: this.images.filter((url) => url !== main),
      };
      this.$emit("update-product", product);
    },

    // ===== 顏色 =====
    addColor() {
      const name = this.newColorName;
      if (!name) return;
      const exists = this.tempProduct.colors.some(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      if (!exists) {
        this.tempProduct.colors.push({ name, code: this.newColorCode });
      }
      this.newColorName = "";
      this.newColorCode = "#000000";
    },
    removeColor(index) {
      this.tempProduct.colors.splice(index, 1);
    },

    // ===== 尺寸 =====
    // One Size 和其他尺寸不能同時勾選
    isSizeDisabled(size) {
      const sizes = this.tempProduct.sizes || [];
      if (size === "One Size") {
        return sizes.some((s) => s !== "One Size");
      }
      return sizes.includes("One Size");
    },
  },
  computed: {
    // 下拉選單的選項
    // 舊商品的分類如果不在清單裡（例如打錯字的舊資料），也要列出來，不然會被清空
    categoryOptions() {
      const current = this.tempProduct.category;
      if (current && !this.categories.includes(current)) {
        return [...this.categories, current];
      }
      return this.categories;
    },

    // 每個欄位的錯誤訊息，沒有錯就不會出現在裡面
    errors() {
      const p = this.tempProduct;
      const errors = {};
      const originPrice = toNumber(p.origin_price);
      const price = toNumber(p.price);

      if (!(p.title || "").trim()) errors.title = "請輸入標題";
      if (!p.category) errors.category = "請選擇分類";
      if (!(p.unit || "").trim()) errors.unit = "請輸入單位";

      if (originPrice === null) errors.origin_price = "請輸入原價";
      else if (originPrice <= 0) errors.origin_price = "原價要大於 0";

      if (price !== null) {
        if (price <= 0) errors.price = "售價要大於 0";
        else if (originPrice !== null && price > originPrice) errors.price = "售價不可以大於原價";
      }
      return errors;
    },
  },
  mixins: [modalMaixins],
};
</script>
