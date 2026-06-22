export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)((-|--|__)[a-z0-9]+)*$',
      {
        message: selector => `Expected class selector "${selector}" to be kebab-case`
      }
    ],
    'value-keyword-case': [
      'lower',
      {
        ignoreFunctions: [/^v-bind/]
      }
    ],

    // prettier-ignore
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'declarations'
    ],
    'order/custom-properties-alphabetical-order': true,
    'order/properties-order': [
      [
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
            'grid-template-rows',
            'grid-template-columns',
            'grid-template-areas',
            'grid-auto-rows',
            'grid-auto-columns',
            'grid-auto-flow',
            'justify-items',
            'align-items',
            'place-items',
            'justify-content',
            'align-content',
            'place-content',
            'grid-row-start',
            'grid-row-end',
            'grid-column-start',
            'grid-column-end',
            'grid-row',
            'grid-column',
            'grid-area',
            'justify-self',
            'align-self',
            'place-self'
          ]
        },
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
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
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
            'border-radius',
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius',
            'border-start-start-radius',
            'border-start-end-radius',
            'border-end-start-radius',
            'border-end-end-radius',
            'overflow',
            'overflow-x',
            'overflow-y',
            'overflow-clip-margin'
          ]
        },
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
        unspecified: 'bottom',
        emptyLineBeforeUnspecified: 'always'
      }
    ]
  },
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      extends: ['stylelint-config-recommended-vue/scss'],
      customSyntax: 'postcss-html'
    }
  ]
}
