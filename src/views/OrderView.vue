<template>
  <Loading :active="isLoading"></Loading>

  <!-- ✅ 新增：搜尋 + 日期區段 -->
  <div class="d-flex flex-wrap align-items-center gap-3">
    <!-- 搜尋訂單編號、姓名、Email -->
    <div class="input-group" style="width: 280px">
      <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
      <input
        type="search"
        class="form-control"
        v-model.trim="keyword"
        placeholder="訂單編號、姓名、Email"
        aria-label="搜尋訂單"
      />
    </div>

    <!-- 日期區段 -->
    <div class="d-flex align-items-center gap-2">
      <label for="dateFrom" class="text-nowrap mb-0">日期</label>
      <input
        type="date"
        id="dateFrom"
        class="form-control"
        style="width: 160px"
        v-model="dateFrom"
        :max="dateTo || undefined"
        aria-label="開始日期"
      />
      <span>~</span>
      <input
        type="date"
        class="form-control"
        style="width: 160px"
        v-model="dateTo"
        :min="dateFrom || undefined"
        aria-label="結束日期"
      />
    </div>
  </div>

  <!-- 篩選結果數量 + 清除（下一行） -->
  <div v-if="isFiltering" class="d-flex align-items-center gap-3 mt-2">
    <span v-if="isLoadingAll" class="text-muted">
      <span class="spinner-border spinner-border-sm me-1" role="status"></span>
      讀取全部訂單中...
    </span>
    <span v-else class="text-muted">找到 {{ filteredOrders.length }} 筆訂單</span>
    <button type="button" class="btn btn-link btn-sm p-0" @click="clearFilters">清除篩選</button>
  </div>

  <table class="table align-middle mt-4">
    <thead>
      <tr>
        <th>購買時間／訂單編號</th>
        <th>顧客</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in displayOrders" :key="item.id">
        <!-- 購買時間 + 訂單編號 -->
        <td>
          <div>{{ $filters.date(item.create_at) }}</div>
          <small class="text-muted user-select-all">{{ item.id }}</small>
        </td>

        <!-- 顧客姓名 + Email -->
        <td>
          <div>{{ item.user?.name }}</div>
          <small class="text-muted">{{ item.user?.email }}</small>
        </td>

        <!-- 購買款項：每個規格一行 -->
        <td>{{ Object.values(item.products || {}).length }} 項商品</td>

        <!-- 金額 + 折扣碼 -->
        <td class="text-right">
          <div>${{ $filters.currency(Math.round(item.total)) }}</div>
          <small v-if="couponOf(item)" class="text-success">
            <i class="bi bi-tag-fill"></i> {{ couponOf(item) }}
          </small>
        </td>

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
            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">檢視</button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelOrderModal(item)">
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="isFiltering && !isLoadingAll && !filteredOrders.length" class="text-center text-muted">
    找不到符合條件的訂單
  </p>

  <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"></OrderModal>
  <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"></DelModal>
  <!-- 有篩選時用自己算的分頁，沒有時用 API 的分頁 -->
  <Pagination
    v-if="!isFiltering || filteredOrders.length"
    :pages="isFiltering ? filterPagination : pagination"
    @emit-pages="changePage"
  ></Pagination>
</template>
<script>
import OrderModal from "@/components/OrderModal.vue";
import DelModal from "@/components/DelModal.vue";
import Pagination from "@/components/Pagination.vue";

// 篩選結果每頁幾筆
const PER_PAGE = 10;

