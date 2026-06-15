<template>
  <div class="couplet">
    <div class="couplet-left">
      <!-- 蛇头 -->
      <div class="snake-head">
        <div class="snake-face">
          <div class="snake-eyes">
            <span class="eye"></span>
            <span class="eye"></span>
          </div>
        </div>
      </div>
      <!-- 对联主体 -->
      <div class="couplet-body">
        <div class="couplet-text">{{ leftText }}</div>
      </div>
      <!-- 灯笼 -->
      <div class="lantern">
        <div class="lantern-top"></div>
        <div class="lantern-body">
          <div class="lantern-light"></div>
        </div>
        <div class="lantern-bottom"></div>
        <div class="lantern-tassel"></div>
      </div>
    </div>
    <div class="couplet-right">
      <!-- 蛇头 -->
      <div class="snake-head">
        <div class="snake-face">
          <div class="snake-eyes">
            <span class="eye"></span>
            <span class="eye"></span>
          </div>
        </div>
      </div>
      <!-- 对联主体 -->
      <div class="couplet-body">
        <div class="couplet-text">{{ rightText }}</div>
      </div>
      <!-- 灯笼 -->
      <div class="lantern">
        <div class="lantern-top"></div>
        <div class="lantern-body">
          <div class="lantern-light"></div>
        </div>
        <div class="lantern-bottom"></div>
        <div class="lantern-tassel"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const leftText = ref('鹅鹅鹅，曲项向天歌')
const rightText = ref('白毛浮绿水，红掌拨清波')
</script>

<style scoped>
.couplet {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 0;
  pointer-events: none;
  z-index: 50;
}

.couplet-left,
.couplet-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
}

.couplet-left {
  left: 20px;
}

.couplet-right {
  right: 20px;
}

/* 蛇头样式 */
.snake-head {
  width: 52px;
  height: 40px;
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  border-radius: 50% 50% 40% 40%;
  position: relative;
  margin-bottom: -2px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.snake-head::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid #22c55e;
}

.snake-face {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.snake-eyes {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.eye {
  width: 8px;
  height: 8px;
  background: #fef08a;
  border-radius: 50%;
  position: relative;
  animation: blink 4s ease-in-out infinite;
}

@keyframes blink {
  0%, 45%, 55%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

.eye::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #1f2937;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 对联主体 */
.couplet-body {
  width: 44px;
  padding: 20px 6px;
  background: linear-gradient(180deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%);
  border-left: 2px solid #fbbf24;
  border-right: 2px solid #fbbf24;
  position: relative;
  z-index: 1;
}

.couplet-body::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  pointer-events: none;
}

.couplet-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 1rem;
  font-weight: 600;
  color: #fbbf24;
  letter-spacing: 6px;
  line-height: 2;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
}

/* 灯笼样式 */
.lantern {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -2px;
  position: relative;
  z-index: 1;
}

.lantern-top {
  width: 20px;
  height: 8px;
  background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
  border-radius: 2px 2px 0 0;
}

.lantern-body {
  width: 36px;
  height: 48px;
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #ef4444 100%);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lantern-light {
  width: 16px;
  height: 32px;
  background: linear-gradient(180deg, #fef08a 0%, #fde047 100%);
  border-radius: 50%;
  opacity: 0.8;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    opacity: 0.6;
    box-shadow: 0 0 10px rgba(254, 240, 138, 0.5);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 20px rgba(254, 240, 138, 0.8);
  }
}

.lantern-bottom {
  width: 20px;
  height: 8px;
  background: linear-gradient(180deg, #d97706 0%, #fbbf24 100%);
  border-radius: 0 0 2px 2px;
}

.lantern-tassel {
  width: 2px;
  height: 20px;
  background: #fbbf24;
  position: relative;
}

.lantern-tassel::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 16px;
  background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
  border-radius: 0 0 6px 6px;
}

/* 暗色主题 */
[data-theme='dark'] .snake-head {
  background: linear-gradient(180deg, #15803d 0%, #166534 100%);
}

[data-theme='dark'] .snake-head::before {
  border-bottom-color: #15803d;
}

[data-theme='dark'] .couplet-body {
  background: linear-gradient(180deg, #991b1b 0%, #7f1d1d 50%, #991b1b 100%);
  border-color: #d97706;
}

[data-theme='dark'] .couplet-body::before {
  border-color: rgba(217, 119, 6, 0.3);
}

[data-theme='dark'] .couplet-text {
  color: #fcd34d;
}

[data-theme='dark'] .lantern-body {
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
}

@media (max-width: 1400px) {
  .couplet {
    display: none;
  }
}
</style>
