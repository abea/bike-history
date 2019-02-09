<template>
  <div id="app" class="container-fluid">
    <header class="row justify-content-center">
      <nav class="navbar navbar-expand-sm col-md-8 navbar-light bg-light">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
      </nav>
    </header>
    <main class="row justify-content-center">
      <div class="col-md-8">
        <router-view/>
      </div>
    </main>
  </div>
</template>
