<template>
    <div fluid>
        <div class="row text-center">
            <div class="col-12 chat-window">
                <div class="col-12"></div>
                <div class="row pt-2" v-for="msg in chat" :id="'top'+(msg.nid)">
                    <div class="col-12">
                        <!-- Display written query -->
                        <div class="row " v-if="msg.question">
                            <div class="ml-1 mr-1 col mb-2 text-left d-flex justify-content-end">
                                <div class="question">{{msg.question}}</div>
                            </div>
                        </div>

                        <!-- Display answers after they are returned by dialogflow -->
                        <div class="row" v-if="Object.keys(msg.answer).length >= 1">
                            <div class="ml-1 mr-1 col-11 text-left">
                                <!-- Display all types of answers -->
                                <div class="row pb-2" v-for="res in msg.answer.items">
                                    <!-- Display simple response -->
                                    <div class="col-12" v-if="res.simpleResponse">
                                        <div class="answerText">{{res.simpleResponse.textToSpeech}}</div>
                                    </div>
                                    <!-- FILL FORM PARA ENVIAR AL CHAT
                                         falta algo como v-if="res.simpleResponse.textToSpeech == 'Dame tus datos'"
                                         u otra forma de mandar un mensaje que despliegue el form
                                    <div class="col-12">
                                        <chat-fill-form></chat-fill-form>
                                    </div>
                                    -->

                                    <!-- Display basic card response -->
                                    <div class="col-12" v-if="res.basicCard">
                                        <chat-basic-card v-bind:basicCard="res.basicCard">
                                        </chat-basic-card>
                                    </div>

                                    <!-- Display Select List response -->
                                    <div class="col-12" v-if="res.listSelect">
                                        <chat-list-select v-bind:listSelect="res.listSelect">
                                        </chat-list-select>
                                    </div>

                                    <!-- Display Carousel card response -->
                                    <div class="col-12" v-if="res.carouselBrowse">
                                        <chat-carousel-select v-on:carouselSumit="clickSubmit" v-bind:carouselSelect="res.carouselBrowse.items">
                                        </chat-carousel-select>
                                    </div>

                                    <!-- Display image only -->
                                    <div class="col-12" v-if="res.image">
                                        <div class="card">
                                            <!-- Display image if present -->
                                            <div class="view overlay" v-if="res.image.imageUri">
                                                <img
                                                        class="card-img-top image-only"
                                                        :src="res.image.imageUri"
                                                />
                                                <div class="mask rgba-white-slight"></div>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                                <transition name="fade">
                                    <div v-if="msg.answer.suggestions && msg.nid == id-1">
                                        <chat-chips v-on:chipSubmit="clickSubmit" v-bind:chips="msg.answer.suggestions">
                                        </chat-chips>
                                    </div>
                                </transition>
                            </div>
                        </div>
                        <div class="row" v-else>
                            <div class="col md-8 text-left">
                                <div class="loader">
                                    <img src="../assets/typing.svg"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bottom"></div>
            </div>
        </div >
        <div class="row">
            <div class="message-row">
                <v-text-field solo type="text" :placeholder="config.locale.strings.queryTitle"
                            v-model="query" @keyup.enter="submit" class="message-area"
                            :disabled="!!queryFlag" id="queryinput" height="60px"
                            hide-details autofocus>
                </v-text-field>
            </div>
            <v-fab-transition>
                <v-btn style="margin-top: 0px" color="#FDD403" absolute
                        right fab @click="submit" :disabled="query == ''">
                    <v-icon>mdi-send</v-icon>
                </v-btn>
            </v-fab-transition>
        </div>
    </div>
</template>

<script>
    import { v4 as uuidv4 } from 'uuid';
    import axios from "axios";
    import config from "../../config";
    import { getToken } from "../credentials/gcloud_credentials";
    //Chat components
    import BasicCard from "./BasicCard";
    import ListSelect from "./ListSelect";
    import CarouselSelect from "./CarouselSelect";
    import FillForm from "./FillForm";
    import Chips from './Chips';
    import key from '../credentials/marcatel-bot.json';
    const { GoogleToken } = require('gtoken');
    const sessionId = uuidv4();
    const langCode = config.locale.settings.recognitionLang;
    let chatUrl = config.app.dialogflowUrl;
    let agent = config.Dialogflow.agent;
    export default {
        components: {
            chatBasicCard: BasicCard,
            chatListSelect: ListSelect,
            chatCarouselSelect: CarouselSelect,
            chatFillForm: FillForm,
            chatChips: Chips
        },
        data() {
            return {
                config,
                chat: [],
                query: "",
                greeting: "",
                id: 1,
                queryFlag: false,
                showChips: true,
                accessToken: "",
            };
        },
        created: function () {
            getToken((err, token) => {
                if (err) {
                    console.error("ERROR: ");
                    console.error(err);
                    return ;
                }
                this.accessToken = token.access_token;
            });
        },
        methods: {
            submit() {
                let vm = this;
                if (vm.query) {
                    setTimeout(() => {
                        document.querySelector("#bottom").scrollIntoView({
                            behavior: "smooth"
                        });
                    }, 2);
                    let userMsg = {};
                    userMsg.question = vm.query;
                    userMsg.nid = vm.id;
                    userMsg.answer = {};
                    userMsg.carousel ="";
                    vm.chat.push(userMsg);
                    vm.queryFlag = true;
                    axios({
                        method: "post",
                        url: chatUrl + `/${sessionId}:detectIntent`,
                        headers: {
                            authorization: `Bearer ${this.accessToken}`
                        },
                        data: {
                            query_input: {
                                text: {
                                    text: vm.query,
                                    language_code: langCode
                                }
                            }
                        }
                    }).then(response => {
                        response = response.data;
                        //console.log(response);
                        vm.chat[vm.id - 1].answer = response.queryResult.webhookPayload.google.richResponse;
                        vm.scroll();
                        vm.id++;
                        this.resetQueryInput()
                    }).catch(err => {
                        this.resetQueryInput()
                    });
                }
            },
            clickSubmit(keyword) {
                let vm = this;
                vm.query = keyword;
                vm.submit();
            },
            resetQueryInput() {
                this.query = "";
                this.queryFlag = false;
                window.setTimeout(function () {
                    document.getElementById('queryinput').focus();
                }, 0);
            },
            removePreviousChips() {
                window.setTimeout(function () {
                    document.getElementById('chips').remove();
                }, 1);
            },
            scroll() {
                let vm = this;
                let id = "#top" + vm.id;
                setTimeout(() => {
                    document.querySelector(id).scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                        inline: "nearest"
                    });
                }, 2);
            },
        },
        mounted() {
        }
    };
</script>

<style lang="scss" scoped>
    @import "../Chat.scss";
</style>