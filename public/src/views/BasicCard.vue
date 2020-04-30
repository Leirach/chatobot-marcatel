<template>
    <v-card outlined max-width="500">
        <v-img v-if="basicCard.image"
               :src="basicCard.image.url"
               :alt="basicCard.image.accessibilityText"
                height="auto"/>
        <v-card-title v-if="basicCard.title">
           {{basicCard.title}}
        </v-card-title>
        <v-card-subtitle v-if="basicCard.subtitle">
            {{basicCard.subtitle}}
        </v-card-subtitle>
        <v-card-actions>

            <div v-for="(s,index) in basicCard.buttons" :key="index">
                <v-btn rounded dark
                       v-if="s.title"
                       :href="s.openUrlAction.url"
                       target="_blank">
                    {{s.title}}
                </v-btn>
            </div>


            <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ['basicCard'],
    };

</script>

<style lang="scss" scoped>
    @import "../Chat.scss";
</style>



