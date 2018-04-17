$(document).on('click', '#part-one button', function(e) {
  $("#part-one").fadeOut(400, function() {
    renderPartTwo()
    $("#part-two").fadeIn(400)
  })
})

$(document).on('click', '#part-two button', function(e) {
  $("#part-two").fadeOut(400, function() {
    renderPartThree()
    $("#part-three").fadeIn(400)
  })
})

$(document).on('click', '#part-three button', function(e) {
  $("#part-three").fadeOut(400, function() {
    calculateAllResults()
    $("#results").fadeIn(400)
  })
})

$("#part-one").show()

function renderPartOne() {
  window.organizationalProperties
    .map(function(item) {
      var id = item.text.replace(/[^\x00-\x7F]/g, "").split(" ").join("-");

      return $("<div class='properties'><label for='" + id + "'>" + item.text + "</label> <input type='checkbox' id='" + id + "'/></div>")
    })
    .forEach(function($el) { $el.appendTo($("#part-one .content")) })
}

function renderPartTwo() {
  window.criticalBarriers.map(function(item) {
    var id = item.text.replace(/[^\x00-\x7F]/g, "").split(" ").join("-");

    return $("<div class='critical'><label for='" + id + "'>" + item.text + "</span> <input type='checkbox' id='" + id + "'/></div>")
  }).forEach(function($el) { $el.appendTo($("#part-two .content"))})
}

function renderPartThree() {
  window.noncriticalBarriers.map(function(item) {
    var id = item.text.replace(/[^\x00-\x7F]/g, "").split(" ").join("-");
    return $("<div class='noncritical'><label for='" + id + "'>" + item.text + "</label> <input type='checkbox' id='" + id + "'/></div>");
  }).forEach(function($el) { $el.appendTo($("#part-three .content") )})
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

  var withCriticalBarriers = _.filter(results, function(r) { return r.hasCriticalBarriers })
  var withoutCriticalBarriers = _.filter(results, function(r) { return !r.hasCriticalBarriers })

  var sortedWith =  _.sortBy(withCriticalBarriers, 'percentage').reverse()
  var sortedWithout =  _.sortBy(withoutCriticalBarriers, 'percentage').reverse()

  results = sortedWithout.concat(sortedWith)
  console.log(results)
  renderResults(results)
}

function renderResults(results) {
  results.map(function(item) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = "<div class='result'><strong>" + item.type + "</strong>: " + item.percentage + "% match.";
    if (item.hasCriticalBarriers) {
      newDiv.innerHTML += "Has critical barriers. "
    }
    if (item.hasNonCriticalBarriers) {
      newDiv.innerHTML += "Has non-critical barriers. "
    }
    return $(newDiv);
  }).forEach(function(el) { el.appendTo($("#results")) })
}

renderPartOne()