<template>
	<div class="dashboard">
		<v-toolbar class="mt-0 pt-0 fixed-bar" dark>
		
			<v-toolbar-title >
				<router-link :to="{ path: '/' }" tag="span" style="cursor: pointer">
				<img :src="require('../assets/paper-plane.png')" class="logo" align-center center height="25px"/>
				{{ appTitle }}
				</router-link>
			</v-toolbar-title>
		
		<v-spacer></v-spacer>
		<v-toolbar-items class="hidden-xs-only">
			<v-btn 
			text
			v-for="item in menuItems"
			:key="item.title"
			:to="item.path">
			<v-icon left dark>{{ item.icon }}</v-icon>
			{{ item.title }}
				<v-list dense>
					<v-list-tile
						v-for="subItem in item.items"
						:key="subItem.title"
						@click="close"
						router
						:to="subItem.link"
					>
						<v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-btn>
		</v-toolbar-items>
		</v-toolbar>
		
		<div class="fullheight">
		<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	name: "Dashboard",
	data() {
		return {
			appTitle: 'OurTrip',
			menuItems: [
				{ title: "Home", path: "/home", icon: 'mdi-home'},
				{ title: "Reservation", path: "/reservation", icon: 'mdi-book-plus'},
				{ title: "History", path: "/history", icon: 'mdi-history'},
				{ title: "Profile", path: "/profile", icon: 'mdi-account'},
			],
		};
	},
	methods: {
		logout(){
			localStorage.removeItem('id');
			localStorage.removeItem('token');
			this.$router.push({
				name: 'Login',
			});
		}
	}
};
</script>

<style scoped>
.fullheight {
    min-height: 100vh !important;
}
.router {
    text-decoration: none;
    color: black;
}
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0;
  z-index: 2;
}
</style>