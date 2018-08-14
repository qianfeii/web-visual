# web-visual

> web-visual,a package use d3 api

  `d3  v5.5.0`

- **now finish**
  - [x] pie chart
      can initialize a pie chart now.  

    **params when initialization**
  
    params is a object.
    1. get dom element. `dom has its width and height is best`
    2. initialize visual class
    3. initialization use code like this  

    ```javascrpit
       let params = {}
       let _pie = _this.$refs.pie
       let visual = new VISUAL(_pie)
       visual.baseFun()
       visual.init(params)
    ```  

    | param  | type          | option                        | description                                                |
    | ------ | ------------- | ----------------------------- | ---------------------------------------------------------- |
    | type   | string        | set chart type                | must set like 'pie' 'line'                                 |
    | width  | string/number | set chart width               | default with parent dom's width ,or set like  400 or '40%' |
    | height | string/number | set chart height              | default with parent dom's height ,or set like 400 or '40%' |
    | x      | number        | set chart horizontal position | default 0                                                  |
    | y      | number        | set chart vertical position   | default 0                                                  |
    | legend | object        | set chart legend              | no default                                                 |
