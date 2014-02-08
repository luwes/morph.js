# Morph

A lightweight CSS transition library

##Example
    <div class="morphable"></div>
    <script src="morph.js"></script>
    <script>
  	  Morph('.morphable')
  		  .duration(300)
  		  .to({ x: 100, y: 10 })
  		  .to('opacity', '0.5')
  		  .start();
    </script>
