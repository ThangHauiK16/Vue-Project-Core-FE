<template>
  <div id="bannerCarousel" class="carousel slide" data-bs-ride="carousel">
    
    <!-- Indicators -->
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" class="active"></button>
      <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1"></button>
      <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="2"></button>
    </div>

    <!-- Slides -->
    <div class="carousel-inner rounded shadow-sm">
      <div class="carousel-item active">
        <img src="/src/assets/banner1.jpg" class="d-block w-100 banner-img" alt="Banner 1">
      </div>

      <div class="carousel-item">
        <img src="/src/assets/banner2.jpg" class="d-block w-100 banner-img" alt="Banner 2">
      </div>

      <div class="carousel-item">
        <img src="/src/assets/banner3.jpg" class="d-block w-100 banner-img" alt="Banner 3">
      </div>
    </div>

    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>

  </div>
</template>

<script setup>
</script>

<style scoped>
 .banner-img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
  image-rendering: -webkit-optimize-contrast;
}

</style>
