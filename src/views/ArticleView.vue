<template>
  <Loading :active="isLoading"></Loading>
  <div class="d-flex justify-content-between mb-3">
    <h4>文章管理</h4>
    <button class="btn btn-primary" @click="openArticleModal(true)">新增文章</button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>標題</th>
        <th>作者</th>
        <th>描述</th>
        <th>建立時間</th>
        <th>是否公開</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, key) in articles" :key="key">
        <td>{{ item.title }}</td>
        <td>{{ item.author }}</td>
        <td
          style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
        >
          {{ item.description }}
        </td>
        <td>{{ $filters.date(item.create_at) }}</td>
        <td>
          <span v-if="item.isPublic" class="text-success">公開</span>
          <span v-else class="text-danger">不公開</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openArticleModal(false, item)">
              編輯
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelArticleModal(item)">
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <ArticleModal
    :article="tempArticle"
    :isNew="isNew"
    ref="articleModal"
    @update-article="updateArticle"
  ></ArticleModal>
  <DelModal :item="tempArticle" ref="delModal" @del-item="delArticle"></DelModal>
  <Pagination :pages="pagination" @emit-pages="getArticles"></Pagination>
</template>

<script>
import ArticleModal from "@/components/ArticleModal.vue";
import DelModal from "@/components/DelModal.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  components: { ArticleModal, DelModal, Pagination },
  data() {
    return {
      articles: [],
      pagination: {},
      tempArticle: {},
      isNew: false,
      isLoading: false,
      currentPage: 1,
    };
  },
  inject: ["emitter"],
  methods: {
    getArticles(currentPage = 1) {
      this.currentPage = currentPage;
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/articles?page=${currentPage}`;
      this.isLoading = true;
      this.$http.get(url).then((res) => {
        this.articles = res.data.articles || [];
        this.pagination = res.data.pagination;
        this.isLoading = false;
        console.log("get文章列表：", res.data.articles);
      });
    },
    openArticleModal(isNew, item) {
      if (isNew) {
        this.tempArticle = {
          create_at: Math.floor(Date.now() / 1000),
          isPublic: false,
          tag: [],
        };
        this.isNew = isNew;
        const articleComponent = this.$refs.articleModal;
        articleComponent.showModal();
      } else {
        this.isNew = isNew;
        const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/article/${item.id}`;
        this.isLoading = true;
        this.$http.get(url).then((res) => {
          this.tempArticle = res.data.article;
          this.isLoading = false;
          const articleComponent = this.$refs.articleModal;
          articleComponent.showModal();
        });
      }
    },
    updateArticle(item) {
      this.tempArticle = item;
      this.isLoading = true;
      //新增
      let api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/article`;
      let httpMethod = "post";
      //編輯
      if (!this.isNew) {
        api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/article/${item.id}`;
        httpMethod = "put";
      }
      const articleComponent = this.$refs.articleModal;
      console.log("送出資料：", this.tempArticle);
      this.$http[httpMethod](api, { data: this.tempArticle })
        .then((res) => {
          this.isLoading = false;
          articleComponent.hideModal();
          this.$httppageMessageState(res, this.isNew ? "新增" : "更新");
          if (res.data.success) {
            this.getArticles(this.currentPage);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          articleComponent.hideModal();
          this.emitter.emit("push-message", {
            style: "danger",
            title: "錯誤",
            content: err.response?.data?.message?.join("、") || "請確認欄位填寫完整",
          });
        });
    },
    openDelArticleModal(item) {
      this.tempArticle = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    delArticle() {
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/article/${this.tempArticle.id}`;
      this.isLoading = true;
      this.$http.delete(url).then((res) => {
        this.isLoading = false;
        const delComponent = this.$refs.delModal;
        delComponent.hideModal();
        this.$httppageMessageState(res, "刪除");
        if (res.data.success) {
          this.getArticles(this.currentPage);
        }
      });
    },
  },
  created() {
    this.getArticles();
  },
};
</script>
