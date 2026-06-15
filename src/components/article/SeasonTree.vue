<template>
  <div class="season-tree">
    <div class="tree-scene" :class="'season-' + currentSeason">
      <!-- Ground -->
      <div class="ground"></div>

      <!-- Realistic Tree SVG -->
      <svg class="tree-svg" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Trunk gradient -->
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#5D3A1A"/>
            <stop offset="30%" style="stop-color:#7A4F1E"/>
            <stop offset="60%" style="stop-color:#6B4226"/>
            <stop offset="100%" style="stop-color:#4A2C0F"/>
          </linearGradient>
          <!-- Trunk texture -->
          <pattern id="bark" x="0" y="0" width="8" height="12" patternUnits="userSpaceOnUse">
            <line x1="2" y1="0" x2="2" y2="12" stroke="#4A2C0F" stroke-width="0.5" opacity="0.3"/>
            <line x1="6" y1="0" x2="6" y2="12" stroke="#5D3A1A" stroke-width="0.5" opacity="0.2"/>
          </pattern>
          <!-- Foliage gradients -->
          <radialGradient id="foliageSpring" cx="40%" cy="30%">
            <stop offset="0%" style="stop-color:#a3e635"/>
            <stop offset="50%" style="stop-color:#65a30d"/>
            <stop offset="100%" style="stop-color:#3f6212"/>
          </radialGradient>
          <radialGradient id="foliageSummer" cx="40%" cy="30%">
            <stop offset="0%" style="stop-color:#4ade80"/>
            <stop offset="50%" style="stop-color:#16a34a"/>
            <stop offset="100%" style="stop-color:#14532d"/>
          </radialGradient>
          <radialGradient id="foliageAutumn" cx="40%" cy="30%">
            <stop offset="0%" style="stop-color:#fbbf24"/>
            <stop offset="40%" style="stop-color:#ea580c"/>
            <stop offset="80%" style="stop-color:#991b1b"/>
            <stop offset="100%" style="stop-color:#7c2d12"/>
          </radialGradient>
          <radialGradient id="foliageWinter" cx="50%" cy="40%">
            <stop offset="0%" style="stop-color:#94a3b8"/>
            <stop offset="60%" style="stop-color:#64748b"/>
            <stop offset="100%" style="stop-color:#475569"/>
          </radialGradient>
          <!-- Blossom gradient -->
          <radialGradient id="blossomGrad">
            <stop offset="0%" style="stop-color:#fce7f3"/>
            <stop offset="70%" style="stop-color:#f9a8d4"/>
            <stop offset="100%" style="stop-color:#ec4899"/>
          </radialGradient>
        </defs>

        <!-- Main Trunk -->
        <path d="M110,300 L105,240 Q100,200 108,160 L112,160 Q120,200 115,240 L110,300 Z" fill="url(#trunkGrad)"/>
        <path d="M110,300 L105,240 Q100,200 108,160 L112,160 Q120,200 115,240 L110,300 Z" fill="url(#bark)" opacity="0.4"/>

        <!-- Left main branch -->
        <path d="M108,200 Q85,175 65,155" stroke="url(#trunkGrad)" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M108,200 Q85,175 65,155" stroke="url(#bark)" stroke-width="8" fill="none" opacity="0.3"/>
        <!-- Right main branch -->
        <path d="M112,190 Q135,165 155,145" stroke="url(#trunkGrad)" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- Upper left branch -->
        <path d="M110,165 Q90,140 75,120" stroke="url(#trunkGrad)" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Upper right branch -->
        <path d="M110,160 Q130,135 150,115" stroke="url(#trunkGrad)" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Center top branch -->
        <path d="M110,155 Q110,125 110,95" stroke="url(#trunkGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Small branches -->
        <path d="M65,155 Q50,140 40,130" stroke="url(#trunkGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M155,145 Q170,130 180,120" stroke="url(#trunkGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M75,120 Q60,105 50,95" stroke="url(#trunkGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M150,115 Q165,100 175,90" stroke="url(#trunkGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>

        <!-- Roots (visible at base) -->
        <path d="M108,290 Q95,295 85,298" stroke="#5D3A1A" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M112,290 Q125,295 135,298" stroke="#5D3A1A" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M110,295 Q100,300 95,302" stroke="#5D3A1A" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>

        <!-- Foliage - layered clusters for depth -->
        <g class="foliage" :class="'foliage-' + currentSeason">
          <!-- Back layer (darker, larger) -->
          <ellipse cx="120" cy="70" rx="55" ry="45" :fill="foliageBack" class="foliage-back" />
          <ellipse cx="55" cy="110" rx="45" ry="38" :fill="foliageBack" class="foliage-back" />
          <ellipse cx="175" cy="105" rx="42" ry="36" :fill="foliageBack" class="foliage-back" />
          <ellipse cx="80" cy="55" rx="38" ry="32" :fill="foliageBack" class="foliage-back" />
          <ellipse cx="155" cy="50" rx="35" ry="30" :fill="foliageBack" class="foliage-back" />

          <!-- Middle layer -->
          <ellipse cx="110" cy="65" rx="45" ry="38" :fill="foliageMid" class="foliage-mid" />
          <ellipse cx="60" cy="100" rx="38" ry="32" :fill="foliageMid" class="foliage-mid" />
          <ellipse cx="165" cy="95" rx="36" ry="30" :fill="foliageMid" class="foliage-mid" />
          <ellipse cx="90" cy="45" rx="32" ry="28" :fill="foliageMid" class="foliage-mid" />
          <ellipse cx="145" cy="42" rx="30" ry="26" :fill="foliageMid" class="foliage-mid" />
          <ellipse cx="115" cy="90" rx="30" ry="25" :fill="foliageMid" class="foliage-mid" />

          <!-- Front layer (lighter, smaller) -->
          <ellipse cx="105" cy="60" rx="32" ry="28" :fill="foliageFront" class="foliage-front" />
          <ellipse cx="65" cy="90" rx="28" ry="24" :fill="foliageFront" class="foliage-front" />
          <ellipse cx="155" cy="85" rx="26" ry="22" :fill="foliageFront" class="foliage-front" />
          <ellipse cx="95" cy="40" rx="24" ry="20" :fill="foliageFront" class="foliage-front" />
          <ellipse cx="140" cy="38" rx="22" ry="19" :fill="foliageFront" class="foliage-front" />
          <ellipse cx="110" cy="80" rx="22" ry="19" :fill="foliageFront" class="foliage-front" />
        </g>

        <!-- Spring: Cherry blossoms -->
        <g v-if="currentSeason === 'spring'" class="blossoms">
          <circle cx="80" cy="55" r="4" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="140" cy="48" r="5" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="100" cy="35" r="4" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="55" cy="85" r="3.5" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="165" cy="78" r="4" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="120" cy="65" r="3" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="70" cy="100" r="3.5" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="150" cy="95" r="3" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="95" cy="72" r="4" fill="url(#blossomGrad)" class="blossom" />
          <circle cx="130" cy="58" r="3" fill="url(#blossomGrad)" class="blossom" />
          <!-- Blossom clusters -->
          <g class="blossom-cluster" transform="translate(85, 45)">
            <circle cx="0" cy="0" r="3" fill="#f9a8d4" opacity="0.9"/>
            <circle cx="5" cy="-2" r="2.5" fill="#fbcfe8" opacity="0.8"/>
            <circle cx="-3" cy="4" r="2" fill="#fce7f3" opacity="0.7"/>
          </g>
          <g class="blossom-cluster" transform="translate(145, 68)">
            <circle cx="0" cy="0" r="3" fill="#f9a8d4" opacity="0.9"/>
            <circle cx="4" cy="3" r="2.5" fill="#fbcfe8" opacity="0.8"/>
            <circle cx="-2" cy="-3" r="2" fill="#fce7f3" opacity="0.7"/>
          </g>
        </g>

        <!-- Summer: Fruits -->
        <g v-if="currentSeason === 'summer'" class="fruits">
          <circle cx="75" cy="85" r="5" fill="#dc2626" class="fruit" />
          <circle cx="160" cy="80" r="4.5" fill="#b91c1c" class="fruit" />
          <circle cx="105" cy="50" r="4" fill="#dc2626" class="fruit" />
          <circle cx="60" cy="105" r="4" fill="#b91c1c" class="fruit" />
          <circle cx="145" cy="95" r="5" fill="#dc2626" class="fruit" />
          <circle cx="90" cy="68" r="3.5" fill="#991b1b" class="fruit" />
          <!-- Fruit stems -->
          <line x1="75" y1="80" x2="75" y2="77" stroke="#5D3A1A" stroke-width="1"/>
          <line x1="160" y1="75" x2="160" y2="72" stroke="#5D3A1A" stroke-width="1"/>
          <line x1="105" y1="46" x2="105" y2="43" stroke="#5D3A1A" stroke-width="1"/>
        </g>

        <!-- Autumn: some leaves still on tree (sparse) -->
        <g v-if="currentSeason === 'autumn'" class="autumn-leaves">
          <ellipse cx="85" cy="60" rx="6" ry="3" fill="#ea580c" transform="rotate(30 85 60)" class="on-tree-leaf"/>
          <ellipse cx="140" cy="52" rx="5" ry="2.5" fill="#dc2626" transform="rotate(-20 140 52)" class="on-tree-leaf"/>
          <ellipse cx="65" cy="92" rx="5" ry="2.5" fill="#ca8a04" transform="rotate(45 65 92)" class="on-tree-leaf"/>
          <ellipse cx="155" cy="88" rx="6" ry="3" fill="#ea580c" transform="rotate(-35 155 88)" class="on-tree-leaf"/>
          <ellipse cx="110" cy="42" rx="4" ry="2" fill="#dc2626" transform="rotate(15 110 42)" class="on-tree-leaf"/>
        </g>

        <!-- Winter: Snow on branches -->
        <g v-if="currentSeason === 'winter'" class="snow-on-tree">
          <ellipse cx="65" cy="153" rx="8" ry="3" fill="white" opacity="0.8"/>
          <ellipse cx="155" cy="143" rx="7" ry="2.5" fill="white" opacity="0.8"/>
          <ellipse cx="75" cy="118" rx="6" ry="2" fill="white" opacity="0.7"/>
          <ellipse cx="150" cy="113" rx="6" ry="2" fill="white" opacity="0.7"/>
          <ellipse cx="110" cy="93" rx="5" ry="2" fill="white" opacity="0.6"/>
          <!-- Snow on trunk top -->
          <ellipse cx="110" cy="158" rx="6" ry="2.5" fill="white" opacity="0.7"/>
        </g>
      </svg>

      <!-- Falling leaves (autumn) -->
      <div v-if="currentSeason === 'autumn'" class="falling-leaves">
        <div
          v-for="leaf in leaves"
          :key="leaf.id"
          class="leaf"
          :style="{
            left: leaf.x + '%',
            animationDuration: leaf.duration + 's',
            animationDelay: leaf.delay + 's',
            color: leaf.color,
            fontSize: leaf.size + 'px'
          }"
        >&#127809;</div>
      </div>

      <!-- Snowflakes (winter) -->
      <div v-if="currentSeason === 'winter'" class="snowflakes">
        <div
          v-for="flake in snowflakes"
          :key="flake.id"
          class="snowflake"
          :style="{
            left: flake.x + '%',
            animationDuration: flake.duration + 's',
            animationDelay: flake.delay + 's',
            fontSize: flake.size + 'px',
            opacity: flake.opacity
          }"
        >&#10052;</div>
      </div>

      <!-- Spring petals -->
      <div v-if="currentSeason === 'spring'" class="petals">
        <div
          v-for="petal in petals"
          :key="petal.id"
          class="petal"
          :style="{
            left: petal.x + '%',
            animationDuration: petal.duration + 's',
            animationDelay: petal.delay + 's',
            background: petal.color
          }"
        ></div>
      </div>

      <!-- Season label -->
      <div class="season-label" :style="{ color: currentSeasonObj.color }">
        {{ currentSeasonObj.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '@/store'

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter'

const seasons = [
  { key: 'spring' as SeasonKey, label: '春', color: '#f472b6' },
  { key: 'summer' as SeasonKey, label: '夏', color: '#22c55e' },
  { key: 'autumn' as SeasonKey, label: '秋', color: '#f97316' },
  { key: 'winter' as SeasonKey, label: '冬', color: '#60a5fa' },
]

const blogStore = useBlogStore()
const currentSeason = computed(() => blogStore.currentSeason)
const currentSeasonObj = computed(() => seasons.find(s => s.key === currentSeason.value)!)

// Foliage colors per season
const foliageBack = computed(() => {
  switch (currentSeason.value) {
    case 'spring': return '#65a30d'
    case 'summer': return '#14532d'
    case 'autumn': return '#7c2d12'
    case 'winter': return '#475569'
  }
})

const foliageMid = computed(() => {
  switch (currentSeason.value) {
    case 'spring': return '#84cc16'
    case 'summer': return '#16a34a'
    case 'autumn': return '#c2410c'
    case 'winter': return '#64748b'
  }
})

const foliageFront = computed(() => {
  switch (currentSeason.value) {
    case 'spring': return '#a3e635'
    case 'summer': return '#4ade80'
    case 'autumn': return '#ea580c'
    case 'winter': return '#94a3b8'
  }
})

// Generate falling leaves
const leafColors = ['#f97316', '#ea580c', '#dc2626', '#ca8a04', '#a16207']
const leaves = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 80 + 10,
  duration: Math.random() * 10 + 18,
  delay: Math.random() * 15,
  color: leafColors[Math.floor(Math.random() * leafColors.length)],
  size: Math.random() * 8 + 12
}))

