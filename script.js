function renderPartOne() {
  var div = document.createElement('div');
  div.className = "section";
  div.id = "part-one";

  var divs = window.organizationalProperties.map(function(item) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<div class='properties'><span>" + item.text + "</span> <input type='checkbox'/></div>";
    return newDiv;
  })

  divs.forEach(function(el) { div.appendChild(el) })
  document.body.appendChild(div);
}

function renderPartTwo() {
  var div = document.createElement('div');
  div.className = "section";
  div.id = "part-two";

  var divs = window.criticalBarriers.map(function(item) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<div class='critical'><span>" + item.text + "</span> <input type='checkbox'/></div>";
    return newDiv;
  })

  divs.forEach(function(el) { div.appendChild(el) })
  document.body.appendChild(div);
}

function renderPartThree() {
  var div = document.createElement('div');
  div.className = "section";
  div.id = "part-three";

  var divs = window.noncriticalBarriers.map(function(item) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<div class='noncritical'><span>" + item.text + "</span> <input type='checkbox'/></div>";
    return newDiv;
  })

  divs.forEach(function(el) { div.appendChild(el) })
  document.body.appendChild(div);
}

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
    percentageObj[window.types[i]] = {
      percentage: percentage
    };
  }

  return percentageObj;
}

function toArray(domList) {
  return Array.prototype.slice.call(domList);
}

function calculatePartTwo() {
  function calculatePartTwoResults() {
    var relevantBools = [];

    var items = toArray(document.querySelectorAll(".critical input"))
    var isChecked = items.map(function(i) { return i.checked })

    for (var i = 0; i < window.criticalBarriers.length; i++) {
      var checked = isChecked[i];
      if (!checked) continue

      var item = window.criticalBarriers[i];
      relevantBools.push(item);
    }

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        result.push(acc[i] || !!current.values[i])
      }
      return result
    }, [false, false, false, false, false, false, false, false]);
  }

  var results = calculatePartTwoResults()
  var obj = {};
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    obj[window.types[i]] = {
      hasCriticalBarriers: result
    }
  }
  return obj;
}

function calculatePartThree() {
  function calculatePartThreeResults() {
    var relevantBools = [];

    var items = toArray(document.querySelectorAll(".noncritical input"))
    var isChecked = items.map(function(i) { return i.checked })

    for (var i = 0; i < window.noncriticalBarriers.length; i++) {
      var checked = isChecked[i];
      if (!checked) continue

      var item = window.noncriticalBarriers[i];
      relevantBools.push(item);
    }

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        result.push(acc[i] || !!current.values[i])
      }
      return result
    }, [false, false, false, false, false, false, false, false]);
  }

  var results = calculatePartThreeResults()
  var obj = {};
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    obj[window.types[i]] = {
      hasNonCriticalBarriers: result
    }
  }
  return obj;
}

function renderButton() {
  var button = document.createElement("button");
  button.innerText = "Calculate";
  button.addEventListener('click', calculateAllResults)
  document.body.appendChild(button);
}

function calculateAllResults() {
  var one = calculatePartOne()
  var two = calculatePartTwo()
  var three = calculatePartThree()

  var results = [];

  var keys = _.keys(one)
  _.forEach(keys, function(k) {
    var obj = _.extend({type: k}, one[k], two[k], three[k])
    results.push(obj)
  })

  results = _.sortBy(results, 'percentage').reverse()
  console.log(results)
  renderResults(results)
}

function renderResults(results) {
  var div = document.createElement('div');
  div.className = "section";
  div.id = "part-one";

  var divs = results.map(function(item) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<div class='result'><strong>" + item.type + "</strong>: " + item.percentage + "% match.";
    if (item.hasCriticalBarriers) {
      newDiv.innerHTML += "Has critical barriers. "
    }
    if (item.hasNonCriticalBarriers) {
      newDiv.innerHTML += "Has non-critical barriers. "
    }
    return newDiv;
  })

  divs.forEach(function(el) { div.appendChild(el) })
  document.body.appendChild(div);
}

renderPartOne()
renderPartTwo()
renderPartThree()
renderButton()