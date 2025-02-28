<template>
  <div>
    <!-- Hiển thị loading trước, ưu tiên cao nhất -->
    <div v-if="isLoading" class="loading-spinner-container">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Sau đó hiển thị lỗi nếu có -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- Cuối cùng kiểm tra dữ liệu và hiển thị tương ứng -->
    <div v-else-if="!shoeData" class="text-center">
      <p>Shoe not found.</p>
      <NuxtLink to="/" class="btn btn-primary">Back to Home</NuxtLink>
    </div>
    
    <!-- Hiển thị chi tiết sản phẩm khi đã có dữ liệu -->
    <div v-else class="shoe-details">
      <div class="shoe-details__image">
        <img :src="shoeData.imageUrl" :alt="shoeData.name">
      </div>
      <div class="shoe-details__content">
        <h1>{{ shoeData.name }}</h1>
        <p class="shoe-details__price">{{ formatPrice(shoeData.price) }}</p>
        <p><strong>Brand:</strong> {{ shoeData.brand }}</p>
        <p v-if="shoeData.stock > 0"><strong>In Stock:</strong> {{ shoeData.stock }}</p>
        <p v-else class="text-danger">Out of Stock</p>
        <p v-if="shoeData.description"><strong>Description:</strong> {{ shoeData.description }}</p>
        <div class="shoe-details__actions mt-3">
          <!-- Sửa đường dẫn Edit và thêm log cho button -->
          <button @click="navigateToEdit" class="btn btn-primary">Edit</button>
          <button @click="handleDelete" class="btn btn-danger">Delete</button>
          <NuxtLink to="/" class="btn">Back to Home</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const id = Number(route.params.id);
const isLoading = ref(true);
const error = ref(null);
const shoeData = ref(null);

// Thêm hàm điều hướng đến trang edit
const navigateToEdit = () => {
  console.log('Navigating to edit page for shoe ID:', id);
  // Sử dụng router.push thay vì NuxtLink
  router.push(`/shoes/${id}/edit`);
};

// Phần code còn lại giữ nguyên
const fetchShoe = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('Fetching shoe data...', id);
    const apiUrl = `${config.public.apiBase}/shoes/${id}`;
    
    const data = await $fetch(apiUrl);
    console.log('Received shoe data:', data);
    
    // Normalize numeric fields
    if (data) {
      if (typeof data.price === 'string') {
        data.price = parseFloat(data.price);
      }
      if (typeof data.stock === 'string') {
        data.stock = parseInt(data.stock);
      }
    }
    
    shoeData.value = data;
  } catch (err) {
    console.error('Error fetching shoe:', err);
    error.value = 'Failed to fetch shoe details';
  } finally {
    isLoading.value = false;
  }
};

// Fetch dữ liệu khi component được mount
onMounted(() => {
  fetchShoe();
});

const formatPrice = (price) => {
  // Chuyển đổi sang số nếu là chuỗi
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Kiểm tra nếu là số hợp lệ
  if (isNaN(numericPrice)) {
    return '$0.00';
  }
  
  return `$${numericPrice.toFixed(2)}`;
};

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this shoe?')) {
    try {
      const apiUrl = `${config.public.apiBase}/shoes/${id}`;
      await $fetch(apiUrl, {
        method: 'DELETE',
      });
      router.push('/');
    } catch (err) {
      console.error('Failed to delete shoe:', err);
      error.value = 'Failed to delete shoe';
    }
  }
};
</script>

<style scoped lang="scss">
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.shoe-details {
  display: flex;
  gap: 30px;
  margin-top: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &__image {
    flex: 0 0 40%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  &__content {
    flex: 1;
    padding: 2rem;
  }
  
  &__price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3498db;
    margin: 1rem 0;
  }
  
  &__actions {
    display: flex;
    gap: 10px;
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .shoe-details {
    flex-direction: column;
    
    &__image {
      flex: auto;
      max-height: 300px;
    }
  }
}
</style>