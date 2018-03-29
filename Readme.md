[demo](http://leeeeeem.github.io/Drag/index.html)

### 借鉴于[draggabilly](https://github.com/desandro/draggabilly)


> 1、主要使用transform3d，所以看起来很流畅。

> 2、事件代理，将move和mouseup事件放在window上，保证每个实例的空间不受干扰

> 3、清理事件的时候使用闭包，保证引用的相同的，在Pointer类里面的handleProxy方法，然后在这个方法里面寻找onmousemove、onmouseup事件。
> 4、目前只支持mouse事件，touch和pointer事件之后实现。