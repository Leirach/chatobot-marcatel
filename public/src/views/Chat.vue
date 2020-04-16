<template>
    <div class="container">
        <div class="row text-center">
            <div class="col-md-12 chat-window scrollbar scrollbar-chat">
                <div class="row">
                    <div class="col-md-12 welcome pb-3">{{greeting}}</div>
                </div>
                <div class="row pt-2" v-for="(msg,index) in chat" :id="'top'+(msg.nid)" :key="index">
                    <div class="col-md-12">
                        <!-- Display written query -->
                        <div class="row" v-if="msg.question">
                            <div class="col mb-2 text-left d-flex justify-content-end">
                                <div class="question">{{msg.question}}</div>
                            </div>
                        </div>

                        <!-- Display answers after they are returned by dialogflow -->
                        <div class="row" v-if="Object.keys(msg.answer).length > 1">
                            <div class="col-md-9 text-left">
                                <!-- Display all types of answers -->
                                <div class="row pb-2"
                                     v-for="(res,index) in msg.answer.items"
                                     :key="index">
                                    <!-- Display simple response -->
                                    <div class="col-md-12" v-if="res.simpleResponse">
                                        <div class="answerText">{{res.simpleResponse.textToSpeech}}</div>
                                    </div>

                                    <!-- Display basic card response -->
                                    <div class="col-md-12" v-if="res.basicCard">
                                        <chat-basic-card v-bind:basicCard="res.basicCard">
                                        </chat-basic-card>
                                    </div>

                                    <!-- Display Select List response -->
                                    <div class="col-md-12" v-if="res.listSelect">
                                        <chat-list-select v-bind:listSelect="res.listSelect">
                                        </chat-list-select>
                                    </div>

                                    <!-- Display Carousel card response -->
                                    <div class="col-md-12" v-if="res.carouselSelect">
                                        <chat-carousel-select v-bind:carouselSelect="res.carouselSelect">
                                        </chat-carousel-select>
                                    </div>

                                    <!-- Display image only -->
                                    <div class="col-md-12" v-if="res.image">
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
                                    <div class="col-md-12"
                                        v-if="res.message == 'linkOutSuggestion'">
                                        <div class="suggestions link">
                                            <div v-if="res.linkOutSuggestion">
                                                <a
                                                    :href="res.linkOutSuggestion.uri"
                                                    target="_blank"
                                                >
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
                                <div class="col-md-12" v-if="msg.answer.suggestions">
                                    <div v-for="(s,index) in msg.answer.suggestions"
                                        :key="index"
                                        class="suggestions"
                                        @click="clickSubmit(s.title)">
                                        <div v-if="s.title">{{s.title}}</div>
                                    </div>
                                </div>
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
                <div class="row">
                    <div class="col-md-12 time-date">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="time">
                                    {{ time }}
                                    <br />
                                </p>
                                <p class="date">{{ date }}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="copyright">
                                    <a class="copyright" href="https://www.marcatel.com/"
                                       target="_blank">Link a otra cosa Marcatel o algo
                                    </a>
                                </p>
                                <!-- dejamos esto? -->
                                <p class="copyright-version">Basado en version 1.0 por
                                    <a href="https://amangarg.firebaseapp.com"
                                       target="_blank">Aman1707</a>
                                    <br/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-10 col-sm-10 col-10 search">
                <input type="text" :placeholder="config.locale.strings.queryTitle"
                    v-model="query" @keyup.enter="submit" :disabled="!!queryFlag"
                    id="queryinput" autofocus/>
            </div>
            <div class="col-md-2 col-sm-2 col-2 text-center">
                <button type="button" @click="submit" :disabled="query == ''"
                        class="sendBtn btn btn-primary">
                    <i class="send fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import uuidv4 from "uuid/v4";
import axios from "axios";
import config from "../../config";
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
        const gtoken = new GoogleToken({
            email: key.client_email,
            key: key.private_key,
            scope: [
                "https://www.googleapis.com/auth/cloud-platform",
                "https://www.googleapis.com/auth/dialogflow",
            ]
        });


        gtoken.getToken((err, token) => {
            if (err) {
                console.log("ERROR")
                console.log(err);
                return;
            }
            this.accessToken = token.access_token
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
                    console.log(response.queryResult.webhookPayload.google.richResponse);
                    vm.chat[vm.id - 1].answer = response.queryResult.webhookPayload.google.richResponse;
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
            let cd = new Date();
            let hrs = cd.getHours();
            let ampm = hrs >= 12 ? "PM" : "AM";
            hrs = hrs % 12;
            hrs = hrs ? hrs : 12;
            this.time =
                this.zeroPadding(hrs, 2) +
                ":" +
                this.zeroPadding(cd.getMinutes(), 2) +
                ":" +
                this.zeroPadding(cd.getSeconds(), 2) +
                " " +
                ampm;
            this.date =
                this.zeroPadding(cd.getFullYear(), 4) +
                "-" +
                this.zeroPadding(cd.getMonth() + 1, 2) +
                "-" +
                this.zeroPadding(cd.getDate(), 2) +
                " " +
                this.week[cd.getDay()];
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
        } else if (time >= 16) {
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