<template>
	<nav class="navbar navbar-expand-lg navbar-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">Navbar</a>
			<button
				class="navbar-toggler d-lg-none"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#collapsibleNavId"
				aria-controls="collapsibleNavId"
				aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="collapsibleNavId">
				<ul class="navbar-nav">
					<li class="nav-item">
						<nuxt-link to="/" active-class="active" class="nav-link">Servers</nuxt-link>
					</li>
					<li class="nav-item">
						<nuxt-link to="/groups" active-class="active" class="nav-link">Groups</nuxt-link>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<div class="container">
		<NuxtPage />
	</div>
</template>
