var active;
var activeFacilitator;

var activeOptions = ["#home", "#part-one", "#part-two", "#part-three", "#results"]
var facilitatorOptions = ["#employee", "#leadership", "#organization"]

function fadeTo(el) {
  window.location.hash = el
  $(active).fadeOut(400, function() {
    $(el).fadeIn(400)
    active = el
    $(document.body).scrollTop()
  })
}

function fadeToFacilitatorsSubsection(el) {
  $(activeFacilitator).fadeOut(400, function() {
    $(document.body).scrollTop()
    $(el).fadeIn(400)
    activeFacilitator = el
    window.location.hash = el
  })
};

function allPartOneResults() {
  return ["#employee", "#leadership", "#organizational"]
    .map(function(el) { return $(el).serializeArray() })
    .reduce(function(el, acc) { return acc.concat(el) }, []);
}

function partOnePercentage() {
  var filled = allPartOneResults().length
  var total = $("#part-one .properties").length

  return filled / total
}

function partTwoPercentage() {
  return $("#part-two .content").serializeArray().length / ($("#part-two .content").children('.critical').length)
}

function partThreePercentage() {
  return $("#part-three .content").serializeArray().length / ($("#part-three .content").children('.noncritical').length)
}

function partOneSubsectionIsComplete() {
  return ($(activeFacilitator).serializeArray().length === $(activeFacilitator).children('.properties').length)
}

function partTwoIsComplete() {
  return partTwoPercentage() === 1
}

function partThreeIsComplete() {
  return partThreePercentage() === 1
}

window.addEventListener('hashchange', function(e) {
  console.log(window.location.hash)
  if (activeOptions.indexOf(window.location.hash) !== -1) {
    if (window.location.hash !== active) {
      fadeTo(window.location.hash)
    }
    if (window.location.hash == "#part-one") {
      fadeToFacilitatorsSubsection("#employee")
    }
  } else if (facilitatorOptions.indexOf(window.location.hash) != -1) {
    if (window.location.hash != activeFacilitator) {
      fadeToFacilitatorsSubsection(window.location.hash)
    }
  }
})

$(document).on('click', '#part-one button', function(e) {
  if (!partOneSubsectionIsComplete()) {
    return;
  }

  var index = facilitatorOptions.indexOf(activeFacilitator)
  var next = index + 1
  if (next >= facilitatorOptions.length) {
    fadeTo("#part-two")
  } else {
    fadeToFacilitatorsSubsection(facilitatorOptions[next])
  }
})

$(document).on('click', 'input', function(e) {
  // Update tops
  $("#part-one-percent").text(Math.floor(partOnePercentage() * 100))
  $("#part-two-percent").text(Math.floor(partTwoPercentage() * 100))
  $("#part-three-percent").text(Math.floor(partThreePercentage() * 100))

  function grayOut(el) {
    $(el)
    .removeClass('btn-primary')
    .addClass('btn-secondary')
  }

  function enable(el) {
    $(el)
      .removeClass('btn-secondary')
      .addClass('btn-primary')
  }

  if (partOneSubsectionIsComplete()) {
    enable("#part-one button")
  } else {
    grayOut("#part-one button")
  }

  if (partTwoIsComplete()) {
    enable("#part-two button")
  } else {
    grayOut("#part-two button")
  }

  if (partThreeIsComplete()) {
    enable("#part-three button")
  } else {
    grayOut("#part-one button")
  }

  // Update results
  calculateAllResults()

  var typeToDOMType = function(type) {
    return type.replace("-", "").toLowerCase();
  }

  _.forEach(window.types, function(type) {
    var domType = typeToDOMType(type)

    var negativePercent = results[type.negativePercentage]
    if (results[type].hasCriticalBarriers) {
      negativePercent = 100
    }

    $("#" + domType + "-percent-pos").text(results[type].positivePercentage)
    $("#" + domType + "-percent-neg").text(negativePercent)
  })
})

$(document).on('click', '#header div', function(e) {
  var target = $(e.target).attr('data-link')
  fadeTo("#" + target)
})

$(document).on('click', '#part-two button', function(e) {
  if (partTwoIsComplete()) {
    fadeTo("#part-three")
  }
})

$(document).on('click', '#part-three button', function(e) {
  if (partThreeIsComplete()) {
    calculateAllResults()
    fadeTo("#results")
  }
})

$("#part-one").show()
active = "#part-one"

function renderPartOne() {
  var mapProperty = function(item) {
    var id = item.text.replace(/[^\x00-\x7F]/g, "").split(" ").join("-");

    return $("<div class='row properties'><label class='col-9'>" + item.text + "</label><div class='col-1'><input type='radio' name='" + id + "' value='yes'/></div><div class='col-1'><input type='radio' name='" + id + "' value='no'/></div><div class='col-1'><input type='radio' name='" + id + "' value='na'/></div></div>")
  };

  var employee = window.organizationalProperties
    .filter(function(i) { return i.category === "employee"})
    .map(mapProperty)
    .forEach(function($el) { $el.appendTo($("#employee")) })

  var leadership = window.organizationalProperties
    .filter(function(i) { return i.category === "leadership"})
    .map(mapProperty)
    .forEach(function($el) { $el.appendTo($("#leadership")) })

  var organization = window.organizationalProperties
    .filter(function(i) { return i.category === "organizational"})
    .map(mapProperty)
    .forEach(function($el) { $el.appendTo($("#organizational")) })

  activeFacilitator = "#employee"
}

