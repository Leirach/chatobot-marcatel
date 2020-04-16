<template>
    <!-- Display basic card response -->
        <div class="card">
            <!-- Display image if present -->
            <div class="view overlay" v-if="basicCard.image">
                <img v-if="basicCard.image.url"
                    class="card-img-top"
                    :src="basicCard.image.url"
                    :alt="basicCard.image.accessibilityText">
                <div class="mask rgba-white-slight"></div>
            </div>
            <div class="card-body">
                <h4 v-if="basicCard.title"
                    class="card-title">
                    {{basicCard.title}}
                </h4>
                <p v-if="basicCard.subtitle"
                    class="card-text">
                    {{basicCard.subtitle}}
                </p>
                <p class="card-text"
                    v-if="basicCard.formattedText">
                    {{basicCard.formattedText}}
                </p>
                <!-- Display card buttons -->
                <div v-for="(s,index) in basicCard.buttons"
                    :key="index">
                    <template v-if="s.openUriAction">
                        <div class="suggestions link">
                            <a :href="s.openUriAction.uri"
                                target="_blank">
                                {{s.title}}
                                <i class="fas fa-external-link-alt"
                                    style="margin-left:3px;"></i>
                            </a>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            @click="clickSubmit(s.title)"
                            v-if="s.title"
                            class="suggestions"
                        >{{s.title}}</div>
                    </template>
                </div>
            </div>
        </div>
</template>

<script>

export default {
    props: ['basicCard'],
};
</script>

<style lang="scss" scoped>
@import "../Chat.scss";
</style>