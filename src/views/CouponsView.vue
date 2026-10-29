<template>
  <div>
    
    <div class="text-end mt-4">
      <button class="btn btn-primary" ">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
      </thead>
      <tbody>
      <tr >
        <td>名稱</td>
        <td>%</td>
        <td>日期</td>
        <td>
          <span  class="text-success">啟用</span>
          <span >未起用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm"
                    
            >編輯</button>
            <button class="btn btn-outline-danger btn-sm"
                   
            >刪除</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>