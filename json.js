    $(document).ready(function(){
////////////////////////Loader/////////////////////////////////////////////////
    
     $(window).on('load', function () {
     var $preloader = $('#preloader'),
        $spinner   = $preloader.find('.spinner');
        $spinner.fadeOut();
        $preloader.delay(1000).fadeOut('slow');
});
////////////////////////Loader/////////////////////////////////////////////////
        
////////////////////////Скрытие блоков/////////////////////////////////////////
        $('.closeCompanyPartners').on('click',  function(){
        $('.partners').hide('slow');
    });
        
        $('.closeNewsBlock').on('click',  function(){
        $('.newsPanel').hide('slow');
    });
////////////////////////Скрытие блоков//////////////////////////////////////////
    
////////////////////////COMPANY/////////////////////////////////////////////////
    
    var sortname = "Shares";
    var countries = [];
	$.getJSON( "http://codeit.pro/frontTestTask/company/getList", function( json ) {
    var ul = document.createElement('ul');
    ul.setAttribute("class", "list-group lstfirm");
    var len = json.list.length;
        $('.circle').text(len);
        for(i=0;i<len;i++){
           var li = document.createElement('li');
           li.setAttribute("class", "list-group-item");
           li.innerHTML =json.list[i]['name']; 
           li.setAttribute("id",i);
           ul.appendChild(li);
           countries.push(json.list[i]['location']['name']);
        }
        $('.list').html(ul);
        
////////////////////////Diagram////////////////////////////////////////  
        
        var obj = uniaue(countries);
        google.charts.load('current', {'packages':['corechart']});  
        google.charts.setOnLoadCallback( function(){
        var piedate = [];
        var data = {
                   "cols":[
                       {"id":"", "label":"Countries", "type":"string"},
                       {"id":"", "label":"Company", "type":"number"}
                   ],
                   "rows":[]
               }
         for(var a in obj)
          {
              piedate.push({"c":[{"v":a},{"v":obj[a]}]});
           }
            data['rows'] = piedate;
               var data = new google.visualization.DataTable(data);
               var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
               chart.draw(data, {width: 400, height: 240});
    });
        
///////////////////////////////////////////////////////////////////////

});
function uniaue(arr){
        var obj = {   
        };
        for(i = 0; i<arr.length;i++){
            var str = arr[i];
            if(isNaN(obj[str]))
                {
                    obj[str] = 1;
                }
            else obj[str]+=1;
        }
       return obj;
    }
    
    ////////////////////////NEWS////////////////////////////////////////////////
    
    $.getJSON( "http://codeit.pro/frontTestTask/news/getList", function( json ) {
    var ulNews = document.createElement('ul');
    ulNews.setAttribute("class", "list-group lstnews");
    var len = json.list.length;
        for(i=0;i<len;i++){
          var liNews = document.createElement('li');
           liNews.setAttribute("class", "list-group-item");
           liNews.innerHTML =json.list[i]['author']; 
           liNews.setAttribute("id",i);
           ulNews.appendChild(liNews);
        }
            $('.newsPannel').html(ulNews);
        });
    
    $('.newsPannel').on('click', ".lstnews .list-group-item", function(){
        var id = $(this).attr("id");
        $(".lstnews .list-group-item").css("background-color", "white");
        $(this).css("background-color","beige");
        isClick = true;
         $.getJSON( "http://codeit.pro/frontTestTask/news/getList", function( json ) {
             var news = json.list[id];
             $('.img-responsive').attr("src", news['img']);
             $('.author').text(news['author']);
             $('.date').text(new Date(news['date']*1));
             $('.text').text(news['description']);
             $('.newsPanel').show();
         });
        
    });
    
    $('.newsPannel').on("mouseenter", ".lstnews .list-group-item", function(){
        $(this).css("background-color", "beige");    
    });
    
    $('.newsPannel').on("mouseleave", ".lstnews .list-group-item", function(){
        $(this).css("background-color", "white");
    });
    
    ////////////////////////////////////////////////////////////////////////////////////
     $('.list').on('click', ".lstfirm .list-group-item", function(){
        $('.list-group-item').css("background-color", "white");
        var id = $(this).attr("id");
        $(this).css("background-color","beige");
           $.getJSON( "http://codeit.pro/frontTestTask/company/getList", function( json ) {
           var partners = json.list[id]['partners'];
               var shares = 0;
               for(i = 0; i<partners.length; i++)
                   {
                       shares+=partners[i]['value'];
                   }
               $('.partners-body').empty();
               var div = document.createElement("div");
               div.setAttribute("class", "row");
               var ul = document.createElement('ul');
               ul.setAttribute("class", "list-group partners-list");
               for(i = 0;i<partners.length;i++)
                   {
                       var procentdiv = document.createElement("div");
                       procentdiv.setAttribute("class", "partners-circle");
                       procentdiv.innerHTML = Math.floor((partners[i]['value']/shares)*100) + "%";
                       /////////////////////подсчет процентов/////////////////////////////
                       var newline = document.createElement("div");
                       newline.setAttribute("class", "partners-line");
                       var partname = document.createElement("div");
                       partname.setAttribute("class", "partners-rectangle");
                       var div = document.createElement("div");
                       div.setAttribute("class", "partners-name");
                       div.innerHTML = partners[i]['name'];
                       partname.appendChild(div); 
                       ////////////////////вывод данных в списке////////////////////////
                       var li = document.createElement("li");
                       li.setAttribute("class", "list-group-item partners-element");
                       li.appendChild(procentdiv);
                       li.appendChild(newline);
                       li.appendChild(partname);
                       ul.appendChild(li);
                   }
               var $obj = ChooseSort($(ul).children('li'), sortname);
               $obj.appendTo($(ul));
               $('.partners').show('slow');
               $(ul).appendTo('.partners-body');
        });
 });
////////////////////////Sort/////////////////////////////////////////   
    $('.sort-shares').on('click',function(){
        sortname = "Shares";
        var $ulcompany = $('.partners-list');
        var $licompany = $('.partners-list li');
         var sort = $('.sort-shares').attr("id");
        $('.sort-shares').attr("id", sort*(-1));
        var $obj = ChooseSort($licompany, sortname);
        $obj.appendTo($ulcompany);
    });
    
     $('.sort-name').on('click',function(){
        sortname="Name";
        var sort = $('.sort-name').attr("id");
        var $ulcompany = $('.partners-list');
        var $licompany = $('.partners-list li');
        $('.sort-name').attr("id", sort*(-1));
        var $obj = ChooseSort($licompany, sortname);
        $obj.appendTo($ulcompany);
    });
    
    function ChooseSort(company, sortby)
    {
        switch(sortby)
            {
                case "Shares":{
                   return company.sort(CompanyShares);
                    
                }
                case "Name":{
                    console.log($('.sort-name').attr("id"));
                    return company.sort(CompanyName);
                }
            }
     }

    function CompanyName(companyA, companyB)
    {
         var firstdiv=$(companyA).children('.partners-rectangle').children('.partners-name').text(),
             seconddiv=$(companyB).children('.partners-rectangle').children('.partners-name').text();
         var sort = $('.sort-name').attr("id");
         return (firstdiv.toUpperCase().localeCompare(seconddiv.toUpperCase()))*parseInt(sort);
    }
    
    function CompanyShares(companyA, companyB)
    {
        var firstdiv=$(companyA).children('.partners-circle').text().substring(0,$(companyA).children('.partners-circle').text().length-1),
            seconddiv=$(companyB).children('.partners-circle').text().substring(0,$(companyB).children('.partners-circle').text().length-1);
        var sort = $('.sort-shares').attr("id");
        return (parseInt(firstdiv)-parseInt(seconddiv))*parseInt(sort);

    }        
});
/////////////////////Sort//////////////////////////////
