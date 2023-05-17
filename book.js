function search() {
    event.preventDefault();
    var searchQuery = document.getElementById('searchInput').value;
    var filterChecked = document.getElementById('filterCheckbox').checked;
    var minPrice = document.getElementById('minPriceInput').value;
    var maxPrice = document.getElementById('maxPriceInput').value;
  
    fetch(`/search?q=${searchQuery}&filter=${filterChecked}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при выполнении поискового запроса');
        }
        return response.text(); 
    })
      .then(html => {
          document.getElementById('searchResults').innerHTML = html;
    })
      .catch(error => {
        console.error('Ошибка при выполнении поискового запроса:', error);
      });
  }
  
  function displayResults(results) {
    var searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
  
    if (results.length === 0) {
      searchResults.innerHTML = '<li>Нет результатов</li>';
      return;
    }
  }