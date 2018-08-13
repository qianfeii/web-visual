import * as d3 from 'd3'
const pieCase = Symbol('pieCase')
const verifyData = Symbol('verifyData')
const getType = Symbol('getType')
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
    _this[verifyData](params)
    let _body = d3.select(_this._dom)
    let _width = params.width ? params.width : parseInt(_this._dom.style.width)
    let _height = params.height ? params.height : parseInt(_this._dom.style.height)
    if (_width.toString().includes('%')) {
      _width = (parseInt(this._dom.style.width) * parseInt(_width)) / 100
    }
    let _radius = Math.min(_width, _height) / 2
    /*  大小 含判断 圆或圆环 */
    let ringSize = params.serious && params.serious.ringSize ? params.serious.ringSize : 50
    let _outer = params.serious && params.serious.outer ? params.serious.outer : _radius / 1.5
    let _inner =
      params.serious && params.serious.inner ? params.serious.inner : _radius / 1.5 - ringSize
    if (params.serious && params.serious.type) {
      let _ty = params.serious.type
      if (_ty === 'round') {
        _inner = 0
      } else if (_ty === 'ring') {
      } else {
        _inner = 0
      }
    } else {
      _inner = 0
    }
    if (_outer < _inner) {
      throw new Error(`外圈大小小于内圈`)
    }
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
        return d.value
      })
      .padAngle(function(d) {
        return 0.01
      })
    let path = d3
      .arc()
      .outerRadius(_outer)
      .innerRadius(_inner)

    let label = d3
      .arc()
      .outerRadius(_outer)
      .innerRadius(_outer + _inner)
    /** 位置 */
    let _pieX = _width / 2 - 30
    let _pieY = _height / 2
    if (params.x) {
      _pieX = _pieX + params.x
    }
    if (params.y) {
      _pieY = _pieY + params.y
    }
    let g = svg.append('g').attr('transform', 'translate(' + _pieX + ',' + _pieY + ')')
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
        return color(d.data.type)
      })
    /** lable */
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
        pos[0] = (_outer + 100) * (midAngle(d) < Math.PI ? 0.8 : -1.18)
        pos[1] = pos[1] - 10
        if (
          params.serious &&
          params.serious.type === 'round' &&
          params.serious.lineStyle &&
          params.serious.lineStyle.points === 'three'
        ) {
          pos[1] = pos[1] - 40
        }
        return 'translate(' + pos + ')'
      })
      .attr('dy', '0.35em')
      .text(function(d) {
        let _format
        if (params.label && params.label.format) {
          _format = params.label.format
          let _regex = /\{(.+?)\}/g
          let a = d.data.type
          let b = d.value
          let p =
            (Number(d.value) /
              d3.sum(params.data, function(d) {
                return Number(d.value)
              })) *
            100
          p = parseFloat(p).toFixed(2)
          let _arr = _format.match(_regex)
          _arr.forEach(e => {
            let _rep = ''
            if (e === '{a}') {
              _rep = a
            } else if (e === '{b}') {
              _rep = b
            } else if (e === '{p}') {
              _rep = p
            }
            _format = _format.replace(e, _rep)
          })
          return `${_format}`
        }
        return d.data.type
      })
      .attr('fill', function(d) {
        return color(d.data.type)
      })
    /* label line */
    arc
      .append('polyline')
      .attr('points', function(d) {
        let pos = label.centroid(d)
        pos[0] = (_outer + 100) * (midAngle(d) < Math.PI ? 0.9 : -1)
        if (params.serious && params.serious.lineStyle && params.serious.lineStyle.points) {
          let _sty = params.serious.lineStyle.points
          if (_sty === 'two') {
            let _r
            if (params.serious.type === 'ring') {
              _r = [path.centroid(d), pos]
            } else if (params.serious.type === 'round') {
              _r = [label.centroid(d), pos]
            } else {
              _r = [path.centroid(d), pos]
            }
            return _r
          } else if (_sty === 'three') {
            let _r = [
              path.centroid(d),
              label.centroid(d),
              pos,
              pos,
              label.centroid(d),
              path.centroid(d)
            ]
            if (params.serious.type === 'round') {
              let pos2 = label.centroid(d)
              pos2[0] = _outer * (midAngle(d) < Math.PI ? 0.9 : -1)
              pos2[1] = pos2[1] - 40
              pos[1] = pos[1] - 40
              _r = [label.centroid(d), pos2, pos, pos, pos2, label.centroid(d)]
            }
            return _r
          } else {
            let _r
            if (params.serious.type === 'ring') {
              _r = [path.centroid(d), pos]
            } else if (params.serious.type === 'round') {
              _r = [label.centroid(d), pos]
            } else {
              _r = [path.centroid(d), pos]
            }
            return _r
          }
        } else {
          let _r
          if (params.serious.type === 'ring') {
            _r = [path.centroid(d), pos]
          } else if (params.serious.type === 'round') {
            _r = [label.centroid(d), pos]
          } else {
            _r = [path.centroid(d), pos]
          }
          return _r
        }
      })
      .attr('stroke-width', 1)
      .attr('stroke', function(d) {
        return color(d.data.type)
      })
    /** draw  legend */
    let _legPos = []
    _legPos[0] = _width - 120
    if (params.legend && params.legend.position) {
      let _pos = params.legend.position
      if (_pos === 'top') {
        _legPos[1] = 20
      } else if (_pos === 'center') {
        _legPos[1] = _height / 2
      } else if (_pos === 'bottom') {
        _legPos[1] = _height - 30 * params.data.length
      }
    } else {
      _legPos[1] = _height - 30 * params.data.length
    }
    let legend = svg.append('g').attr('transform', 'translate(' + _legPos + ')')
    let legendArc = legend
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('style', 'cursor: pointer;')
      .on(
        'click',
        function(d) {
          console.log('click on legend==>>>', d, pie(data))
        },
        false
      )

    legendArc
      .append('text')
      .attr('transform', function(d) {
        let _pos = []
        _pos[0] = 30
        _pos[1] = 30 * d.index
        return 'translate(' + _pos + ')'
      })
      .attr('dy', '0.35em')
      .text(function(d) {
        return d.data.type
      })
      .attr('fill', function(d) {
        return color(d.data.type)
      })
      .attr('font-size', '12px')
    /** symbol */
    let symbolAd = d3
      .symbol()
      .size(100)
      .type(d3.symbolSquare)
    legendArc
      .append('path')
      .attr('transform', function(d) {
        let _pos = []
        _pos[0] = 20
        _pos[1] = 30 * d.index
        return 'translate(' + _pos + ')'
      })
      .attr('d', function(d) {
        return symbolAd()
      })
      .attr('fill', function(d) {
        return color(d.data.type)
      })
  }
  [verifyData](params) {
    let _this = this
    let _outerW = parseFloat(_this._dom.style.width)
    let _outerH = parseInt(_this._dom.style.height)
    let _keys = Object.keys(params)
    for (let i = 0; i < _keys.length; i++) {
      let key = _keys[i]
      let val = params[key]
      let type = _this[getType](val)
      switch (key) {
        case 'width':
          if (type === undefined) {
            console.log('非法')
            params[key] = _outerW
          } else if (type === 'string' && !val.includes('%')) {
            let reg = /^[0-9]+$/
            if (reg.test(val)) {
              console.log('纯数字字符串')
              params[key] = parseFloat(val)
            } else {
              console.log('不含% 非数字字符串')
              params[key] = _outerW
            }
          } else if (type === 'string' && val.includes('%')) {
            let _arr = val.split('%')
            console.log(_arr)
            if (_arr.length > 2) {
              console.log('% 不合法')
              params[key] = _outerW
            } else {
              let reg = /^[0-9]+$/
              if (reg.test(_arr[0])) {
                console.log('%  纯数字字符串')
                if (parseInt(_arr[0]) <= 100) {
                  params[key] = (_outerW * parseInt(_arr[0])) / 100
                } else {
                  params[key] = _outerW
                }
              } else {
                console.log('% 非数字字符串')
                params[key] = _outerW
              }
            }
          } else if (type === 'object') {
            console.log('对象')
            params[key] = _outerW
          }
          break
        case 'height':
          if (type === undefined) {
            params[key] = _outerH
          } else if (type === 'string' && !val.includes('%')) {
            let reg = /^[0-9]+$/
            if (reg.test(val)) {
              params[key] = parseFloat(val)
            } else {
              params[key] = _outerH
            }
          } else if (type === 'string' && val.includes('%')) {
            let _arr = val.split('%')
            if (_arr.length > 2) {
              params[key] = _outerH
            } else {
              let reg = /^[0-9]+$/
              if (reg.test(_arr[0])) {
                if (parseInt(_arr[0]) <= 100) {
                  params[key] = (_outerH * parseInt(_arr[0])) / 100
                } else {
                  params[key] = _outerH
                }
              } else {
                params[key] = _outerH
              }
            }
          } else if (type === 'object') {
            console.log('对象')
            params[key] = _outerH
          }
          break
        case 'x':
          if (type === undefined) {
            params[key] = 0
          } else if (type === 'string') {
            let reg = /^[0-9]+$/
            if (reg.test(val)) {
              console.log('纯数字字符串')
              params[key] = parseFloat(val)
            } else {
              console.log('不含% 非数字字符串')
              params[key] = 0
            }
          } else if (type === 'object') {
            params[key] = 0
          }
          break
        case 'y':
          if (type === undefined) {
            params[key] = 0
          } else if (type === 'string') {
            let reg = /^[0-9]+$/
            if (reg.test(val)) {
              console.log('纯数字字符串')
              params[key] = parseFloat(val)
            } else {
              console.log('不含% 非数字字符串')
              params[key] = 0
            }
          } else if (type === 'object') {
            params[key] = 0
          }
          break
        case 'legend':
          if (type !== 'object') {
            console.log('legend 不是object')
            params[key] = {}
          }
          break
        case 'title':
          if (type !== 'object') {
            params[key] = {}
          }
          break
        default:
          break
      }
    }
  }
  [getType](val) {
    if (typeof val === 'number' && !Number.isFinite(val)) {
      console.log('值为Infinity')
      return undefined // throw new Error('值为Infinity')
    } else if (Number.isNaN(val)) {
      return undefined // throw new Error('值为NaN')
    } else if (val === null) {
      return undefined // throw new Error('值为null')
    } else if (val === '') {
      return undefined // throw new Error('值为空')
    } else {
      return typeof val
    }
  }
}
