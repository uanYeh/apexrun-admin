export function printOrder(order) {
  const products = Object.values(order.products || {});

  const rows = products
    .map((item) => {
      const size = item.size || "—";
      const color = item.color ? item.color.name || item.color : "—";

      return `
      <tr>
        <td>☐</td>
        <td>${item.product.title}</td>
        <td>${size}</td>
        <td>${color}</td>
        <td style="text-align:center">${item.qty} / ${item.product.unit}</td>
      </tr>`;
    })
    .join("");

  const total = order.total || 0;
  const originTotal = products.reduce((sum, item) => sum + (item.total || 0), 0);
  const discount = originTotal - total;

  const summaryRows = `
    <tfoot>
      <tr>
        <td colspan="4" style="text-align:right;border:none;padding:4px 12px">商品總計</td>
        <td style="text-align:right;border:none;padding:4px 12px;white-space:nowrap">NT$ ${Number(originTotal).toLocaleString()}</td>
      </tr>
      ${
        discount > 0
          ? `
      <tr>
        <td colspan="4" style="text-align:right;border:none;padding:4px 12px;color:#c00">優惠券折扣</td>
        <td style="text-align:right;border:none;padding:4px 12px;color:#c00;white-space:nowrap">- NT$ ${Math.round(discount).toLocaleString()}</td>
      </tr>`
          : ""
      }
      <tr>
        <td colspan="4" style="text-align:right;border:none;border-top:2px solid #333;padding:8px 12px;font-weight:bold">實付金額</td>
        <td style="text-align:right;border:none;border-top:2px solid #333;padding:8px 12px;font-weight:bold;white-space:nowrap">NT$ ${Math.round(total).toLocaleString()}</td>
      </tr>
    </tfoot>
  `;

  _openPrint(
    `訂單 ${order.id}`,
    `
    <h2>訂單明細</h2>
    <div class="meta">訂單編號：${order.id}</div>

    <div class="section-title">訂單資訊</div>
    <table>
      <tr>
        <th style="width:90px">姓名</th>
        <td style="width:160px">${order.user?.name || ""}</td>
        <th style="width:90px">下單時間</th>
        <td>${order.create_at ? new Date(order.create_at * 1000).toLocaleDateString() : ""}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${order.user?.email || ""}</td>
        <th>付款狀態</th>
        <td>${order.is_paid ? "已付款" : "尚未付款"}</td>
      </tr>
      <tr>
        <th>電話</th>
        <td>${order.user?.tel || ""}</td>
        <th>總金額</th>
        <td>NT$ ${Math.round(total).toLocaleString()}</td>
      </tr>
      <tr>
        <th>地址</th>
        <td colspan="3">${order.user?.address || ""}</td>
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
      <tbody>${rows}</tbody>
      ${summaryRows}
    </table>
  `,
  );
}

export function printShipping(order) {
  const products = Object.values(order.products || {});

  const rows = products
    .map((item) => {
      const size = item.size || "—";
      const color = item.color ? item.color.name || item.color : "—";

      return `
      <tr>
        <td style="text-align:center;font-size:18px">☐</td>
        <td>${item.product.title}</td>
        <td style="text-align:center">${size}</td>
        <td style="text-align:center">${color}</td>
        <td style="text-align:center">${item.qty}</td>
      </tr>`;
    })
    .join("");

  _openPrint(
    `出貨單 ${order.id}`,
    `
    <h2>出貨單</h2>
    <div class="meta">訂單編號：${order.id} ／ ${order.create_at ? new Date(order.create_at * 1000).toLocaleDateString() : ""}</div>

    <table style="margin-bottom:16px">
      <tr>
        <th style="width:90px">收件人</th>
        <td style="width:200px">${order.user?.name || ""}</td>
        <th style="width:90px">電話</th>
        <td>${order.user?.tel || ""}</td>
      </tr>
      <tr>
        <th>地址</th>
        <td colspan="3">${order.user?.address || ""}</td>
      </tr>
    </table>

    <table class="line-table">
      <thead>
        <tr>
          <th style="width:36px">✓</th>
          <th>商品</th>
          <th style="text-align:center;width:80px">尺寸</th>
          <th style="text-align:center;width:80px">顏色</th>
          <th style="text-align:center;width:60px">數量</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="margin-top:32px;font-size:12px;color:#999">出貨人：＿＿＿＿＿＿　　日期：＿＿＿＿＿＿</div>
  `,
  );
}

function _openPrint(title, body) {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
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
      <body>${body}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}