// Generate snowflakes
const snowflakes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  duration: Math.random() * 10 + 18,
  delay: Math.random() * 15,
  size: Math.random() * 8 + 8,
  opacity: Math.random() * 0.6 + 0.4
}))

// Generate spring petals
const petalColors = ['#f9a8d4', '#fbcfe8', '#fce7f3', '#fecdd3']
const petals = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: Math.random() * 80 + 10,
  duration: Math.random() * 10 + 18,
  delay: Math.random() * 15,
  color: petalColors[Math.floor(Math.random() * petalColors.length)]
}))
</script>

<style scoped>
.season-tree {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Tree Scene */
.tree-scene {
  flex: 1;
  min-height: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: background 0.8s ease;
}

.tree-scene.season-spring {
  background: linear-gradient(180deg, #bae6fd 0%, #e0f2fe 30%, #d1fae5 70%, #bbf7d0 100%);
}

.tree-scene.season-summer {
  background: linear-gradient(180deg, #38bdf8 0%, #7dd3fc 30%, #4ade80 60%, #16a34a 100%);
}

.tree-scene.season-autumn {
  background: linear-gradient(180deg, #fed7aa 0%, #fde68a 30%, #fdba74 60%, #c2410c 100%);
}

.tree-scene.season-winter {
  background: linear-gradient(180deg, #94a3b8 0%, #cbd5e1 30%, #e2e8f0 60%, #f1f5f9 100%);
}

/* Ground */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35px;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  transition: background 0.8s ease;
}

.season-spring .ground { background: #86efac; }
.season-summer .ground { background: #22c55e; }
.season-autumn .ground { background: #a16207; }
.season-winter .ground { background: #e2e8f0; }

/* Tree SVG */
.tree-svg {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 220px;
}

/* Foliage animations */
.foliage ellipse {
  transition: fill 0.8s ease;
}

.foliage-back {
  animation: sway-back 5s ease-in-out infinite;
}

.foliage-mid {
  animation: sway-mid 4.5s ease-in-out infinite 0.3s;
}

.foliage-front {
  animation: sway-front 4s ease-in-out infinite 0.6s;
}

@keyframes sway-back {
  0%, 100% { transform: translateX(0) scale(1); }
  50% { transform: translateX(1.5px) scale(1.01); }
}

@keyframes sway-mid {
  0%, 100% { transform: translateX(0) scale(1); }
  50% { transform: translateX(1px) scale(1.005); }
}

@keyframes sway-front {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(0.5px); }
}

/* Winter foliage sparse */
.foliage-winter ellipse {
  opacity: 0.6;
}

/* Blossoms */
.blossom {
  animation: bloom 2.5s ease-in-out infinite alternate;
}

.blossom-cluster {
  animation: bloom-cluster 3s ease-in-out infinite alternate;
}

@keyframes bloom {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 1; }
}

@keyframes bloom-cluster {
  0% { transform: translate(85px, 45px) scale(1); }
  100% { transform: translate(85px, 45px) scale(1.15); }
}

/* Fruits */
.fruit {
  animation: fruit-sway 3s ease-in-out infinite;
}

@keyframes fruit-sway {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}

/* Autumn leaves on tree */
.on-tree-leaf {
  animation: leaf-rustle 3s ease-in-out infinite;
}

@keyframes leaf-rustle {
  0%, 100% { transform: rotate(30deg) translateX(0); }
  50% { transform: rotate(35deg) translateX(1px); }
}

/* Falling Leaves */
.falling-leaves {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.leaf {
  position: absolute;
  top: -20px;
  animation: leaf-fall linear infinite;
}

@keyframes leaf-fall {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 1;
  }
  10% {
    transform: translateY(10vh) rotate(36deg) translateX(25px);
  }
  20% {
    transform: translateY(20vh) rotate(72deg) translateX(-15px);
  }
  30% {
    transform: translateY(30vh) rotate(108deg) translateX(30px);
  }
  40% {
    transform: translateY(40vh) rotate(144deg) translateX(-20px);
  }
  50% {
    transform: translateY(50vh) rotate(180deg) translateX(25px);
  }
  60% {
    transform: translateY(60vh) rotate(216deg) translateX(-18px);
  }
  70% {
    transform: translateY(70vh) rotate(252deg) translateX(22px);
  }
  80% {
    transform: translateY(80vh) rotate(288deg) translateX(-12px);
  }
  90% {
    transform: translateY(calc(80vh + 20px)) rotate(324deg) translateX(15px);
    opacity: 0.6;
  }
  100% {
    transform: translateY(calc(100vh - 60px)) rotate(360deg) translateX(-5px);
    opacity: 0;
  }
}

/* Snowflakes */
.snowflakes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: white;
  animation: snow-fall linear infinite;
}

@keyframes snow-fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  10% {
    transform: translateY(10vh) translateX(12px) rotate(36deg);
  }
  20% {
    transform: translateY(20vh) translateX(-10px) rotate(72deg);
  }
  30% {
    transform: translateY(30vh) translateX(15px) rotate(108deg);
  }
  40% {
    transform: translateY(40vh) translateX(-8px) rotate(144deg);
  }
  50% {
    transform: translateY(50vh) translateX(13px) rotate(180deg);
  }
  60% {
    transform: translateY(60vh) translateX(-11px) rotate(216deg);
  }
  70% {
    transform: translateY(70vh) translateX(10px) rotate(252deg);
  }
  80% {
    transform: translateY(80vh) translateX(-7px) rotate(288deg);
  }
  90% {
    transform: translateY(calc(80vh + 20px)) translateX(9px) rotate(324deg);
    opacity: 0.5;
  }
  100% {
    transform: translateY(calc(100vh - 60px)) translateX(-5px) rotate(360deg);
    opacity: 0;
  }
}

/* Spring Petals */
.petals {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.petal {
  position: absolute;
  top: -10px;
  width: 8px;
  height: 8px;
  border-radius: 50% 0 50% 0;
  animation: petal-fall linear infinite;
}

@keyframes petal-fall {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 0.9;
  }
  20% {
    transform: translateY(20vh) rotate(72deg) translateX(20px);
    opacity: 0.8;
  }
  40% {
    transform: translateY(40vh) rotate(144deg) translateX(-15px);
    opacity: 0.7;
  }
  60% {
    transform: translateY(60vh) rotate(216deg) translateX(25px);
    opacity: 0.5;
  }
  80% {
    transform: translateY(80vh) rotate(288deg) translateX(-10px);
    opacity: 0.3;
  }
  100% {
    transform: translateY(calc(100vh - 60px)) rotate(360deg) translateX(12px);
    opacity: 0;
  }
}

/* Season Label */
.season-label {
  position: absolute;
  bottom: 42px;
  right: 14px;
  font-size: 1.5rem;
  font-weight: 800;
  opacity: 0.2;
  pointer-events: none;
}
</style>
