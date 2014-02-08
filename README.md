# Morph

A lightweight CSS transition library

##Example
    <div class="morphable"></div>
    <script src="morph.js"></script>
    <script>
  	  Morph('.morphable')
  		  .duration(300)
  		  .to({ x: x, y: x })
  		  .to('opacity', '0.5')
  		  .start();
    </script>
