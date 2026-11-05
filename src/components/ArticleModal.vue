<template>
  <div
    class="modal fade"
    id="articleModal"
    tabindex="-1"
    aria-labelledby="articleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="articleModalLabel">
            <span>{{ isNew ? "新增文章" : "編輯文章" }}</span>
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
            <!-- 左欄：圖片 -->
            <div class="col-sm-4">
              <div class="mb-3">
                <label class="form-label d-block">封面圖</label>

                <!-- 上傳圖片 -->
                <label
                  for="articleImageFile"
                  class="btn btn-outline-primary btn-sm d-block w-100 mb-2"
                  :class="{ disabled: isUploading }"
                >
                  <span
                    v-if="isUploading"
                    class="spinner-border spinner-border-sm me-1"
                    role="status"
                  ></span>
                  {{ isUploading ? "上傳中..." : "上傳圖片" }}
                </label>
                <input
                  type="file"
                  id="articleImageFile"
                  class="d-none"
                  ref="fileInput"
                  accept="image/*"
                  @change="uploadImage"
                />

                <!-- 或貼上網址 -->
                <input
                  type="url"
                  class="form-control form-control-sm"
                  v-model.trim="tempArticle.image"
                  placeholder="或貼上圖片網址"
                  aria-label="封面圖網址"
                />
                <p v-if="uploadError" class="form-text text-danger mb-0">{{ uploadError }}</p>
              </div>

              <!-- 預覽 -->
              <div v-if="tempArticle.image" class="position-relative mb-3">
                <img :src="tempArticle.image" class="img-fluid w-100 border" alt="封面預覽" />
                <button
                  type="button"
                  class="btn btn-light btn-sm position-absolute top-0 end-0 m-2"
                  @click="tempArticle.image = ''"
                >
                  移除
                </button>
              </div>

              <!-- 標籤 -->
              <div class="mb-3">
                <label class="form-label">標籤</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="tagInput"
                  placeholder="請輸入標籤，用逗號分隔（例：跑步,健身,戶外）"
                />
                <small class="text-muted">多個標籤請用逗號「,」分隔</small>
              </div>
            </div>
            <!-- 右欄：資訊 -->
            <div class="col-sm-8">
              <div class="mb-3">
                <label class="form-label">標題</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="tempArticle.title"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label class="form-label">作者</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="tempArticle.author"
                    placeholder="請輸入作者"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label">排序</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="tempArticle.num"
                    placeholder="請輸入排序數字"
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label class="form-label">描述</label>
                <textarea
                  class="form-control"
                  v-model="tempArticle.description"
                  rows="3"
                  placeholder="請輸入描述"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">內文</label>
                <textarea
                  class="form-control"
                  v-model="tempArticle.content"
                  rows="10"
                  placeholder="請輸入文章內文"
                ></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="tempArticle.isPublic"
                    id="isPublic"
                  />
                  <label class="form-check-label" for="isPublic">是否公開</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="hideModal">取消</button>
          <!-- 上傳中不能按確認，避免圖片還沒傳完就存檔 -->
          <button
            type="button"
            class="btn btn-primary"
            :disabled="isUploading"
            @click="submitArticle"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixins from "@/mixins/modalMixins";

export default {
  mixins: [modalMixins],
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update-article"],
  data() {
    return {
      tempArticle: {},
      tagInput: "",
      isUploading: false, // 圖片上傳中
      uploadError: "", // 上傳失敗的訊息
    };
  },
  watch: {
    article: {
      handler(newVal) {
        this.tempArticle = { ...newVal };
        if (!this.tempArticle.tag) {
          this.tempArticle.tag = [];
        }
        if (this.tempArticle.isPublic === undefined) {
          this.tempArticle.isPublic = false;
        }
        this.tagInput = this.tempArticle.tag.join(",");
        // 重新打開時清掉上次的上傳狀態
        this.uploadError = "";
        if (this.$refs.fileInput) this.$refs.fileInput.value = "";
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 上傳封面圖到六角，成功後把網址填進去
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file-to-upload", file);
      const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/upload`;

      this.isUploading = true;
      this.uploadError = "";
      try {
        const res = await this.$http.post(api, formData);
        if (res.data.success) {
          this.tempArticle.image = res.data.imageUrl;
        } else {
          this.uploadError = res.data.message || "上傳失敗，請再試一次";
        }
      } catch {
        this.uploadError = "上傳失敗，請確認圖片大小或格式";
      } finally {
        this.isUploading = false;
        event.target.value = ""; // 清空，下次選同一張也能觸發
      }
    },
    submitArticle() {
      this.tempArticle.tag = this.tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      this.$emit("update-article", this.tempArticle);
    },
    addTag() {
      this.tempArticle.tag.push("");
    },
    removeTag(index) {
      this.tempArticle.tag.splice(index, 1);
    },
  },
};
</script>
