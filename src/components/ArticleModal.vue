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
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <!-- 左欄：圖片 -->
            <div class="col-sm-4">
              <div class="mb-3">
                <label class="form-label">封面圖網址</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="tempArticle.image"
                  placeholder="請輸入圖片連結"
                />
              </div>
              <img
                v-if="tempArticle.image"
                :src="tempArticle.image"
                class="img-fluid"
                alt="封面預覽"
              />
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
          <button type="button" class="btn btn-primary" @click="submitArticle">確認</button>
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
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    submitArticle() {
      // ← 新增這個方法
      this.tempArticle.tag = this.tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      console.log("submitArticle 送出：", this.tempArticle);
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
