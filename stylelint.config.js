/**
 * Bee Kube Stylelint 配置文件
 * @description
 * 基于 stylelint-config-standard-scss 扩展，强制执行以下规则：
 *   1. 选择器命名   — class 使用 kebab-case 命名
 *   2. 属性值大小写 — 统一小写，忽略 Vue v-bind 函数值
 *   3. 声明顺序     — 自定义属性 → SCSS 变量 → 声明 → 属性分组排序
 *   4. Vue 文件     — 通过 postcss-html 解析 .vue 文件的 <style> 块
 *
 * @remarks
 * 执行 pnpm lint:style 时会按此配置检查 .css / .scss / .vue 文件
 */

export default {
  /* ======================================================================
   * 基础配置
   * ====================================================================== */
  extends: ['stylelint-config-standard-scss'],  // SCSS 标准规则（含缩进、引号、空行等）
  plugins: ['stylelint-order'],                 // CSS 属性排序插件

  /* ======================================================================
   * 规则定义
   * ====================================================================== */
  rules: {
    /* ------------------------------------------------------------------
     * 1. 选择器 class 命名规范
     *    强制 kebab-case：小写字母开头，中划线、双中划线、双下划线分隔
     *    示例：✅ bee-button  ✅ bee-button--primary  ✅ bee-button__icon
     *          ❌ BeeButton   ❌ beeButton            ❌ bee_button
     * ------------------------------------------------------------------ */
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)((-|--|__)[a-z0-9]+)*$',
      {
        message: selector => `Expected class selector "${selector}" to be kebab-case`
      }
    ],

    /* ------------------------------------------------------------------
     * 2. 属性值关键字大小写
     *    统一使用小写，但忽略 Vue 的 v-bind() CSS 函数
     *    原因：v-bind() 中的值是 JS 表达式，不应受 CSS 大小写规则约束
     * ------------------------------------------------------------------ */
    'value-keyword-case': [
      'lower',
      {
        ignoreFunctions: [/^v-bind/]  // 忽略 v-bind() 中的值，如 v-bind(color)
      }
    ],

    /* ------------------------------------------------------------------
     * 3. 声明块内声明类型的排列顺序
     *    优先级：--自定义属性 → $SCSS变量 → 普通声明（color / margin 等）
     * ------------------------------------------------------------------ */
    // prettier-ignore
    'order/order': [
      'custom-properties',  // CSS 自定义属性（--开头）
      'dollar-variables',   // SCSS 变量（$开头）
      'declarations'        // 普通 CSS 属性声明
    ],

    /* ------------------------------------------------------------------
     * 4. 自定义属性按字母序排列
     *    示例：✅ --color / --font-size / --padding
     * ------------------------------------------------------------------ */
    'order/custom-properties-alphabetical-order': true,

    /* ------------------------------------------------------------------
     * 5. CSS 属性分组排序
     *    将属性按功能分为 8 组，每组内按声明顺序排列。
     *    未归入任何分组的属性（unspecified）放在最顶部，前面留一个空行。
     *
     *    分组说明：
     *    ┌──────────┬──────────────────────────────────────────────────┐
     *    │ 分组     │ 属性类别                                         │
     *    ├──────────┼──────────────────────────────────────────────────┤
     *    │ 布局     │ position / display / flex / grid / z-index 等    │
     *    │ 盒模型   │ 尺寸 / 内外边距 / 边框 / 圆角 / overflow        │
     *    │ 文本排版 │ 字体 / 字号 / 行高 / 颜色 / 对齐等              │
     *    │ 视觉效果 │ 背景 / 透明度 / 阴影 / 轮廓 / transform 等      │
     *    │ SVG 属性 │ fill / stroke / 相关透明度与渲染属性            │
     *    │ 内容生成 │ content / counter / quotes                      │
     *    │ 动画过渡 │ transition / animation 及其子属性               │
     *    │ 滚动     │ scrollbar / scroll-behavior / scroll-snap 等    │
     *    └──────────┴──────────────────────────────────────────────────┘
     * ------------------------------------------------------------------ */
    'order/properties-order': [
      [
        // 布局相关
        {
          groupName: '布局',
          properties: [
            'position',
            'float',
            'clear',
            'top',
            'right',
            'bottom',
            'left',
            'inset',
            'z-index',
            // Flex
            'display',
            'gap',
            'row-gap',
            'column-gap',
            'flex-direction',
            'flex-wrap',
            'flex-flow',
            'justify-content',
            'align-items',
            'align-content',
            'flex',
            'flex-grow',
            'flex-shrink',
            'flex-basis',
            'order',
            'align-self',
            // Grid
            'grid-template-rows',
            'grid-template-columns',
            'grid-template-areas',
            'grid-auto-rows',
            'grid-auto-columns',
            'grid-auto-flow',
            'justify-items',
            'place-items',
            'place-content',
            'grid-row-start',
            'grid-row-end',
            'grid-column-start',
            'grid-column-end',
            'grid-row',
            'grid-column',
            'grid-area',
            'justify-self',
            'place-self'
          ]
        },

        // 盒模型
        {
          groupName: '盒模型',
          properties: [
            'box-sizing',
            'width',
            'height',
            'min-width',
            'min-height',
            'max-width',
            'max-height',
            'aspect-ratio',
            // 内边距
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            // 外边距
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            // 边框
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-style',
            'border-top-style',
            'border-right-style',
            'border-bottom-style',
            'border-left-style',
            'border-color',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',
            'border-image',
            'border-image-source',
            'border-image-slice',
            'border-image-width',
            'border-image-outset',
            'border-image-repeat',
            'border-width',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'border-collapse',
            'border-spacing',
            // 圆角
            'border-radius',
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius',
            'border-start-start-radius',
            'border-start-end-radius',
            'border-end-start-radius',
            'border-end-end-radius',
            // 溢出
            'overflow',
            'overflow-x',
            'overflow-y',
            'overflow-clip-margin'
          ]
        },

        // 文本排版
        {
          groupName: '文本排版',
          properties: [
            'font',
            'font-family',
            'font-size',
            'font-smoothing',
            'osx-font-smoothing',
            'font-style',
            'font-weight',
            'line-height',
            'letter-spacing',
            'word-spacing',
            'color',
            'text-align',
            'text-decoration',
            'text-indent',
            'text-overflow',
            'text-rendering',
            'text-size-adjust',
            'text-shadow',
            'text-transform',
            'word-break',
            'word-wrap',
            'white-space'
          ]
        },

        // 视觉效果
        {
          groupName: '视觉效果',
          properties: [
            'visibility',
            'opacity',
            'background',
            'background-attachment',
            'background-color',
            'background-image',
            'background-position',
            'background-repeat',
            'background-size',
            'object-fit',
            'vertical-align',
            'box-shadow',
            'outline',
            'outline-offset',
            'cursor',
            'pointer-events',
            'user-select',
            'transform',
            'transform-origin',
            'transform-style'
          ]
        },

        // SVG 属性
        {
          groupName: 'SVG 属性',
          // prettier-ignore
          properties: [
            'fill',
            'fill-opacity',
            'stroke',
            'stroke-width',
            'stroke-opacity',
            'stroke-linecap',
            'stroke-linejoin',
            'stop-color',
            'stop-opacity'
          ]
        },

        // 内容生成（伪元素相关）
        {
          groupName: '内容生成',
          // prettier-ignore
          properties: [
            'content',
            'counter-reset',
            'counter-increment',
            'quotes'
          ]
        },

        // 动画过渡
        {
          groupName: '动画过渡',
          properties: [
            'transition',
            'transition-delay',
            'transition-duration',
            'transition-property',
            'transition-timing-function',
            'animation',
            'animation-delay',
            'animation-duration',
            'animation-iteration-count',
            'animation-name',
            'animation-play-state',
            'animation-timing-function',
            'animation-fill-mode'
          ]
        },

        // 滚动条与滚动行为
        {
          groupName: '滚动',
          // prettier-ignore
          properties: [
            'scrollbar-width',
            'scrollbar-color',
            'scroll-behavior',
            'scroll-snap-type',
            'scroll-snap-align',
            'scroll-padding',
            'scroll-padding-top',
            'scroll-padding-bottom'
          ]
        }
      ],
      {
        unspecified: 'top',                 // 未分组的属性放在最前面（bottom → top 变更，更符合直觉）
        emptyLineBeforeUnspecified: 'always' // 未分组属性前保留一个空行，与分组属性隔离
      }
    ],

    /* ------------------------------------------------------------------
     * 6. 代码质量规则
     *    控制嵌套深度、冗余嵌套、冗余简写属性，提升代码可维护性
     * ------------------------------------------------------------------ */

    /** 嵌套深度最大 4 层，忽略伪类/伪元素嵌套 */
    'max-nesting-depth': [
      4,
      {
        ignore: ['pseudo-classes']
      }
    ],

    /** 禁止冗余的 SCSS 嵌套选择器，如 & { .foo { &__bar {} } } */
    'scss/selector-no-redundant-nesting-selector': true,

    /** 禁止可合并的冗余长写属性，如同时设置 margin-top + margin-bottom */
    'declaration-block-no-redundant-longhand-properties': true,

    /** 禁止简写属性中的冗余值，如 margin: 1px 1px 1px 1px → margin: 1px */
    'shorthand-property-no-redundant-values': true
  },

  /* ======================================================================
   * Vue 文件覆盖规则
   *    对 .vue 文件额外加载 Vue 推荐规则，并使用 postcss-html
   *    作为自定义语法解析器以正确处理 <style lang="scss"> 块
   * ====================================================================== */
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],                          // 匹配所有 .vue 文件
      extends: ['stylelint-config-standard-vue/scss'],       // Vue SCSS 标准规则
      customSyntax: 'postcss-html'                           // 解析 Vue SFC 中的 <style> 块
    }
  ]
}
