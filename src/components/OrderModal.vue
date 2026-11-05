<template>
  <div
    class="modal fade"
    id="productModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>訂單細節</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" id="orderPrintArea">
          <div class="row">
            <div class="col-md-4">
              <h3>用戶資料</h3>
              <table class="table">
                <tbody v-if="tempOrder.user">
                  <tr>
                    <th style="width: 100px">姓名</th>
                    <td>{{ tempOrder.user.name }}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{{ tempOrder.user.email }}</td>
                  </tr>
                  <tr>
                    <th>電話</th>
                    <td>{{ tempOrder.user.tel }}</td>
                  </tr>
                  <tr>
                    <th>地址</th>
                    <td>{{ tempOrder.user.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-8">
              <h3>訂單細節</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th style="width: 100px">訂單編號</th>
                    <td>{{ tempOrder.id }}</td>
                  </tr>
                  <tr>
                    <th>下單時間</th>
                    <td>{{ $filters.date(tempOrder.create_at) }}</td>
                  </tr>
                  <tr>
                    <th>付款時間</th>
                    <td>
                      <span v-if="tempOrder.paid_date">
                        {{ $filters.date(tempOrder.paid_date) }}
                      </span>
                      <span v-else>時間不正確</span>
                    </td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <strong v-if="tempOrder.is_paid" class="text-success">已付款</strong>
                      <span v-else class="text-muted">尚未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>{{ $filters.currency(tempOrder.total) }}</td>
                  </tr>
                </tbody>
              </table>

              <h3>選購商品</h3>
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th style="width: 56px"></th>
                    <th>商品</th>
                    <th>尺寸／顏色</th>
                    <th>數量</th>
                    <th class="text-end">小計</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in tempOrder.products" :key="item.id">
                    <td>
                      <img
                        v-if="item.product.imageUrl"
                        :src="item.product.imageUrl"
                        :alt="item.product.title"
                        style="width: 48px; height: 48px; object-fit: cover"
                        class="rounded border"
                      />
                    </td>
                    <td>{{ item.product.title }}</td>
                    <td>
                      <span v-if="item.size" class="badge bg-secondary me-1">{{ item.size }}</span>
                      <span v-if="item.color">
                        <span
                          class="d-inline-block rounded-circle border me-1"
                          :style="{
                            width: '0.9rem',
                            height: '0.9rem',
                            backgroundColor: item.color.code || item.color,
                          }"
                        ></span>
                        <small class="text-muted">{{ item.color.name || item.color }}</small>
                      </span>
                      <span v-if="!item.size && !item.color" class="text-muted">—</span>
                    </td>
                    <td>{{ item.qty }} / {{ item.product.unit }}</td>
                    <td class="text-end">{{ $filters.currency(item.final_total) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-outline-dark" @click="print">
            <i class="fas fa-print me-1"></i>列印
          </button>
          <button type="button" class="btn btn-primary" @click="$emit('update-order', tempOrder)">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from "@/mixins/modalMixins";
import { printOrder } from "@/utils/printOrder";

export default {
  name: "orderModal",
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      status: {},
      modal: "",
      tempOrder: {},
      isPaid: false,
    };
  },
  emits: ["update-order"],
  mixins: [modalMixin],
  inject: ["emitter"],
  watch: {
    order() {
      this.tempOrder = this.order;
      this.isPaid = this.tempOrder.is_paid;
    },
  },
  methods: {
    print() {
      printOrder(this.tempOrder);
    },
  },
};
</script>
