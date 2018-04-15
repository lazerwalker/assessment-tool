function renderPartOne() {
  var divs = window.organizationalProperties.map(function(item) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<div class='properties'><span>" + item.text + "</span> <input type='checkbox'/></div>";
    return newDiv;
  })

  divs.forEach(function(el) { document.body.appendChild(el) })
}

// Returns a sorted array
function calculatePartOne() {
  function calculatePartOneSums() {
    var relevantBools = [];

    var items = toArray(document.querySelectorAll(".properties input"))
    var isChecked = items.map(function(i) { return i.checked })

    for (var i = 0; i < window.organizationalProperties.length; i++) {
      var checked = isChecked[i];
      if (!checked) continue

      var item = window.organizationalProperties[i];
      relevantBools.push(item);
    }

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        console.log(current)
        if (current.values[i]) {
          result.push(acc[i] + 1)
        } else {
          result.push(acc[i])
        }
      }
      return result
    }, [0, 0, 0, 0, 0, 0, 0, 0]);
  }

  var sums = calculatePartOneSums()
  var percentageObj = {};
  for (var i = 0; i < sums.length; i++) {
    var sum = sums[i];
    var denominator = window.organizationalPropertyDenominators[i];
    var percentage = Math.floor(100 * sum / denominator)
    percentageObj[window.types[i]] = percentage;
  }

  return percentageObj;
}

function toArray(domList) {
  return Array.prototype.slice.call(domList);
}

renderPartOne()