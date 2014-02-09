# Morph

A lightweight CSS animation library

##About

The idea was to have a library with a simple api which uses CSS transitions if the browser supports it and fall back to a regular javascript tweening engine.

The `x` and `y` are alias properties which are internally converted to the correct CSS properties depending on which engine is used.

##Example
```html
<div class="morphable"></div>
<script src="morph.js"></script>
<script>
	Morph('.morphable')
		.duration(300)
		.to({ x: 100, y: 10 })
		.to('opacity', '0.5')
		.start();
</script>
```

##API
| Method | Description | 
| ------ | ----------- | 
| duration(n:Number):Morph | Sets the duration in ms |
| get(prop:String):String | Get computed CSS property value |
| set(obj, val=undefined):Morph | Sets one or more CSS property values |
| to(obj, val=undefined):Morph | Animate to one or more CSS property values |
| start():Morph | Start the animation |
| on(event:String, fn:Function):Morph | Add event listener |
| off(event:String, fn:Function):Morph | Remove event listener |

##Events
| Event | Description | 
| ------ | ----------- | 
| update | Gets fired while animating |
| end | Triggered when animation ends |
