<template class="col-12">
    <div>
        <v-chip style="margin-top: 4px; margin-right: 2px;"
            v-for="s in chips"
            color="primary" outlined
            @click="chipSubmit(s.title)">
            <div v-if="s.title">{{s.title}}</div>
        </v-chip>
    </div>
</template>

<script>
export default {
    props: ['chips'],
    methods:{
        chipSubmit : function(title){
            this.$emit('chipSubmit', title);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../Chat.scss";
</style>