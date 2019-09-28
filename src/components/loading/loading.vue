<template>
  <div v-if="show">
    <div class="mask-layer"></div>
    <div class="spinner-center">
      <div class="spinner-cc">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
        <div class="bar4"></div>
        <div class="bar5"></div>
        <div class="bar6"></div>
        <div class="bar7"></div>
        <div class="bar8"></div>
        <div class="bar9"></div>
        <div class="bar10"></div>
        <div class="bar11"></div>
        <div class="bar12"></div>
      </div>
      <div class="loading-message">{{message}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {
      show: false,
      type: "success",
      message: ""
    };
  }
};
</script>

<style scoped lang="less">
@media screen and (max-width: 321px) {
  body {
    font-size: 16px;
  }
}

@media screen and (min-width: 321px) and (max-width: 400px) {
  body {
    font-size: 17px;
  }
}

@media screen and (min-width: 400px) {
  body {
    font-size: 19px;
  }
}

/*遮罩层*/
.mask-layer {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0);
  z-index: 2;
}
.global-loading(@spinner-width) {
  position: fixed;
  width: @spinner-width;
  left: 50%;
  top: 40%;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10/100rem;
  padding: 30/100rem 0;
  text-align: center;
  font-size: 16px;
  margin-left: unit(-(@spinner-width / 2), rem);
  z-index: 1010;
  @media screen and (max-width: 321px) {
    font-size: 16px;
  }

  @media screen and (min-width: 321px) and (max-width: 400px) {
    font-size: 17px;
  }

  @media screen and (min-width: 400px) {
    font-size: 19px;
  }
}
.spinner-center {
  .global-loading(2.5rem);
}

.custom-wrap {
  display: inline-block;
  vertical-align: middle;
}

.loading-message {
  color: #fff;
  padding-top: 16/100rem;
}

.disable-scroll {
  overflow: hidden;
}

.loading-horizontal-center {
  display: block;
  width: 100%;
  text-align: center;
}
.spinner-cc {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 0.6rem;
  height: 0.6rem;
}
.spinner-cc div {
  background-color: white;
  position: absolute;
  width: 8%;
  height: 25%;
  top: 60%;
  left: 50%;
  margin-left: -4.15%;
  opacity: 0;
  border-bottom-left-radius: 0.7rem 1.2rem;
  border-bottom-right-radius: 0.7rem 1.2rem;
  -webkit-transform-origin: center -80%;
  -ms-transform-origin: center -80%;
  transform-origin: center -80%;
  animation: fade 1s linear infinite;
  -webkit-animation: fade 1s linear infinite;
}
.spinner-cc div.bar1 {
  transform: rotate(0deg);
  animation-delay: 0s;
  -webkit-transform: rotate(0deg);
  -webkit-animation-delay: 0s;
}
.spinner-cc div.bar2 {
  transform: rotate(30deg);
  animation-delay: -0.9167s;
  -webkit-transform: rotate(30deg);
  -webkit-animation-delay: -0.9167s;
}
.spinner-cc div.bar3 {
  transform: rotate(60deg);
  animation-delay: -0.833s;
  -webkit-transform: rotate(60deg);
  -webkit-animation-delay: -0.833s;
}
.spinner-cc div.bar4 {
  transform: rotate(90deg);
  animation-delay: -0.75s;
  -webkit-transform: rotate(90deg);
  -webkit-animation-delay: -0.75s;
}
.spinner-cc div.bar5 {
  transform: rotate(120deg);
  animation-delay: -0.667s;
  -webkit-transform: rotate(120deg);
  -webkit-animation-delay: -0.667s;
}
.spinner-cc div.bar6 {
  transform: rotate(150deg);
  animation-delay: -0.5833s;
  -webkit-transform: rotate(150deg);
  -webkit-animation-delay: -0.5833s;
}
.spinner-cc div.bar7 {
  transform: rotate(180deg);
  animation-delay: -0.5s;
  -webkit-transform: rotate(180deg);
  -webkit-animation-delay: -0.5s;
}
.spinner-cc div.bar8 {
  transform: rotate(210deg);
  animation-delay: -0.41667s;
  -webkit-transform: rotate(210deg);
  -webkit-animation-delay: -0.41667s;
}
.spinner-cc div.bar9 {
  transform: rotate(240deg);
  animation-delay: -0.333s;
  -webkit-transform: rotate(240deg);
  -webkit-animation-delay: -0.333s;
}
.spinner-cc div.bar10 {
  transform: rotate(270deg);
  animation-delay: -0.25s;
  -webkit-transform: rotate(270deg);
  -webkit-animation-delay: -0.25s;
}
.spinner-cc div.bar11 {
  transform: rotate(300deg);
  animation-delay: -0.1667s;
  -webkit-transform: rotate(300deg);
  -webkit-animation-delay: -0.1667s;
}
.spinner-cc div.bar12 {
  transform: rotate(330deg);
  animation-delay: -0.0833s;
  -webkit-transform: rotate(330deg);
  -webkit-animation-delay: -0.0833s;
}
@keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
