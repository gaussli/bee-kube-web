<template>
  <div class="bee-radar-chart">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <defs>
        <!-- 数据区域径向渐变：从中心向外越来越浅 -->
        <radialGradient
          :id="`radar-area-gradient-${uid}`"
          cx="50%"
          cy="50%"
          gradientUnits="userSpaceOnUse"
          :fx="center"
          :fy="center"
          :fr="0"
          :r="radius"
        >
          <stop offset="0%" :stop-color="color" stop-opacity="1" />
          <stop offset="100%" :stop-color="color" stop-opacity="0.2" />
        </radialGradient>
      </defs>

      <g :transform="`translate(${center}, ${center})`">
        <!-- 背景网格圆环 -->
        <circle
          v-for="level in levels"
          :key="`bg-circle-${level}`"
          :r="radius * level"
          fill="none"
          :stroke="gridColor"
          :stroke-width="1"
          :stroke-opacity="0.3"
          class="grid-circle"
        />

        <!-- 网格线 -->
        <line
          v-for="(axis, index) in axes"
          :key="`grid-line-${index}`"
          :x1="0"
          :y1="0"
          :x2="radius * Math.cos(angleToRad(axis.angle))"
          :y2="radius * Math.sin(angleToRad(axis.angle))"
          :stroke="gridColor"
          :stroke-width="1"
          :stroke-opacity="0.3"
          class="grid-line"
        />

        <!-- 数据区域 -->
        <polygon
          :points="getPolygonPoints()"
          :fill="`url(#radar-area-gradient-${uid})`"
          :stroke="color"
          :stroke-width="2"
          stroke-linejoin="round"
          class="data-area"
          :style="dataAreaStyle"
        />

        <!-- 数据点 -->
        <g
          v-for="(point, index) in dataPoints"
          :key="`point-${index}`"
          @mouseenter="showTooltip($event, index)"
          @mouseleave="hideTooltip"
          @mousemove="moveTooltip($event)"
        >
          <circle
            :cx="point.x"
            :cy="point.y"
            :r="pointRadius"
            :fill="color"
            class="data-point"
            :opacity="animationProgress"
          />
          <!-- 数据点脉冲效果 -->
          <circle
            v-if="showAnimation"
            :cx="point.x"
            :cy="point.y"
            :r="pointRadius"
            :fill="color"
            :fill-opacity="0.3 * animationProgress"
            class="data-point-pulse"
            :style="{ animationDelay: `${(index / axes.length) * (animationDuration * 0.5)}ms` }"
          />
        </g>

        <!-- 轴标签（沿轴线对齐） -->
        <g v-for="(axis, index) in axes" :key="`label-${index}`">
          <text
            :x="labelPosition(index).x"
            :y="labelPosition(index).y"
            :text-anchor="labelAlign(index)"
            :dominant-baseline="labelBaseline(index)"
            :fill="labelColor"
            :font-size="fontSize"
            font-weight="500"
            class="axis-label"
          >
            {{ axis.label }}
          </text>
        </g>
      </g>
    </svg>

    <!-- Tooltip -->
    <Transition name="tooltip-fade">
      <div v-if="tooltipVisible" class="radar-tooltip" :style="tooltipStyle">
        <div class="tooltip-header">{{ tooltipData.label }}</div>
        <div class="tooltip-content">
          <div class="tooltip-item">
            <span class="tooltip-label">当前值</span>
            <span class="tooltip-value">{{ tooltipData.value }}%</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-label">已用</span>
            <span class="tooltip-value">{{ tooltipData.used }}</span>
          </div>
          <div class="tooltip-item">
            <span class="tooltip-label">总计</span>
            <span class="tooltip-value">{{ tooltipData.total }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

import { COLOR_GRAY_50, COLOR_PRIMARY } from '@/config/color'

// 组件名称配置
defineOptions({ name: 'BeeRadarChart' })

// 雷达图轴数据结构
export interface RadarAxis {
  label: string // 轴标签名称
  value: number // 轴数值（百分比）
  used?: string // 已使用量（可选）
  total?: string // 总量（可选）
}

// 提示框数据结构
interface TooltipData {
  label: string
  value: number
  used: string
  total: string
}

// 组件属性定义
const props = withDefaults(
  defineProps<{
    data: RadarAxis[]
    size?: number
    color?: string
    gridColor?: string
    showAnimation?: boolean
    animationDuration?: number
  }>(),
  {
    size: 300, // 图表尺寸，默认300px
    color: COLOR_PRIMARY, // 数据区域颜色
    gridColor: COLOR_GRAY_50, // 网格颜色
    showAnimation: true, // 是否显示动画
    animationDuration: 1500, // 动画持续时间（毫秒）
  },
)

// 生成唯一ID，用于SVG元素ID
const uid = ref(Math.random().toString(36).substring(2, 9))
// 动画进度（0-1）
const animationProgress = ref(0)
// 动画帧ID，用于取消动画
let animationFrame: number | null = null

// ==================== Tooltip 提示框相关 ====================
// Tooltip 可见性状态
const tooltipVisible = ref(false)
// Tooltip 显示的数据
const tooltipData = ref<TooltipData>({ label: '', value: 0, used: '-', total: '-' })
// Tooltip 位置
const tooltipPosition = ref({ x: 0, y: 0 })

// Tooltip 样式计算属性
const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x + 15}px`,
  top: `${tooltipPosition.value.y - 10}px`,
}))

// 显示 Tooltip
function showTooltip(event: MouseEvent, index: number) {
  const axis = axes.value[index]
  tooltipData.value = {
    label: axis.label,
    value: axis.value,
    used: axis.used || '-',
    total: axis.total || '-',
  }
  tooltipPosition.value = { x: event.offsetX, y: event.offsetY }
  tooltipVisible.value = true
}

// 隐藏 Tooltip
function hideTooltip() {
  tooltipVisible.value = false
}

// 移动 Tooltip（跟随鼠标）
function moveTooltip(event: MouseEvent) {
  tooltipPosition.value = { x: event.offsetX, y: event.offsetY }
}

// ==================== 尺寸和布局计算 ====================

// 雷达图层级系数（用于绘制同心多边形网格）
const levels = [0.2, 0.4, 0.6, 0.8, 1.0]

// 中心点坐标
const center = computed(() => props.size / 2)
// 半径（为画布尺寸的75%）
const radius = computed(() => (props.size / 2) * 0.75)
// 数据点圆点半径
const pointRadius = computed(() => props.size * 0.015)
// 标签字体大小
const fontSize = computed(() => Math.max(12, props.size * 0.04))

// 标签颜色（继承网格颜色）
const labelColor = computed(() => props.gridColor)

// 计算轴的角度
const axes = computed(() => {
  const data = props.data.slice(0, 6)
  const count = data.length
  const angleStep = 360 / count

  return data.map((item, index) => ({
    ...item,
    angle: index * angleStep - 90, // 从顶部开始，顺时针分布
  }))
})

// ==================== 工具函数 ====================

// 角度转弧度
function angleToRad(angle: number): number {
  return (angle * Math.PI) / 180
}

// ==================== SVG 点计算 ====================

// 生成数据区域多边形的顶点坐标字符串
function getPolygonPoints(): string {
  return axes.value
    .map(axis => {
      const r = radius.value * (axis.value / 100) * animationProgress.value
      const x = r * Math.cos(angleToRad(axis.angle))
      const y = r * Math.sin(angleToRad(axis.angle))
      return `${x},${y}`
    })
    .join(' ')
}

// 数据点坐标数组（用于绘制折线和圆点）
const dataPoints = computed(() => {
  return axes.value.map(axis => {
    const r = radius.value * (axis.value / 100) * animationProgress.value
    return {
      x: r * Math.cos(angleToRad(axis.angle)),
      y: r * Math.sin(angleToRad(axis.angle)),
    }
  })
})

// 计算标签位置（沿轴线对齐，在轴线末端）
function labelPosition(index: number) {
  const padding = 10 // 标签与轴线末端的间距
  const axis = axes.value[index]
  const x = (radius.value + padding) * Math.cos(angleToRad(axis.angle))
  const y = (radius.value + padding) * Math.sin(angleToRad(axis.angle))
  return { x, y }
}

// 计算标签文本对齐方式（根据角度调整，使标签沿轴线对齐）
function labelAlign(index: number): string {
  const angle = axes.value[index].angle
  // 右侧区域 - 标签在右侧，-90-90度
  if (angle > -90 && angle < 90) return 'start'
  // 左侧区域 - 标签在左侧，90-270度
  if (angle > 90 && angle < 270) return 'end'
  // 顶部和底部 - 居中对齐
  return 'middle'
}

// 计算标签基线（根据角度调整）
function labelBaseline(index: number): string {
  const angle = axes.value[index].angle
  // 顶部区域 - 基线在底部
  if (angle > 180 || angle < 0) return 'auto'
  // 底部区域 - 基线在顶部
  if (angle > 0 && angle < 180) return 'hanging'
  // 左右两侧区域 - 居中对齐
  return 'middle'
}

// 数据区域透明度（随动画进度变化）
const dataAreaStyle = computed(() => ({
  opacity: animationProgress.value,
}))

// 动画持续时间
const animationDuration = computed(() => props.animationDuration)

// 执行入场动画
function animate() {
  const startTime = performance.now()
  const duration = props.animationDuration

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    animationProgress.value = Math.min(elapsed / duration, 1)

    // 使用 easeOutQuart 缓动函数（缓出效果）
    animationProgress.value = 1 - Math.pow(1 - animationProgress.value, 4)

    if (animationProgress.value < 1) {
      animationFrame = requestAnimationFrame(step)
    }
  }

  animationFrame = requestAnimationFrame(step)
}

// 组件挂载时触发动画
onMounted(() => {
  void nextTick(() => {
    if (props.showAnimation) {
      setTimeout(animate, 100) // 延迟100ms开始动画
    } else {
      animationProgress.value = 1 // 禁用动画时直接显示
    }
  })
})

// 监听数据变化，重新触发动画
watch(
  () => props.data,
  () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame) // 取消当前动画
    }
    animationProgress.value = 0 // 重置动画进度
    if (props.showAnimation) {
      setTimeout(animate, 100)
    } else {
      animationProgress.value = 1
    }
  },
)
</script>

<style lang="scss" scoped>
@use 'sass:map';

.bee-radar-chart {
  position: relative;
  display: inline-block;

  svg {
    overflow: visible;
  }

  .grid-circle {
    transition: opacity 0.3s ease;
  }

  .grid-line {
    transition: stroke-opacity 0.3s ease;
  }

  .data-area {
    opacity: 0;
  }

  .data-point {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.5);
    }
  }

  .axis-label,
  .value-label {
    pointer-events: none;
    user-select: none;
  }

  .value-label {
    opacity: 0.7;
  }

  .radar-tooltip {
    position: absolute;
    z-index: 1000;
    min-width: 140px;
    padding: 8px;
    border-radius: 4px;
    background: map.get($colors, 'gray', 25);
    box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
    pointer-events: none;

    .tooltip-header {
      padding-bottom: 8px;
      border-bottom: 1px solid $color-border-tertiary;
      font-size: 14px;
      font-weight: 500;
      color: $color-text-primary;
    }

    .tooltip-content {
      .tooltip-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        font-size: 12px;

        .tooltip-label {
          color: $color-text-secondary;
        }

        .tooltip-value {
          font-weight: 500;
          color: map.get($colors, 'primary', 50);
        }
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0;
    transform: scale(1.8);
  }
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
