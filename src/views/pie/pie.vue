<template>
  <div>
    <h2>PIE</h2>
    <div ref="pie" class="pie-area" style="width:800px;height:700px"></div>
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
      width: '100%',
      height: 600,
      x: 100,
      y: 40,
      legend: {
        position: 'bottom' // defaut center  bottom
      },
      title: {
        text: '饼图1-1',
        x: 'left',
        y: 10,
        style: {
          color: '#e31a1c'
        }
      },
      label: {
        format: '年龄{a}:{b} {p}' // string template with a:name/b:value/p:pencent
      },
      serious: {
        outer: 150,
        inner: 80,
        color: ['#a6cee3', '#1f78b4', '#9a169f', '#feb82c', '#33a02c', '#fb9a99', '#38049a'],
        lineStyle: {
          points: 'three' // default two
        }
      },
      style: 'margin-top:20px',
      data: [
        {
          age: '<5',
          population: 27
        },
        {
          age: '5-13',
          population: 23
        },
        {
          age: '13-17',
          population: 32
        },
        {
          age: '17-24',
          population: 55
        },
        {
          age: '24-44',
          population: 35
        },
        {
          age: '45-64',
          population: 66
        },
        {
          age: '>64',
          population: 37
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
}

polyline {
  opacity: 0.3;
  stroke: black;
  stroke-width: 2px;
  fill: none;
}
</style>
