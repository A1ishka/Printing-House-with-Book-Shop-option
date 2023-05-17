window.addEventListener('DOMContentLoaded', function() {
    var slider = document.getElementById('price-slider');
    var minPrice = document.getElementById('min-price');
    var maxPrice = document.getElementById('max-price');
    
    var minValue = 0;
    var maxValue = 100;
    
    var minHandle = document.createElement('div');
    minHandle.className = 'slider-handle';
    
    var maxHandle = document.createElement('div');
    maxHandle.className = 'slider-handle';
    
    slider.appendChild(minHandle);
    slider.appendChild(maxHandle);
    
    var sliderWidth = slider.offsetWidth;
    var handleWidth = minHandle.offsetWidth;
    
    var range = maxValue - minValue;
    
    minHandle.style.left = '0px';
    maxHandle.style.left = (sliderWidth - handleWidth) + 'px';
    
    function updatePrices() {
      var minPos = parseFloat(minHandle.style.left) / (sliderWidth - handleWidth);
      var maxPos = parseFloat(maxHandle.style.left) / (sliderWidth - handleWidth);
      
      var minPriceValue = minValue + (range * minPos);
      var maxPriceValue = minValue + (range * maxPos);
      
      minPrice.value = minPriceValue.toFixed(2);
      maxPrice.value = maxPriceValue.toFixed(2);
    }
    
    function handleMouseDown(event) {
      var handle = event.target;
      var startX = event.clientX;
      var handleLeft = handle.offsetLeft;
      
      function handleMouseMove(event) {
        var diffX = event.clientX - startX;
        var newLeft = handleLeft + diffX;
        
        if (newLeft < 0) {
          newLeft = 0;
        } else if (newLeft > (sliderWidth - handleWidth)) {
          newLeft = sliderWidth - handleWidth;
        }
        
        handle.style.left = newLeft + 'px';
        updatePrices();
      }
      
      function handleMouseUp(event) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    minHandle.addEventListener('mousedown', handleMouseDown);
    maxHandle.addEventListener('mousedown', handleMouseDown);
    
    updatePrices();
  });
  