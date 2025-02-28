<template>
    <div class="container mt-4">
      <h1>API Debug</h1>
      
      <div class="card mb-4">
        <div class="card__content">
          <h2>Cấu hình:</h2>
          <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
          <p><strong>API Endpoint:</strong> {{ apiBaseUrl }}/shoes</p>
          
          <div class="mt-2">
            <button @click="testDirectFetch" class="btn btn-primary">Test API trực tiếp</button>
            <button @click="testStoreFetch" class="btn btn-success ml-2">Test qua Store</button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="card mb-4">
        <div class="card__content">
          <div class="loading-spinner-container">
            <div class="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="card mb-4 bg-danger" style="background-color: #f8d7da; color: #721c24;">
        <div class="card__content">
          <h3>Lỗi:</h3>
          <pre>{{ error }}</pre>
        </div>
      </div>
      
      <div v-if="result" class="card mb-4">
        <div class="card__content">
          <h3>Kết quả:</h3>
          <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="card">
        <div class="card__content">
          <h2>Hướng dẫn:</h2>
          <ol>
            <li>Đảm bảo backend đang chạy ở địa chỉ {{ apiBaseUrl }}</li>
            <li>Nhấn "Test API trực tiếp" để gọi API không qua store</li>
            <li>Nhấn "Test qua Store" để sử dụng store Pinia</li>
            <li>Kiểm tra kết quả hoặc lỗi hiển thị bên dưới</li>
          </ol>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useShoeStore } from '~/stores/shoeStore';
  
  const apiBaseUrl = useRuntimeConfig().public.apiBase;
  const store = useShoeStore();
  
  const loading = ref(false);
  const error = ref<any>(null);
  const result = ref<any>(null);
  
  async function testDirectFetch() {
    loading.value = true;
    error.value = null;
    result.value = null;
    
    try {
      console.log('Gọi API trực tiếp:', `${apiBaseUrl}/shoes`);
      const response = await fetch(`${apiBaseUrl}/shoes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Kết quả API trực tiếp:', data);
      result.value = data;
    } catch (err: any) {
      console.error('Lỗi gọi API trực tiếp:', err);
      error.value = err.message || 'Có lỗi xảy ra khi gọi API';
    } finally {
      loading.value = false;
    }
  }
  
  async function testStoreFetch() {
    loading.value = true;
    error.value = null;
    result.value = null;
    
    try {
      await store.fetchShoes();
      
      if (store.error) {
        throw new Error(store.error);
      }
      
      result.value = store.shoes;
    } catch (err: any) {
      console.error('Lỗi gọi API qua store:', err);
      error.value = err.message || 'Có lỗi xảy ra khi gọi API qua store';
    } finally {
      loading.value = false;
    }
  }
  </script>
  
  <style scoped>
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    max-height: 400px;
    overflow: auto;
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .bg-danger {
    background-color: #f8d7da !important;
    color: #721c24 !important;
  }
  
  .loading-spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #3498db;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>