export default {
  components: { OrderModal, DelModal, Pagination },
  data() {
    return {
      orders: [], // 目前這一頁的訂單（API 分頁）
      pagination: {},
      tempOrder: {},
      isLoading: false,
      currentPage: 1,

      // ===== ✅ 搜尋 =====
      allOrders: [], // 全部訂單（搜尋時才抓）
      isLoadingAll: false, // 正在讀取全部訂單
      keyword: "", // 訂單編號、姓名、Email
      dateFrom: "", // 開始日期，例如 "2026-11-01"
      dateTo: "", // 結束日期
      filterPage: 1, // 篩選結果在第幾頁
    };
  },
  computed: {
    // 有沒有任何篩選條件
    isFiltering() {
      return Boolean(this.keyword || this.dateFrom || this.dateTo);
    },
    // 符合條件的全部訂單
    filteredOrders() {
      const kw = this.keyword.toLowerCase();
      // 日期換成秒數（API 的 create_at 是秒）
      const from = this.dateFrom ? new Date(`${this.dateFrom}T00:00:00`).getTime() / 1000 : null;
      const to = this.dateTo ? new Date(`${this.dateTo}T23:59:59`).getTime() / 1000 : null;

      return this.allOrders.filter((order) => {
        // 訂單編號、姓名、Email
        const matchKeyword =
          !kw ||
          [order.id, order.user?.name, order.user?.email].some((t) =>
            (t || "").toLowerCase().includes(kw),
          );
        // 日期區段：只填開始就是「之後」，只填結束就是「之前」
        const matchFrom = from === null || order.create_at >= from;
        const matchTo = to === null || order.create_at <= to;
        return matchKeyword && matchFrom && matchTo;
      });
    },
    // 篩選結果的頁碼資訊（格式和 API 的 pagination 一樣）
    filterPagination() {
      const totalPages = Math.max(1, Math.ceil(this.filteredOrders.length / PER_PAGE));
      return {
        total_pages: totalPages,
        current_page: this.filterPage,
        has_pre: this.filterPage > 1,
        has_next: this.filterPage < totalPages,
      };
    },
    // 表格要顯示的訂單
    displayOrders() {
      if (!this.isFiltering) return this.orders;
      const start = (this.filterPage - 1) * PER_PAGE;
      return this.filteredOrders.slice(start, start + PER_PAGE);
    },
  },
  watch: {
    // 一開始搜尋時，才去抓全部訂單
    isFiltering(val) {
      if (val && !this.allOrders.length) this.getAllOrders();
    },
    // 改任何條件，都回到第 1 頁
    keyword() {
      this.filterPage = 1;
    },
    dateFrom() {
      this.filterPage = 1;
    },
    dateTo() {
      this.filterPage = 1;
    },
  },
  methods: {
    getOrders(currentPage = 1) {
      this.currentPage = currentPage;
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/orders/?page=${currentPage}`;
      this.isLoading = true;
      this.$http
        .get(url)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          console.error("取得訂單失敗：", err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // ✅ 新增：一頁一頁抓，把全部訂單合在一起
    async getAllOrders() {
      this.isLoadingAll = true;
      const base = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/orders/?page=`;
      try {
        const first = await this.$http.get(`${base}1`);
        let all = first.data.orders || [];
        const totalPages = first.data.pagination?.total_pages || 1;
        for (let page = 2; page <= totalPages; page += 1) {
          const res = await this.$http.get(`${base}${page}`);
          all = all.concat(res.data.orders || []);
        }
        this.allOrders = all;
      } catch (err) {
        console.error("取得全部訂單失敗：", err);
      } finally {
        this.isLoadingAll = false;
      }
    },
    // 換頁：有篩選時換自己的頁，沒有時跟 API 要那一頁
    changePage(page) {
      if (this.isFiltering) {
        this.filterPage = page;
      } else {
        this.getOrders(page);
      }
    },
    // 清除所有篩選條件
    clearFilters() {
      this.keyword = "";
      this.dateFrom = "";
      this.dateTo = "";
    },
    // 重新整理：目前這一頁 + 全部訂單（有抓過才更新）
    refreshOrders() {
      this.getOrders(this.currentPage);
      if (this.allOrders.length) this.getAllOrders();
    },
    delOrder() {
      const url = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/order/${this.tempOrder.id}`;
      this.isLoading = true;
      this.$http
        .delete(url)
        .then((res) => {
          this.$refs.delModal.hideModal();
          this.$httppageMessageState(res, "刪除");
          this.refreshOrders();
        })
        .catch((err) => {
          console.error("刪除訂單失敗：", err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    openModal(item) {
      this.tempOrder = { ...item };
      this.$refs.orderModal.showModal();
    },
    openDelOrderModal(item) {
      this.tempOrder = { ...item };
      this.$refs.delModal.showModal();
    },
    updatePaid(item) {
      this.isLoading = true;
      const api = `${import.meta.env.VITE_APP_API}api/${import.meta.env.VITE_APP_PATH}/admin/order/${item.id}`;
      const paid = { is_paid: item.is_paid };

      this.$http
        .put(api, { data: paid })
        .then((res) => {
          this.$httppageMessageState(res, item.is_paid ? "更新付款" : "取消付款");
          this.refreshOrders();
        })
        .catch((err) => {
          console.error("更新付款狀態失敗：", err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // ===== 顯示用的小工具 =====
    // 取得某個商品的規格明細；舊訂單沒有規格的話，當成一行
    variantsOf(product) {
      if (Array.isArray(product.variants) && product.variants.length) {
        return product.variants;
      }
      return [{ size: "", color: "", qty: product.qty }];
    },
    // 規格文字，例如「Black / M」
    variantLabel(v) {
      return [v.color, v.size].filter(Boolean).join(" / ");
    },
    // 這筆訂單用了哪一組折扣碼
    couponOf(order) {
      const products = Object.values(order.products || {});
      const found = products.find((p) => p.coupon && p.coupon.code);
      return found ? found.coupon.code : "";
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
