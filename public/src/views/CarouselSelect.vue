<template>
    <div id="carousel-cards" class="carousel slide carousel-fade" data-ride="carousel">
        <div class="carousel-inner" role="listbox">
            <template v-for="card in carouselSelect">
                    <v-card class="ma-4" max-width="500" outlined 
                            @click="carouselSumit(card.title)">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title class="headline mb-1" v-if="card.title">{{card.title}}</v-list-item-title>
                                <v-list-item-subtitle  v-if="card.description">{{card.description}}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="90" color="grey">
                                <v-img v-if="card.image"
                                       :src="card.image.url"
                                       :alt="card.image.accessibilityText"
                                       :contain = true />
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['carouselSelect'],
    methods:{
        carouselSumit : function(keyword){
            this.$emit('carouselSumit',keyword);
        },
    },
    mounted() {
        //console.log(this.carouselSelect);
    }
};
</script>

<style lang="scss" scoped>
@import "../Chat.scss";
</style>