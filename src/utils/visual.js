import * as d3 from 'd3'
const pieCase = Symbol('pieCase')
const midAngle = d => {
  return d.startAngle + (d.endAngle - d.startAngle) / 2
}
export default class VISUAL {
  constructor(_dom) {
    this.name = 'visual'
    this.describe = 'visual class'
    this._dom = _dom
  }
  init(params) {
    this.type = params.type ? params.type : undefined
    switch (this.type) {
      case 'pie':
        this[pieCase](params)
        break
      default:
        break
    }
  }
  baseFun() {}
  [pieCase](params) {
    let _this = this
    let _body = d3.select(_this._dom)
    let _width = params.width ? params.width : parseInt(this._dom.style.width)
    let _height = params.height ? params.height : parseInt(this._dom.style.height)
    let _radius = Math.min(_width, _height) / 2
    /*  大小  */
    let _outer = params.serious && params.serious.outer ? params.serious.outer : _radius - 10
    let _inner = params.serious && params.serious.inner ? params.serious.inner : _radius - 100
    if (_outer < _inner) {
      throw new Error(`外圈大小小于内圈`)
    }
    if (_width.includes('%')) {
      _width = (parseInt(this._dom.style.width) * parseInt(_width)) / 100
    }
    console.log(_width)
    let svg = _body
      .append('svg')
      .attr('width', _width)
      .attr('height', _height)
    /**  title */
    if (params.title && params.title.text) {
      let _title = params.title.text
      let _titleX = params.title.x ? params.title.x : _width / 2
      let _titleY = params.title.y ? params.title.y + 15 : 15
      if (_titleX === 'center') {
        _titleX = _width / 2
      } else if (_titleX === 'left') {
        _titleX = 30
      } else if (_titleX === 'right') {
        _titleX = _width - 30
      }
      svg
        .append('text')
        .attr('x', _titleX)
        .attr('y', _titleY)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('text-decoration', 'underline')
        .attr('fill', params.title.style.color)
        .text(_title)
    }
    if (params.style) {
      svg.attr('style', params.style)
    }
    let g = svg.append('g').attr('transform', 'translate(' + _width / 2 + ',' + _height / 2 + ')')
    /*  颜色  */
    let _color = params.serious && params.serious.color ? params.serious.color : undefined
    let colorArr
    if (!_color) {
      if (params.data.length < 12) {
        colorArr = d3.schemePaired
      } else {
        let len = params.data.length
        let _arr = []
        while (len > 0) {
          _arr.push(d3.interpolatePlasma(Math.random()))
          len--
        }
        colorArr = _arr
      }
    } else {
      colorArr = _color
    }
    let color = d3.scaleOrdinal(colorArr)
    let data = params.data
    let pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.population
      })
    let path = d3
      .arc()
      .outerRadius(_outer)
      .innerRadius(_inner)

    let label = d3
      .arc()
      .outerRadius(_outer)
      .innerRadius(_outer + _inner)

    let arc = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', function(d) {
        return color(d.data.age)
      })

    arc
      .append('text')
      .attr('transform', function(d) {
        /**  标签贴圈 */
        // let c = label.centroid(d)
        // let x = c[0]
        // let y = c[1]
        // let h = Math.sqrt(x * x + y * y)
        // let labelr = Math.min(_width, _height) / 2 - 30
        // return 'translate(' + (x / h) * labelr + ',' + (y / h) * labelr + ')'
        /**  标签规整 */
        let pos = label.centroid(d)
        pos[0] = (_outer + _inner) * (midAngle(d) < Math.PI ? 1 : -1)
        return 'translate(' + pos + ')'
      })
      .attr('dy', '0.35em')
      .text(function(d) {
        return d.data.age
      })
      .attr('fill', function(d) {
        return color(d.data.age)
      })
    /* line */
    arc
      .append('polyline')
      .attr('points', function(d) {
        let pos = label.centroid(d)
        pos[0] = (_outer + _inner) * (midAngle(d) < Math.PI ? 0.9 : -0.8)
        if (params.serious && params.serious.lineStyle && params.serious.lineStyle.points) {
          let _sty = params.serious.lineStyle.points
          console.log(_sty)
          if (_sty === 'two') {
            return [path.centroid(d), pos]
          } else if (_sty === 'three') {
            console.log([
              path.centroid(d),
              label.centroid(d),
              pos,
              pos,
              label.centroid(d),
              path.centroid(d)
            ])
            return [
              path.centroid(d),
              label.centroid(d),
              pos,
              pos,
              label.centroid(d),
              path.centroid(d)
            ]
          }
        } else {
          return [path.centroid(d), pos]
        }
      })
      .attr('stroke-width', 1)
      .attr('stroke', function(d) {
        return color(d.data.age)
      })
    // let polyline = svg
    //   .select('.line')
    //   .selectAll('polyline')
    //   .data(pie(data))
    //   .enter()
    //   .append('polyline')
    //   .attr('points', function(d) {
    //     // see label transform function for explanations of these three lines.
    //     var pos = label.centroid(d)
    //     pos[0] = (_outer + _inner) * 0.9 * (midAngle(d) < Math.PI ? 1 : -1)
    //     console.log(pos)
    //     return [label.centroid(d), pos, [10, 10]]
    //   })
    //   .attr('fill', function(d) {
    //     return color(d.data.age)
    //   })
  }
}
