<template>
    <v-carousel v-model="model" cycle height="1000">
        <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="item.src"
        >
        <v-row class="fill-height" align="center" justify="center">
            <v-col cols="12" xs="10" sm="10" md="10" lg="10" xl="10">
                <h1 class="white--text">OurTrip</h1><v-spacer></v-spacer>
                <h3 class="white--text my-3">Dapatkan Experience Perjalanan Anda Bersama OurTrip</h3><v-spacer></v-spacer>
                <v-btn color="blue darken-1" class="white--text mt-2" href="/reservation">Pesan Sekarang</v-btn>
            </v-col>
        </v-row>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
  export default {
    data () {
      return {
        items: [
            { src: require('../assets/1.jpeg') },
            { src: require('../assets/2.jpeg') },
            { src: require('../assets/3.jpeg') },
        ],
        model: 0,
      }
    },
  }
</script>