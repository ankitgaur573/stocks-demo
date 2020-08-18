// import { getPackedSettings } from "http2";

$(document).ready(function () {
    getStocksData();
    getLeadersData();
    $("#searchBt").click(function(){
        getStocksData();
      });

      $("#tableForList").on("click", "td", function() {
        if($( this ).hasClass( "symbol" )){
            getSingleStockData($( this ).text())
        }
      });
      $("#tableForGainers").on("click", "td", function() {
        if($( this ).hasClass( "symbol" )){
            getSingleStockData($( this ).text())
        }
      });
      $("#tableForLosers").on("click", "td", function() {
        if($( this ).hasClass( "symbol" )){
            getSingleStockData($( this ).text())
        }
      });
  });

  function getSingleStockData(symbol){

    $.ajax({url: `/stocks/${symbol}`, success: function(result){
        // console.log(result)
        paintChart(result);
      }});
  }

  function getStocksData(){
    let searchValue = $("#search").val();
    if(searchValue){
        $.ajax({url: `/stocks?limit=10&q=${searchValue}`, success: function(result){
            
            if(result.length == 0) alert("No Stocks Found")
            var new_tbody = document.createElement('tbody');
            // let oldTbody = $('#tableForList tbody');
            $('#tableForList tbody').replaceWith(new_tbody)

            for (var i = 0; i < result.length; i++) {    
                $('#tableForList tbody').append('<tr><td class=symbol style="cursor:pointer;color:blue"><a href="#" class="symbol">'+result[i].symbol+'</a></td><td>'+result[i].current+'</td><td>'+result[i].open+'</td><td>'+result[i].high+'</td><td>'+result[i].low+'</td><td>'+result[i].changeFromOpen+'</td><td>'+result[i].percentChangeFromOpen+'</td></tr>')
             }
          }});
    }else{
        alert("Enter some value")
    }
  }

  function getLeadersData(){

        $.ajax({url: `/stocks/leaders/data?limit=5`, success: function(result){            
            for (var i = 0; i < result.gainers.length; i++) {    
                $('#tableForGainers tbody').append('<tr><td class=symbol style="cursor:pointer;color:blue"><a href="#" class="symbol">'+result.gainers[i].symbol+'</a></td><td>'+result.gainers[i].current+'</td><td>'+result.gainers[i].open+'</td><td>'+result.gainers[i].changeFromOpen+'</td><td>'+result.gainers[i].percentChangeFromOpen+'</td></tr>')
             }
             for (var i = 0; i < result.losers.length; i++) {    
                $('#tableForLosers tbody').append('<tr><td class=symbol style="cursor:pointer;color:blue"><a href="#" class="symbol">'+result.losers[i].symbol+'</a></td><td>'+result.losers[i].current+'</td><td>'+result.losers[i].open+'</td><td>'+result.losers[i].changeFromOpen+'</td><td>'+result.losers[i].percentChangeFromOpen+'</td></tr>')
             }
          }});
  }

  window.onload = function () {
    //   paintChart();    
}

function paintChart(stockData){  
    var data = [];
    var dataSeries = { type: "line" };
    var dataPoints = [];
    for (var i = 0; i < stockData.ticks.length; i += 1) {
        dataPoints.push({
            x: stockData.ticks[i].minute,
            y: stockData.ticks[i].price
        });
    }
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);
    
    var options = {
        zoomEnabled: true,
        animationEnabled: true,
        title: {
            text: stockData.symbol
        },
        data: data  // random data
    };
    
    $("#chartContainer").CanvasJSChart(options);
}
