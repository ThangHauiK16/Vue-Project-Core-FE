<script setup>
import { onMounted, ref } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale,
  LineController, LineElement, PointElement,
  PieController, ArcElement, Tooltip, Legend
);

const revenueChart = ref(null);
const productChart = ref(null);
const orderChart = ref(null);


const metrics = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProductsSold: 0,
  revenueByMonth: [],
  productsByMonth: [],
  ordersByMonth: []
});

// const loadData = async () => {
//   // Fake dữ liệu demo — thay bằng API thật
//   metrics.value = {
//     totalRevenue: 128000000,
//     totalOrders: 230,
//     totalProductsSold: 540,
//     revenueByMonth: [12, 15, 18, 8, 20, 25, 30, 22, 19, 28, 32, 40],
//     productsByMonth: [20, 25, 30, 18, 26, 40, 50, 45, 38, 55, 60, 75],
//     ordersByMonth: [15, 20, 22, 18, 25, 30, 28, 35, 40, 42, 38, 50]
//   };
// };

const loadData = async () => {
  const res = await fetch("/api/dashboard/metrics"); 
  const data = await res.json();
  metrics.value = data;
};


onMounted(async () => {
  await loadData();

  new Chart(revenueChart.value, {
    type: "bar",
    data: {
      labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
      datasets: [
        {
          label: "Doanh thu (triệu VNĐ)",
          data: metrics.value.revenueByMonth,
          backgroundColor: "#4e73df"
        }
      ]
    }
  });

  new Chart(productChart.value, {
    type: "line",
    data: {
      labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
      datasets: [
        {
          label: "Sản phẩm bán",
          data: metrics.value.productsByMonth,
          borderColor: "#1cc88a",
          fill: false
        }
      ]
    }
  });


  new Chart(orderChart.value, {
    type: "pie",
    data: {
      labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
      datasets: [
        {
          backgroundColor: [
            "#4e73df","#1cc88a","#36b9cc","#f6c23e","#e74a3b","#858796",
            "#20c997","#fd7e14","#6f42c1","#0d6efd","#6610f2","#d63384"
          ],
          data: metrics.value.ordersByMonth
        }
      ]
    }
  });
});
</script>

<template>
  <div class="container mt-4">
    <h2 class="fw-bold mb-4 text-primary">📊 Thống Kê Doanh Số</h2>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="p-3 bg-primary text-white rounded shadow">
          <h5>Tổng doanh thu tháng</h5>
          <h2>{{ metrics.totalRevenue.toLocaleString("vi-VN") }} VNĐ</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="p-3 bg-success text-white rounded shadow">
          <h5>Tổng đơn hàng</h5>
          <h2>{{ metrics.totalOrders }}</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="p-3 bg-info text-white rounded shadow">
          <h5>Sản phẩm bán ra</h5>
          <h2>{{ metrics.totalProductsSold }}</h2>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <h5 class="text-center">Doanh Thu Theo Tháng</h5>
        <canvas ref="revenueChart"></canvas>
      </div>

      <div class="col-md-6 mb-4">
        <h5 class="text-center">Sản Phẩm Bán Theo Tháng</h5>
        <canvas ref="productChart"></canvas>
      </div>

      <div class="col-md-6 mx-auto">
        <h5 class="text-center">Số Đơn Theo Tháng</h5>
        <canvas ref="orderChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
