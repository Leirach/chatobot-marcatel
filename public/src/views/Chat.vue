<template>
    <v-container fluid>
        <div class="row text-center">
            <div class="col-12 chat-window">
                <!--div class="row">
                    <div class="col-12 welcome pb-3">{{greeting}}</div>
                </div-->
                <div class="row pt-2" v-for="msg in chat" :id="'top'+(msg.nid)">
                    <div class="col-12">
                        <!-- Display written query -->
                        <div class="row" v-if="msg.question">
                            <div class="col mb-2 text-left d-flex justify-content-end">
                                <div class="question">{{msg.question}}</div>
                            </div>
                        </div>

                        <!-- Display answers after they are returned by dialogflow -->
                        <div class="row" v-if="Object.keys(msg.answer).length > 1">
                            <div class="col-9 text-left">
                                <!-- Display all types of answers -->
                                <div class="row pb-2"
                                     v-for="res in msg.answer.items">
                                    <!-- Display simple response -->
                                    <div class="col-12" v-if="res.simpleResponse">
                                        <div class="answerText">{{res.simpleResponse.textToSpeech}}</div>
                                    </div>

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
                                    <div class="col-12" v-if="msg.carousel">
                                        <chat-carousel-select v-if="msg.carousel" v-on:carouselSumit="clickSubmit" v-bind:carouselSelect="msg.carousel">
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

                                    <!-- Display Link Out Suggestion chip -->
                                    <div class="col-12"
                                         v-if="res.message === 'linkOutSuggestion'">
                                        <div class="suggestions link">
                                            <div v-if="res.linkOutSuggestion">
                                                <a
                                                        :href="res.linkOutSuggestion.uri"
                                                        target="_blank">
                                                    {{res.linkOutSuggestion.destinationName}}
                                                    <i
                                                            class="fas fa-external-link-alt"
                                                            style="margin-left:3px;"
                                                    ></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Display Suggestion chip -->
                                <template class="col-12" v-if="msg.answer.suggestions">
                                    <v-chip style="margin-top: 4px; margin-right: 2px;"
                                            v-for="s in msg.answer.suggestions"
                                            color="primary"
                                            outlined
                                            @click="clickSubmit(s.title)">
                                        <div v-if="s.title">{{s.title}}</div>
                                    </v-chip>
                                </template>
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
        </div>
        <div class="row">
            <div class="col-9 search">
                <input type="text" :placeholder="config.locale.strings.queryTitle"
                       v-model="query" @keyup.enter="submit" :disabled="!!queryFlag"
                       id="queryinput" autofocus/>
            </div>
            <div class="col-3">
                <v-fab-transition >
                    <v-btn style="margin: 0px"
                           color="#FDD403"
                           absolute

                           right
                           fab
                           @click="submit"
                           :disabled="query == ''">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-fab-transition>

            </div>
        </div>
    </v-container>
</template>

<script>
    import uuidv4 from "uuid/v4";
    import axios from "axios";
    import config from "../../config";
    import { getToken } from "../credentials/gcloud_credentials";
    //Chat components
    import BasicCard from "./BasicCard";
    import ListSelect from "./ListSelect";
    import CarouselSelect from "./CarouselSelect";
    import key from '../credentials/marcatel-bot.json';
    const { GoogleToken } = require('gtoken');
    // const sessionId = uuidv4(); need an alternative for self inc ids or similar
    const langCode = config.locale.settings.recognitionLang;
    let chatUrl = config.app.dialogflowUrl;
    let agent = config.Dialogflow.agent;
    export default {
        components: {
            chatBasicCard: BasicCard,
            chatListSelect: ListSelect,
            chatCarouselSelect: CarouselSelect
        },
        data() {
            return {
                config,
                chat: [],
                query: "",
                time: "0",
                date: "0",
                week: ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"],
                greeting: "",
                id: 1,
                queryFlag: false,
                accessToken: ""
            };
        },
        created: function () {
            getToken((err, token) => {
                if (err) {
                    console.log("ERROR: ");
                    console.log(err);
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
                        url: chatUrl + `/12345678:detectIntent`,
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
                        console.log(response.queryResult.webhookPayload.google);
                        //console.log(response.queryResult.webhookPayload.google);
                        vm.chat[vm.id - 1].answer = response.queryResult.webhookPayload.google.richResponse;
                        //console.log( response.queryResult.webhookPayload.google.richResponse);
                        //vm.chat[vm.id - 1].carousel = response.queryResult.webhookPayload.google.systemIntent.data.carouselSelect.items
                        //console.log(userMsg.carousel)
                        vm.scroll();
                        vm.id++;
                        vm.query = "";
                        vm.queryFlag = false;
                        document.getElementById("queryinput").focus();
                        $("#queryinput").focus();
                    }).catch(err => {
                        // placeholder, probablemente hay que cambiar esto
                        vm.query = "";
                        vm.queryFlag = false;
                        document.getElementById("queryinput").focus();
                        $("#queryinput").focus();
                    });
                }
            },
            clickSubmit(keyword) {
                let vm = this;
                vm.query = keyword;
                vm.submit();
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
            updateTime() {
                let today = new Date();
                let hrs = today.getHours();
                let ampm = hrs >= 12 ? "PM" : "AM";
                hrs = hrs % 12;
                hrs = hrs ? hrs : 12;
                this.time =
                    this.zeroPadding(hrs, 2) +
                    ":" +
                    this.zeroPadding(today.getMinutes(), 2) +
                    ":" +
                    this.zeroPadding(today.getSeconds(), 2) +
                    " " +
                    ampm;
                this.date =
                    this.week[today.getDay()] +
                    " " +
                    this.zeroPadding(today.getDate(), 2) +
                    "/" +
                    this.zeroPadding(today.getMonth() + 1, 2) +
                    "/" +
                    this.zeroPadding(today.getFullYear(), 4)
            },
            zeroPadding(num, digit) {
                let zero = "";
                for (let i = 0; i < digit; i++) {
                    zero += "0";
                }
                return (zero + num).slice(-digit);
            }
        },
        mounted() {
            let vm = this;
            vm.updateTime();
            setInterval(() => {
                vm.updateTime();
            }, 1000);
            let time = new Date().getHours();
            if (time < 12 && time >= 0) {
                vm.greeting = "Buenos Días";
            } else if (time >= 19) {
                vm.greeting = "Buenas Noches";
            } else if (time >= 12) {
                vm.greeting = "Buenas Tardes";
            } else {
                vm.greeting = "Hola!";
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../Chat.scss";
</style>