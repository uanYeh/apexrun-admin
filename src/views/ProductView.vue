<template>
  <Loading :active="isLoading"></Loading>
  <div class="text-end">
    <button class="btn btn-primary" type="button" @click.prevent="openModal(true)">
      新增一個產品
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody v-for="item in products" :key="item.id">
      <tr>
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">{{ $filters.currency(item.origin_price) }}</td>
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
  <Pagination :pages="pagination" @emit-pages="getProducts" />
  <ProductModal ref="ProductModal" :product="tempProduct" @update-product="updateProduct" />
  <DelModal ref="delModal" :item="tempProduct" @del-item="delProduct" />
</template>

<script>
import ProductModal from "@/components/ProductModal.vue";
import Pagination from "@/components/Pagination.vue";
import DelModal from "@/components/DelModal.vue";
import { currency } from "@/methods/filters";

export default {
  components: { ProductModal, DelModal, Pagination },
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
    };
  },
  inject: ["emitter"],
  methods: {
    currency,
    getProducts(page = 1) {
      const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/products/?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          // console.log(res.data);
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        }
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
      } else {
        this.tempProduct = { ...item };
      }
      this.isNew = isNew;
      const productComponent = this.$refs.ProductModal;
      productComponent.showModal();
    },
    updateProduct(item) {
      this.tempProduct = item;
      this.isLoading = true;
      //新增
      let api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product`;
      let httpMethod = "post";
      //編輯
      if (!this.isNew) {
        api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = "put";
      }
      console.log("送出資料:", JSON.stringify(this.tempProduct));
      const productComponent = this.$refs.ProductModal;
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          console.log(res.data.success);
          this.isLoading = false;
          productComponent.hideModal();
          this.$httppageMessageState(res, this.isNew ? "新增" : "更新");
        })
        .catch((err) => {
          this.isLoading = false;
          productComponent.hideModal();
          this.$httppageMessageState("push-message", {
            style: "danger",
            title: "API 錯誤",
            content: err.response?.data?.message?.join("、") || "請確認欄位填寫完整",
          });
        });
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    delProduct() {
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(url).then((res) => {
        // console.log(res.data);
        const delComponent = this.$refs.delModal;
        delComponent.hideModal();
        this.$httppageMessageState(res, "刪除");
        if (res.data.success) {
          this.getProducts();
        }
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
