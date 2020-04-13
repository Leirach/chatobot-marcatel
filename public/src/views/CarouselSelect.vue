<template>
    <div id="carousel-cards" class="carousel slide carousel-fade"
         data-ride="carousel">
        <ol class="carousel-indicators">
            <template v-for="s in carouselSelect.items">
                <li data-target="#carousel-cards" :data-slide-to="s.info.key"
                    :class="{ active: s.info.key == 1 }" :key="s.info.key">
                </li>
            </template>
        </ol>
        <div class="carousel-inner" role="listbox">
            <template v-for="s in carouselSelect.items">
                <div class="carousel-item" :class="{ active: s.info.key == 1 }"
                     :key="s.info.key">
                    <div class="view">
                        <img class="d-block w-100" :src="s.image.imageUri"/>
                        <div class="mask rgba-black-light"></div>
                    </div>
                    <div class="carousel-caption">
                        <h3 class="h3-responsive" v-if="s.title">
                            {{s.title}}
                        </h3>
                        <p v-if="s.description">{{s.description}}</p>
                    </div>
                </div>
            </template>
        </div>
        <a class="carousel-control-prev" href="#carousel-cards" role="button"
           data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carousel-cards" role="button"
           data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>
</template>

<script>
export default {
    props: ['carouselSelect'],
};
</script>

<style lang="scss" scoped>
@import "../Chat.scss";
</style>