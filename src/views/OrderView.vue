<template>
  <Loading :active="isLoading"></Loading>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, key) in orders" :key="key">
        <tr>
          <td>{{ $filters.date(item.create_at) }}</td>
          <td><span></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${item.id}`"
                v-model="item.is_paid"
                @change="updatePaid(item)"
              />
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">
                檢視
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelOrderModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"></OrderModal>
  <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"></DelModal>
  <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
</template>
<script>
import OrderModal from "@/components/OrderModal.vue";
import DelModal from "@/components/DelModal.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  components: { OrderModal, DelModal, Pagination },
  data() {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      isNew: false,
      isLoading: false,
      currentPage: 1,
    };
  },
  methods: {
    getOrders(currentPage = 1) {
      this.currentPage = currentPage;
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/orders/?page=${currentPage}`;
      console.log("打 API:", url); // ← 加這行
      this.isLoading = true;
      this.$http
        .get(url)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    delOrder() {
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/order/${this.tempOrder.id}`;
      this.isLoading = true;
      this.$http.delete(url).then((res) => {
        console.log(res);
        const delComponent = this.$refs.delModal;
        delComponent.hideModal();
        this.getOrders(this.currentPage);
      });
    },
    openModal(isNew, item) {
      this.tempOrder = { ...item };
      this.isNew = false;
      const orderComponent = this.$refs.orderModal;
      orderComponent.showModal();
    },
    openDelOrderModal(item) {
      this.tempOrder = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    updatePaid(item) {
      this.isLoading = true;
      const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/order/${item.id}`;
      const paid = { is_paid: item.is_paid };

      this.$http.put(api, { data: paid }).then((res) => {
        this.isLoading = false;
        this.getOrders(this.currentPage);
        this.$httppageMessageState(res, item.is_paid ? "更新付款" : "取消付款");
      });
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
