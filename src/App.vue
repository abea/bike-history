<template>
  <div id="app" class="container-fluid">
    <div class="row justify-content-center">
      <ul class="nav col-md-8">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/about">About</router-link>
        </li>
      </ul>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <router-view/>
      </div>
    </div>
  </div>
</template>
