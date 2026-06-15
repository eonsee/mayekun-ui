<template>
  <div class="music-player">
    <div class="player-main">
      <div class="player-cover">
        <img :src="currentSong.cover" :alt="currentSong.title" :class="{ playing: isPlaying }" />
      </div>
      <div class="player-content">
        <div class="player-info">
          <h4 class="song-title">{{ currentSong.title }}</h4>
          <p class="song-artist">{{ currentSong.artist }}</p>
        </div>
        <div class="player-controls">
          <button class="control-btn" @click="prevSong">
            <SkipBack :size="14" />
          </button>
          <button class="control-btn play-btn" @click="togglePlay">
            <Pause v-if="isPlaying" :size="18" />
            <Play v-else :size="18" />
          </button>
          <button class="control-btn" @click="nextSong">
            <SkipForward :size="14" />
          </button>
        </div>
        <div class="player-progress">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" @click="seek">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>
    <div class="player-footer">
      <div class="volume-control">
        <button class="icon-btn" @click="toggleMute">
          <Volume2 v-if="!isMuted && volume > 0" :size="14" />
          <VolumeX v-else :size="14" />
        </button>
        <input type="range" min="0" max="100" v-model="volume" @input="changeVolume" />
      </div>
      <div class="auto-play-toggle">
        <span class="toggle-label">阅读时播放</span>
        <button class="toggle-btn" :class="{ active: autoPlayOnRead }" @click="toggleAutoPlay">
          <span class="toggle-dot"></span>
        </button>
      </div>
    </div>
    <audio ref="audioRef" :src="currentSong.url" @timeupdate="updateTime" @loadedmetadata="onLoaded" @ended="nextSong"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-vue-next'

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const duration = ref(0)
const autoPlayOnRead = ref(false)

const playlist = [
  {
    id: 518682659,
    title: '起风了',
    artist: '买辣椒也用券',
    cover: 'https://p2.music.126.net/diGAyEmpymX8G9JTkfMCLA==/109951163699673355.jpg',
    url: 'https://music.163.com/song/media/outer/url?id=518682659.mp3'
  }
]

const currentIndex = ref(0)
const currentSong = computed(() => playlist[currentIndex.value])

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const toggleAutoPlay = () => {
  autoPlayOnRead.value = !autoPlayOnRead.value
  localStorage.setItem('musicAutoPlay', String(autoPlayOnRead.value))
}

const prevSong = () => {
  currentIndex.value = (currentIndex.value - 1 + playlist.length) % playlist.length
  if (audioRef.value && isPlaying.value) {
    setTimeout(() => audioRef.value?.play(), 100)
  }
}

const nextSong = () => {
  currentIndex.value = (currentIndex.value + 1) % playlist.length
  if (audioRef.value && isPlaying.value) {
    setTimeout(() => audioRef.value?.play(), 100)
  }
}

const seek = (event: MouseEvent) => {
  if (!audioRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  audioRef.value.currentTime = percent * duration.value
}

const updateTime = () => {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
}

const onLoaded = () => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

const toggleMute = () => {
  if (!audioRef.value) return
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

const changeVolume = () => {
  if (!audioRef.value) return
  audioRef.value.volume = volume.value / 100
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value / 100
  }
  const saved = localStorage.getItem('musicAutoPlay')
  if (saved === 'true') autoPlayOnRead.value = true
})
</script>

<style scoped>
.music-player {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: var(--radius-xl);
  padding: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  box-sizing: border-box;
  justify-content: space-between;
}

[data-theme='dark'] .music-player {
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}

.player-main {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.player-cover {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.player-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-cover img.playing {
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.player-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.player-info {
  text-align: left;
}

.song-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 2px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.control-btn.play-btn {
  width: 36px;
  height: 36px;
  background: var(--primary-color);
  color: white;
}

.control-btn.play-btn:hover {
  background: var(--secondary-color);
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
  min-width: 24px;
}

.progress-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.player-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 2px;
}

.icon-btn:hover {
  color: white;
}

.volume-control input[type="range"] {
  flex: 1;
  height: 3px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  max-width: 60px;
}

.volume-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.auto-play-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-label {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
}

.toggle-btn {
  position: relative;
  width: 28px;
  height: 16px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: var(--primary-color);
}

.toggle-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  transition: all 0.3s ease;
}

.toggle-btn.active .toggle-dot {
  left: 14px;
}
</style>
