<template>
  <div class="floating-music" :class="{ expanded: isExpanded }">
    <div class="mini-player" @click="toggleExpand">
      <div class="mini-cover">
        <img :src="currentSong.cover" :alt="currentSong.title" :class="{ playing: isPlaying }" />
      </div>
      <div class="mini-info">
        <div class="mini-title">{{ currentSong.title }}</div>
        <div class="mini-artist">{{ currentSong.artist }}</div>
      </div>
      <button class="mini-play-btn" @click.stop="togglePlay">
        <Pause v-if="isPlaying" :size="16" />
        <Play v-else :size="16" />
      </button>
    </div>

    <div class="expanded-player" v-if="isExpanded">
      <div class="player-cover">
        <img :src="currentSong.cover" :alt="currentSong.title" :class="{ playing: isPlaying }" />
      </div>
      <div class="player-info">
        <h4 class="song-title">{{ currentSong.title }}</h4>
        <p class="song-artist">{{ currentSong.artist }}</p>
      </div>
      <div class="player-controls">
        <button class="control-btn" @click="prevSong">
          <SkipBack :size="16" />
        </button>
        <button class="control-btn play-btn" @click="togglePlay">
          <Pause v-if="isPlaying" :size="20" />
          <Play v-else :size="20" />
        </button>
        <button class="control-btn" @click="nextSong">
          <SkipForward :size="16" />
        </button>
      </div>
      <div class="player-progress">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seek">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
      <div class="player-volume">
        <button class="volume-btn" @click="toggleMute">
          <Volume2 v-if="!isMuted && volume > 0" :size="14" />
          <VolumeX v-else :size="14" />
        </button>
        <input type="range" min="0" max="100" v-model="volume" @input="changeVolume" />
      </div>
      <button class="close-btn" @click="toggleExpand">
        <X :size="16" />
      </button>
    </div>

    <audio ref="audioRef" :src="currentSong.url" @timeupdate="updateTime" @loadedmetadata="onLoaded" @ended="nextSong"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-vue-next'

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const isExpanded = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const duration = ref(0)

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

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
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

  // 检查是否开启了自动播放
  const autoPlay = localStorage.getItem('musicAutoPlay')
  if (autoPlay === 'true' && audioRef.value) {
    audioRef.value.play()
    isPlaying.value = true
  }
})
</script>

<style scoped>
.floating-music {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 100;
}

.mini-player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 8px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: var(--radius-full);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mini-player:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.mini-cover {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.mini-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mini-cover img.playing {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mini-info {
  flex: 1;
  min-width: 80px;
}

.mini-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-artist {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
}

.mini-play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  flex-shrink: 0;
}

.expanded-player {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 280px;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.player-cover {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.player-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-cover img.playing {
  animation: rotate 15s linear infinite;
}

.player-info {
  text-align: center;
}

.song-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin: 0 0 2px;
}

.song-artist {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.control-btn.play-btn {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.time {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.5);
  min-width: 28px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
}

.player-volume {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.volume-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.player-volume input[type="range"] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
}

.player-volume input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

@media (max-width: 768px) {
  .floating-music {
    right: 16px;
    bottom: 70px;
  }
}
</style>
