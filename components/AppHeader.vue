<template>
  <header class="header">
    <div class="container header__content">
      <h1 class="header__title">Shoe Store</h1>
      <nav>
        <NuxtLink to="/" class="btn btn-primary">Home</NuxtLink>
        <NuxtLink to="/shoes/new" class="btn btn-success">Add New Shoe</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 1.25rem;
  text-align: center;
  text-decoration: none;
  color: white;
}
</style>