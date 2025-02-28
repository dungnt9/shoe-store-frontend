<template>
  <div class="card">
    <img :src="shoe.imageUrl" alt="shoe.name" class="card__image">
    <div class="card__content">
      <h3 class="card__title">{{ shoe.name }}</h3>
      <p class="card__price">{{ formatPrice(shoe.price) }}</p>
      <p>Brand: {{ shoe.brand }}</p>
      <p v-if="shoe.stock > 0">In Stock: {{ shoe.stock }}</p>
      <p v-else class="text-danger">Out of Stock</p>
      <div class="card__actions">
        <NuxtLink :to="`/shoes/${shoe.id}`" class="btn btn-primary">View Details</NuxtLink>
        <button v-if="onDelete" @click="onDelete(shoe.id)" class="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Shoe } from '~/types/shoe';

const props = defineProps<{
  shoe: Shoe;
  onDelete?: (id: number) => void;
}>();

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};
</script>