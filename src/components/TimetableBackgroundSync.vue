<template>
  <!-- Based on https://codepen.io/dima-f1/pen/XWreEpW -->
  <div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate w-screen !fixed z-50 top-0 left-0 right-0">
    <div class="mdc-linear-progress__buffer bg-green-100 dark:bg-green-950"></div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"><span class="mdc-linear-progress__bar-inner bg-green-800 dark:bg-green-300"></span></div>
    <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner bg-green-800 dark:bg-green-300"></span></div>
  </div>
</template>

<style lang="css">
.mdc-linear-progress {
  position: relative;
  width: 100%;
  height: 5px;
  transform: translateZ(0);
  transition: opacity .25s cubic-bezier(.4,0,.6,1) 0ms;
  overflow: hidden;
}

.mdc-linear-progress__buffer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
  will-change: tarnsform;
  animation: primary-indeterminate-translate 2s infinite linear;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  animation: secondary-indeterminate-translate 2s infinite linear;
  visibility: visible;
  will-change: tarnsform;
}
.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress__bar, .mdc-linear-progress__bar-inner {
  position: absolute;
  width: 100%;
  height: 100%;
}
.mdc-linear-progress__bar {
  transform-origin: top left;
}

.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner {
  animation: primary-indeterminate-scale 2s infinite linear;
}

.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner {
  animation: secondary-indeterminate-scale 2s infinite linear;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  will-change: tarnsform;
}

@keyframes primary-indeterminate-translate {
0% {
    transform: translateX(0);
}
20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
}
59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
}
100% {
    transform: translateX(200.611057%);
}
}

@keyframes primary-indeterminate-scale {
0% {
  transform: scaleX(0.08);
}
36.65% {
  animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
  transform: scaleX(0.08);
}
69.15% {
  animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
  transform: scaleX(0.661479);
}
100% {
  transform: scaleX(0.08);
}
}

@keyframes secondary-indeterminate-translate {
0% {
  animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
  transform: translateX(0);
}
25% {
  animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
  transform: translateX(37.651913%);
}
48.35% {
  animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
  transform: translateX(84.386165%);
}
100% {
  transform: translateX(160.277782%);
}
}


@keyframes secondary-indeterminate-scale {
0% {
  animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
  transform: scaleX(0.08);
}
19.15% {
  animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
  transform: scaleX(0.457104);
}
44.15% {
  animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
  transform: scaleX(0.72796);
}
100% {
  transform: scaleX(0.08);
}
}
</style>
