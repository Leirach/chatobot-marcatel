<template>
    <div class="card">
        <div class="card-body">
            <h4 class="card-title" v-if="listSelect.title">
                {{listSelect.title}}
            </h4>
            <p class="card-text" v-if="listSelect.subtitle">
                {{listSelect.subtitle}}
            </p>
            <template v-if="listSelect.items.length > 1">
                <ul class="list-group">
                    <li v-for="(s,index) in listSelect.items"
                        :key="index"
                        class="list-group-item flex-column align-items-start"
                        @click="clickSubmit(s.title)">
                        <div class="row">
                            <template
                                v-if="s.image.imageUri != ''">
                                <div class="col-md-9">
                                    <div
                                        class="d-flex w-100 justify-content-between"
                                        v-if="s.title">
                                        <h5 class="h5 mb-0">
                                            {{s.title}}</h5>
                                    </div>
                                    <p class="mt-2 mb-0" v-if="s.description">
                                        {{s.description}}
                                    </p>
                                </div>
                                <div class="col-md-3">
                                    <img :src="s.image.imageUri" 
                                         class="img-fluid rounded"/>
                                </div>
                            </template>
                            <template v-else>
                                <div class="col-md-12">
                                    <div class="d-flex w-100 justify-content-between"
                                        v-if="s.title">
                                        <h5 class="h5 mb-0">
                                            {{s.title}}
                                        </h5>
                                    </div>
                                    <p class="mt-2 mb-0" v-if="s.description">
                                        {{s.description}}
                                    </p>
                                </div>
                            </template>
                        </div>
                    </li>
                </ul>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['listSelect'],
};
</script>

<style lang="scss" scoped>
@import "../Chat.scss";
</style>