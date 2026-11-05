import{B as e,D as t,E as n,O as r,_ as i,a,f as o,g as s,h as c,j as l,l as u,m as d,o as f,v as p,y as m,z as h}from"./index-Bufm5M_o.js";import{n as ee,t as g}from"./DelModal-8yqJVCuQ.js";import{t as _}from"./Pagination-BwMJ-yRb.js";function v(e){let t=Object.values(e.products||{}),n=t.map(e=>{let t=e.size||`—`,n=e.color?e.color.name||e.color:`—`;return`
      <tr>
        <td>☐</td>
        <td>${e.product.title}</td>
        <td>${t}</td>
        <td>${n}</td>
        <td style="text-align:center">${e.qty} / ${e.product.unit}</td>
      </tr>`}).join(``),r=e.total||0,i=t.reduce((e,t)=>e+(t.total||0),0),a=i-r,o=`
    <tfoot>
      <tr>
        <td colspan="4" style="text-align:right;border:none;padding:4px 12px">商品總計</td>
        <td style="text-align:right;border:none;padding:4px 12px;white-space:nowrap">NT$ ${Number(i).toLocaleString()}</td>
      </tr>
      ${a>0?`
      <tr>
        <td colspan="4" style="text-align:right;border:none;padding:4px 12px;color:#c00">優惠券折扣</td>
        <td style="text-align:right;border:none;padding:4px 12px;color:#c00;white-space:nowrap">- NT$ ${Math.round(a).toLocaleString()}</td>
      </tr>`:``}
      <tr>
        <td colspan="4" style="text-align:right;border:none;border-top:2px solid #333;padding:8px 12px;font-weight:bold">實付金額</td>
        <td style="text-align:right;border:none;border-top:2px solid #333;padding:8px 12px;font-weight:bold;white-space:nowrap">NT$ ${Math.round(r).toLocaleString()}</td>
      </tr>
    </tfoot>
  `;y(`訂單 ${e.id}`,`
    <h2>訂單明細</h2>
    <div class="meta">訂單編號：${e.id}</div>

    <div class="section-title">訂單資訊</div>
    <table>
      <tr>
        <th style="width:90px">姓名</th>
        <td style="width:160px">${e.user?.name||``}</td>
        <th style="width:90px">下單時間</th>
        <td>${e.create_at?new Date(e.create_at*1e3).toLocaleDateString():``}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${e.user?.email||``}</td>
        <th>付款狀態</th>
        <td>${e.is_paid?`已付款`:`尚未付款`}</td>
      </tr>
      <tr>
        <th>電話</th>
        <td>${e.user?.tel||``}</td>
        <th>總金額</th>
        <td>NT$ ${Math.round(r).toLocaleString()}</td>
      </tr>
      <tr>
        <th>地址</th>
        <td colspan="3">${e.user?.address||``}</td>
      </tr>
    </table>

    <div class="section-title">選購商品</div>
    <table class="line-table">
      <thead>
        <tr>
          <th style="width:36px">✓</th>
          <th>商品</th>
          <th style="width:80px">尺寸</th>
          <th style="width:80px">顏色</th>
          <th style="text-align:center;width:80px">數量</th>
        </tr>
      </thead>
      <tbody>${n}</tbody>
      ${o}
    </table>
  `)}function y(e,t){let n=window.open(``,`_blank`);n.document.write(`
    <html>
      <head>
        <title>${e}</title>
        <style>
          body { font-family: sans-serif; padding: 32px; font-size: 13px; color: #333; }
          h2 { margin-bottom: 4px; }
          .meta { margin-bottom: 16px; color: #555; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; vertical-align: middle; }
          th { background: #f5f5f5; font-weight: 600; white-space: nowrap; }
          .section-title { font-size: 14px; font-weight: bold; margin: 20px 0 8px; }
          .line-table th,
          .line-table td { border: none; border-bottom: 1px solid #ddd; background: none; }
          .line-table thead th { border-bottom: 2px solid #333; }
          .line-table tfoot td { border: none; }
        </style>
      </head>
      <body>${t}</body>
    </html>
  `),n.document.close(),n.focus(),n.print(),n.close()}var b={name:`orderModal`,props:{order:{type:Object,default(){return{}}}},data(){return{status:{},modal:``,tempOrder:{},isPaid:!1}},emits:[`update-order`],mixins:[ee],inject:[`emitter`],watch:{order(){this.tempOrder=this.order,this.isPaid=this.tempOrder.is_paid}},methods:{print(){v(this.tempOrder)}}},x={class:`modal fade`,id:`productModal`,tabindex:`-1`,role:`dialog`,"aria-labelledby":`exampleModalLabel`,"aria-hidden":`true`,ref:`modal`},S={class:`modal-dialog modal-xl`,role:`document`},C={class:`modal-content border-0`},w={class:`modal-body`,id:`orderPrintArea`},T={class:`row`},E={class:`col-md-4`},D={class:`table`},O={key:0},k={class:`col-md-8`},A={class:`table`},j={key:0},M={key:1},N={key:0,class:`text-success`},P={key:1,class:`text-muted`},F={class:`table align-middle`},I=[`src`,`alt`],L={key:0,class:`badge bg-secondary me-1`},R={key:1},z={class:`text-muted`},B={key:2,class:`text-muted`},V={class:`text-end`},H={class:`modal-footer`};function U(r,a,c,l,u,f){return n(),i(`div`,x,[d(`div`,S,[d(`div`,C,[a[17]||=d(`div`,{class:`modal-header bg-dark text-white`},[d(`h5`,{class:`modal-title`,id:`exampleModalLabel`},[d(`span`,null,`訂單細節`)]),d(`button`,{type:`button`,class:`btn-close btn-close-white`,"data-bs-dismiss":`modal`,"aria-label":`Close`})],-1),d(`div`,w,[d(`div`,T,[d(`div`,E,[a[6]||=d(`h3`,null,`用戶資料`,-1),d(`table`,D,[u.tempOrder.user?(n(),i(`tbody`,O,[d(`tr`,null,[a[2]||=d(`th`,{style:{width:`100px`}},`姓名`,-1),d(`td`,null,e(u.tempOrder.user.name),1)]),d(`tr`,null,[a[3]||=d(`th`,null,`Email`,-1),d(`td`,null,e(u.tempOrder.user.email),1)]),d(`tr`,null,[a[4]||=d(`th`,null,`電話`,-1),d(`td`,null,e(u.tempOrder.user.tel),1)]),d(`tr`,null,[a[5]||=d(`th`,null,`地址`,-1),d(`td`,null,e(u.tempOrder.user.address),1)])])):s(``,!0)])]),d(`div`,k,[a[13]||=d(`h3`,null,`訂單細節`,-1),d(`table`,A,[d(`tbody`,null,[d(`tr`,null,[a[7]||=d(`th`,{style:{width:`100px`}},`訂單編號`,-1),d(`td`,null,e(u.tempOrder.id),1)]),d(`tr`,null,[a[8]||=d(`th`,null,`下單時間`,-1),d(`td`,null,e(r.$filters.date(u.tempOrder.create_at)),1)]),d(`tr`,null,[a[9]||=d(`th`,null,`付款時間`,-1),d(`td`,null,[u.tempOrder.paid_date?(n(),i(`span`,j,e(r.$filters.date(u.tempOrder.paid_date)),1)):(n(),i(`span`,M,`時間不正確`))])]),d(`tr`,null,[a[10]||=d(`th`,null,`付款狀態`,-1),d(`td`,null,[u.tempOrder.is_paid?(n(),i(`strong`,N,`已付款`)):(n(),i(`span`,P,`尚未付款`))])]),d(`tr`,null,[a[11]||=d(`th`,null,`總金額`,-1),d(`td`,null,e(r.$filters.currency(u.tempOrder.total)),1)])])]),a[14]||=d(`h3`,null,`選購商品`,-1),d(`table`,F,[a[12]||=d(`thead`,null,[d(`tr`,null,[d(`th`,{style:{width:`56px`}}),d(`th`,null,`商品`),d(`th`,null,`尺寸／顏色`),d(`th`,null,`數量`),d(`th`,{class:`text-end`},`小計`)])],-1),d(`tbody`,null,[(n(!0),i(o,null,t(u.tempOrder.products,t=>(n(),i(`tr`,{key:t.id},[d(`td`,null,[t.product.imageUrl?(n(),i(`img`,{key:0,src:t.product.imageUrl,alt:t.product.title,style:{width:`48px`,height:`48px`,"object-fit":`cover`},class:`rounded border`},null,8,I)):s(``,!0)]),d(`td`,null,e(t.product.title),1),d(`td`,null,[t.size?(n(),i(`span`,L,e(t.size),1)):s(``,!0),t.color?(n(),i(`span`,R,[d(`span`,{class:`d-inline-block rounded-circle border me-1`,style:h({width:`0.9rem`,height:`0.9rem`,backgroundColor:t.color.code||t.color})},null,4),d(`small`,z,e(t.color.name||t.color),1)])):s(``,!0),!t.size&&!t.color?(n(),i(`span`,B,`—`)):s(``,!0)]),d(`td`,null,e(t.qty)+` / `+e(t.product.unit),1),d(`td`,V,e(r.$filters.currency(t.final_total)),1)]))),128))])])])])]),d(`div`,H,[a[16]||=d(`button`,{type:`button`,class:`btn btn-outline-secondary`,"data-bs-dismiss":`modal`},` 取消 `,-1),d(`button`,{type:`button`,class:`btn btn-outline-dark`,onClick:a[0]||=(...e)=>f.print&&f.print(...e)},[...a[15]||=[d(`i`,{class:`fas fa-print me-1`},null,-1),p(`列印 `,-1)]]),d(`button`,{type:`button`,class:`btn btn-primary`,onClick:a[1]||=e=>r.$emit(`update-order`,u.tempOrder)},` 確認 `)])])])],512)}var W=a(b,[[`render`,U]]),G=10,te={components:{OrderModal:W,DelModal:g,Pagination:_},data(){return{orders:[],pagination:{},tempOrder:{},isLoading:!1,currentPage:1,allOrders:[],isLoadingAll:!1,keyword:``,dateFrom:``,dateTo:``,filterPage:1}},computed:{isFiltering(){return!!(this.keyword||this.dateFrom||this.dateTo)},filteredOrders(){let e=this.keyword.toLowerCase(),t=this.dateFrom?new Date(`${this.dateFrom}T00:00:00`).getTime()/1e3:null,n=this.dateTo?new Date(`${this.dateTo}T23:59:59`).getTime()/1e3:null;return this.allOrders.filter(r=>{let i=!e||[r.id,r.user?.name,r.user?.email].some(t=>(t||``).toLowerCase().includes(e)),a=t===null||r.create_at>=t,o=n===null||r.create_at<=n;return i&&a&&o})},filterPagination(){let e=Math.max(1,Math.ceil(this.filteredOrders.length/G));return{total_pages:e,current_page:this.filterPage,has_pre:this.filterPage>1,has_next:this.filterPage<e}},displayOrders(){if(!this.isFiltering)return this.orders;let e=(this.filterPage-1)*G;return this.filteredOrders.slice(e,e+G)}},watch:{isFiltering(e){e&&!this.allOrders.length&&this.getAllOrders()},keyword(){this.filterPage=1},dateFrom(){this.filterPage=1},dateTo(){this.filterPage=1}},methods:{getOrders(e=1){this.currentPage=e;let t=`https://vue3-course-api.hexschool.io/v2/api/una607api/admin/orders/?page=${e}`;this.isLoading=!0,this.$http.get(t).then(e=>{this.orders=e.data.orders,this.pagination=e.data.pagination}).catch(e=>{console.error(`取得訂單失敗：`,e)}).finally(()=>{this.isLoading=!1})},async getAllOrders(){this.isLoadingAll=!0;let e=`https://vue3-course-api.hexschool.io/v2/api/una607api/admin/orders/?page=`;try{let t=await this.$http.get(`${e}1`),n=t.data.orders||[],r=t.data.pagination?.total_pages||1;for(let t=2;t<=r;t+=1){let r=await this.$http.get(`${e}${t}`);n=n.concat(r.data.orders||[])}this.allOrders=n}catch(e){console.error(`取得全部訂單失敗：`,e)}finally{this.isLoadingAll=!1}},changePage(e){this.isFiltering?this.filterPage=e:this.getOrders(e)},clearFilters(){this.keyword=``,this.dateFrom=``,this.dateTo=``},refreshOrders(){this.getOrders(this.currentPage),this.allOrders.length&&this.getAllOrders()},delOrder(){let e=`https://vue3-course-api.hexschool.io/v2/api/una607api/admin/order/${this.tempOrder.id}`;this.isLoading=!0,this.$http.delete(e).then(e=>{this.$refs.delModal.hideModal(),this.$httppageMessageState(e,`刪除`),this.refreshOrders()}).catch(e=>{console.error(`刪除訂單失敗：`,e)}).finally(()=>{this.isLoading=!1})},openModal(e){this.tempOrder={...e},this.$refs.orderModal.showModal()},openDelOrderModal(e){this.tempOrder={...e},this.$refs.delModal.showModal()},updatePaid(e){this.isLoading=!0;let t=`https://vue3-course-api.hexschool.io/v2/api/una607api/admin/order/${e.id}`,n={is_paid:e.is_paid};this.$http.put(t,{data:n}).then(t=>{this.$httppageMessageState(t,e.is_paid?`更新付款`:`取消付款`),this.refreshOrders()}).catch(e=>{console.error(`更新付款狀態失敗：`,e)}).finally(()=>{this.isLoading=!1})},variantsOf(e){return Array.isArray(e.variants)&&e.variants.length?e.variants:[{size:``,color:``,qty:e.qty}]},variantLabel(e){return[e.color,e.size].filter(Boolean).join(` / `)},couponOf(e){let t=Object.values(e.products||{}).find(e=>e.coupon&&e.coupon.code);return t?t.coupon.code:``}},created(){this.getOrders()}},K={class:`d-flex flex-wrap align-items-center gap-3`},q={class:`input-group`,style:{width:`280px`}},J={class:`d-flex align-items-center gap-2`},Y=[`max`],X=[`min`],Z={key:0,class:`d-flex align-items-center gap-3 mt-2`},Q={key:0,class:`text-muted`},ne={key:1,class:`text-muted`},re={class:`table align-middle mt-4`},ie={class:`text-muted user-select-all`},ae={class:`text-muted`},oe={class:`list-unstyled mb-0`},se={key:0,class:`text-muted`},ce={class:`text-right`},le={key:0,class:`text-success`},ue={class:`form-check form-switch`},de=[`id`,`onUpdate:modelValue`,`onChange`],fe=[`for`],pe={key:0},$={key:1},me={class:`btn-group`},he=[`onClick`],ge=[`onClick`],_e={key:1,class:`text-center text-muted`};function ve(a,h,ee,g,_,v){let y=r(`Loading`),b=r(`OrderModal`),x=r(`DelModal`),S=r(`Pagination`);return n(),i(o,null,[m(y,{active:_.isLoading},null,8,[`active`]),d(`div`,K,[d(`div`,q,[h[4]||=d(`span`,{class:`input-group-text bg-white`},[d(`i`,{class:`bi bi-search`})],-1),l(d(`input`,{type:`search`,class:`form-control`,"onUpdate:modelValue":h[0]||=e=>_.keyword=e,placeholder:`訂單編號、姓名、Email`,"aria-label":`搜尋訂單`},null,512),[[u,_.keyword,void 0,{trim:!0}]])]),d(`div`,J,[h[5]||=d(`label`,{for:`dateFrom`,class:`text-nowrap mb-0`},`日期`,-1),l(d(`input`,{type:`date`,id:`dateFrom`,class:`form-control`,style:{width:`160px`},"onUpdate:modelValue":h[1]||=e=>_.dateFrom=e,max:_.dateTo||void 0,"aria-label":`開始日期`},null,8,Y),[[u,_.dateFrom]]),h[6]||=d(`span`,null,`~`,-1),l(d(`input`,{type:`date`,class:`form-control`,style:{width:`160px`},"onUpdate:modelValue":h[2]||=e=>_.dateTo=e,min:_.dateFrom||void 0,"aria-label":`結束日期`},null,8,X),[[u,_.dateTo]])])]),v.isFiltering?(n(),i(`div`,Z,[_.isLoadingAll?(n(),i(`span`,Q,[...h[7]||=[d(`span`,{class:`spinner-border spinner-border-sm me-1`,role:`status`},null,-1),p(` 讀取全部訂單中... `,-1)]])):(n(),i(`span`,ne,`找到 `+e(v.filteredOrders.length)+` 筆訂單`,1)),d(`button`,{type:`button`,class:`btn btn-link btn-sm p-0`,onClick:h[3]||=(...e)=>v.clearFilters&&v.clearFilters(...e)},`清除篩選`)])):s(``,!0),d(`table`,re,[h[9]||=d(`thead`,null,[d(`tr`,null,[d(`th`,null,`購買時間／訂單編號`),d(`th`,null,`顧客`),d(`th`,null,`購買款項`),d(`th`,null,`應付金額`),d(`th`,null,`是否付款`),d(`th`,null,`編輯`)])],-1),d(`tbody`,null,[(n(!0),i(o,null,t(v.displayOrders,r=>(n(),i(`tr`,{key:r.id},[d(`td`,null,[d(`div`,null,e(a.$filters.date(r.create_at)),1),d(`small`,ie,e(r.id),1)]),d(`td`,null,[d(`div`,null,e(r.user?.name),1),d(`small`,ae,e(r.user?.email),1)]),d(`td`,null,[d(`ul`,oe,[(n(!0),i(o,null,t(r.products,(r,a)=>(n(),i(o,{key:a},[(n(!0),i(o,null,t(v.variantsOf(r),(t,o)=>(n(),i(`li`,{key:`${a}-${o}`},[p(e(r.product.title)+` `,1),v.variantLabel(t)?(n(),i(`span`,se,`（`+e(v.variantLabel(t))+`）`,1)):s(``,!0),p(` 數量：`+e(t.qty)+` `+e(r.product.unit),1)]))),128))],64))),128))])]),d(`td`,ce,[d(`div`,null,`$`+e(a.$filters.currency(Math.round(r.total))),1),v.couponOf(r)?(n(),i(`small`,le,[h[8]||=d(`i`,{class:`bi bi-tag-fill`},null,-1),p(` `+e(v.couponOf(r)),1)])):s(``,!0)]),d(`td`,null,[d(`div`,ue,[l(d(`input`,{class:`form-check-input`,type:`checkbox`,id:`paidSwitch${r.id}`,"onUpdate:modelValue":e=>r.is_paid=e,onChange:e=>v.updatePaid(r)},null,40,de),[[f,r.is_paid]]),d(`label`,{class:`form-check-label`,for:`paidSwitch${r.id}`},[r.is_paid?(n(),i(`span`,pe,`已付款`)):(n(),i(`span`,$,`未付款`))],8,fe)])]),d(`td`,null,[d(`div`,me,[d(`button`,{class:`btn btn-outline-primary btn-sm`,onClick:e=>v.openModal(r)},`檢視`,8,he),d(`button`,{class:`btn btn-outline-danger btn-sm`,onClick:e=>v.openDelOrderModal(r)},` 刪除 `,8,ge)])])]))),128))])]),v.isFiltering&&!_.isLoadingAll&&!v.filteredOrders.length?(n(),i(`p`,_e,` 找不到符合條件的訂單 `)):s(``,!0),m(b,{order:_.tempOrder,ref:`orderModal`,onUpdatePaid:v.updatePaid},null,8,[`order`,`onUpdatePaid`]),m(x,{item:_.tempOrder,ref:`delModal`,onDelItem:v.delOrder},null,8,[`item`,`onDelItem`]),!v.isFiltering||v.filteredOrders.length?(n(),c(S,{key:2,pages:v.isFiltering?v.filterPagination:_.pagination,onEmitPages:v.changePage},null,8,[`pages`,`onEmitPages`])):s(``,!0)],64)}var ye=a(te,[[`render`,ve]]);export{ye as default};