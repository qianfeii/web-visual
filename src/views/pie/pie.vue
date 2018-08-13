<template>
  <div>
    <h2>PIE</h2>
    <div ref="pie" class="pie-area" style="width:800px;height:700px">
    </div>
  </div>
</template>
<script>
import VISUAL from '../../utils/visual.js'
export default {
  name: 'pie-chart',
  data() {
    return {}
  },
  mounted() {
    let _this = this
    let params = {
      type: 'pie',
      width: '100%', // default or error set ,width is outer ele width
      height: 600,
      x: '0', // defalu center .result=center+x
      y: 40,
      legend: {
        position: 'top' // defaut center , bottom
      },
      title: {
        text: '饼图1-1',
        y: 10,
        style: {
          color: '#e31a1c'
        }
      },
      label: {
        format: '类别:{a}' // string template with a:name/b:value/p:pencent
      },
      serious: {
        type: 'round', // round 圆  ring 环
        // outer: 200,
        // inner: 1, // type=ring 生效
        // ringSize: 100, // default 50
        color: ['#a6cee3', '#1f78b4', '#9a169f', '#feb82c', '#33a02c', '#fb9a99', '#38049a'],
        lineStyle: {
          points: 'two' // default two ,with three
        }
      },
      style: 'margin-top:20px',
      data: [
        {
          type: '易购销售额',
          value: 48
        },
        {
          type: '门店销售额',
          value: 22
        },
        {
          type: '天猫销售额',
          value: 15
        },
        {
          type: '零售云销售额',
          value: 10
        },
        {
          type: '当当网销售额',
          value: 5
        }
      ]
    }
    _this.$nextTick(() => {
      let _pie = _this.$refs.pie
      let visual = new VISUAL(_pie)
      visual.baseFun()
      visual.init(params)
    })
  }
}
</script>

<style lang="postcss" scoped>
@import '../../styles/pie.pcss';
h2 {
  color: blueviolet;
}

.pie-area {
  margin: 10px;
  width: 520px;
  height: 520px;
  color: red;
  margin: 10px auto 0 auto;
  border: 1px solid red;
  .ss {
    color: yellow;
  }
}

polyline {
  opacity: 0.3;
  stroke: black;
  stroke-width: 2px;
  fill: none;
}
</style>