function renderPartTwo() {
  window.criticalBarriers.map(function(item) {
    var id = item.text.replace(/[^\x00-\x7F]/g, "").split(" ").join("-");

    return $("<div class='row critical'><label class='col-9'>" + item.text + "</label><div class='col-1'><input type='radio' name='" + id + "' value='yes'/></div><div class='col-1'><input type='radio' name='" + id + "' value='no'/></div><div class='col-1'><input type='radio' name='" + id + "' value='na'/></div></div>")
  }).forEach(function($el) { $el.appendTo($("#part-two .content"))})
}

function renderPartThree() {
  window.noncriticalBarriers.map(function(item) {
    var id = item.text.replace(/[^\x00-\x7F]/g, "").split(" ").join("-");
    return $("<div class='row noncritical'><label class='col-9'>" + item.text + "</label><div class='col-1'><input type='radio' name='" + id + "' value='yes'/></div><div class='col-1'><input type='radio' name='" + id + "' value='no'/></div><div class='col-1'><input type='radio' name='" + id + "' value='na'/></div></div>");
  }).forEach(function($el) { $el.appendTo($("#part-three .content") )})
}

function calculatePartOne() {
  function calculatePartOneYesses() {
    var relevantBools = [];

    allPartOneResults()
      .filter(function(r) { return r.value === "yes"; })
      .forEach(function(line) {
        let item = window.organizationalProperties.find(function(p) { return p.id === line.name })
        relevantBools.push(item.values)
      })

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        if (current[i]) {
          result.push(acc[i] + 1)
        } else {
          result.push(acc[i])
        }
      }
      return result
    }, [0, 0, 0, 0, 0, 0, 0, 0]);
  }

  function calculatePartOneNos() {
    var relevantBools = [];

    allPartOneResults()
      .filter(function(r) { return r.value === "no"; })
      .forEach(function(line) {
        let item = window.organizationalProperties.find(function(p) { return p.id === line.name })
        relevantBools.push(item.values)
      })

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        if (current[i]) {
          result.push(acc[i] + 1)
        } else {
          result.push(acc[i])
        }
      }
      return result
    }, [0, 0, 0, 0, 0, 0, 0, 0]);
  }

  var yesses = calculatePartOneYesses()
  var nos = calculatePartOneNos()
  var percentageObj = {};
  for (var i = 0; i < yesses.length; i++) {
    var yes = yesses[i];
    var denominator = yes + (nos[i])
    if (denominator < 1) denominator = 1

    var percentage = Math.floor(100 * yes / denominator)
    percentageObj[window.types[i]] = {
      positivePercentage: percentage
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

    $("#part-two .content").serializeArray()
      .filter(function(r) { return r.value === "yes"; })
      .forEach(function(line) {
        let item = window.criticalBarriers.find(function(p) { return p.id === line.name })
        console.log(item)
        relevantBools.push(item.values)
      })

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        result.push(acc[i] || !!current[i])
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
  function calculatePartThreeYesses() {
    var relevantBools = [];

    $("#part-three .content").serializeArray()
      .filter(function(r) { return r.value === "yes"; })
      .forEach(function(line) {
        let item = window.noncriticalBarriers.find(function(p) { return p.id === line.name })
        relevantBools.push(item.values)
      })

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        if (current[i]) {
          result.push(acc[i] + 1)
        } else {
          result.push(acc[i])
        }
      }
      return result
    }, [0, 0, 0, 0, 0, 0, 0, 0]);
  }

  function calculatePartThreeNos() {
    var relevantBools = [];

    $("#part-three .content").serializeArray()
      .filter(function(r) { return r.value === "no"; })
      .forEach(function(line) {
        let item = window.noncriticalBarriers.find(function(p) { return p.id === line.name })
        relevantBools.push(item.values)
      })

    return relevantBools.reduce(function(acc, current) {
      var result = []
      for (var i = 0; i < 8; i++) {
        if (current[i]) {
          result.push(acc[i] + 1)
        } else {
          result.push(acc[i])
        }
      }
      return result
    }, [0, 0, 0, 0, 0, 0, 0, 0]);
  }

  var yesses = calculatePartThreeYesses()
  var nos = calculatePartThreeNos()
  var percentageObj = {};
  for (var i = 0; i < yesses.length; i++) {
    var yes = yesses[i];
    var denominator = yes + (nos[i])
    if (denominator < 1) denominator = 1

    var percentage = Math.floor(100 * yes / denominator)
    percentageObj[window.types[i]] = {
      negativePercentage: percentage
    };
  }

  return percentageObj;
}

function calculateAllResults() {
  var one = calculatePartOne()
  var two = calculatePartTwo()
  var three = calculatePartThree()

  var resultsArray = [];
  var results = {};

  // TODO: This is very silly.

  var keys = _.keys(one)
  _.forEach(keys, function(k) {
    var obj = _.extend({type: k}, one[k], two[k], three[k])
    resultsArray.push(obj)
  })

  _.forEach(resultsArray, function(obj) {
    console.log(obj)
    results[obj.type] = obj;
  })
  window.results = results
}

function renderResults(results) {
  results.map(function(item) {
    var text = "<div class='result'><strong>" + item.type + "</strong>: " + item.positivePercentage + "% match. ";
    if (item.hasCriticalBarriers) {
      text += "Has critical barriers. "
    }
    if (item.hasNonCriticalBarriers) {
      text += "Has non-critical barriers. "
    }
    text += "</div>"
    return $(text);
  }).forEach(function(el) { el.appendTo($("#results")) })
}

renderPartOne()
renderPartTwo()
renderPartThree()