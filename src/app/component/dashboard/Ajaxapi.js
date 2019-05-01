var avgarr=[];
exports.getRecommendation1=getRecommendation1;
exports.getRecommendation2=getRecommendation2;
exports.getRecommendation3=getRecommendation3;
exports.getRecommendation4=getRecommendation4;
exports.getRecommendation5=getRecommendation5;

var container;
var sequence=[];
var dateString="";
var close=[], high=[], low=[], key=[], growth=[];
var records=[];

function company2(curr, arr) 
{
    company=arr[curr];
    R1= new XMLHttpRequest();  //XMLHttpRequest object  to exchange data with a web server
    var url1="https://www.quandl.com/api/v3/datasets/NSE/"+company+".json?api_key=ohudC4aZ_QkhbmV22Prx";


    //var url1="https://www.quandl.com/api/v3/datasets/NSE/DVL.json?api_key=ohudC4aZ_QkhbmV22Prx";
    R1.open("GET", url1, true);
    R1.onreadystatechange = function () {  //whenever the ready state changes
        
        
        if (R1.readyState == 4 && R1.status == 200) {    //when fetching operation is complete
            
            var ourData1= JSON.parse(this.responseText);
            console.log("@@@@@"+ourData1);
            var AvgClose=Table(arr.length, curr, ourData1);

            console.log("Pg no."+curr);
            ++curr; 
            
            if (curr < arr.length) 
                company2(curr,arr);
        }
    
    }

    R1.send(); //Now send the request

}

function Ajaxapi(current, arr, niftyContainer) {
    
    R = new XMLHttpRequest(); //Create the object

    var company= arr[current];

    var url="https://www.quandl.com/api/v3/datasets/NSE/"+company+".json?api_key=ohudC4aZ_QkhbmV22Prx&transform=diff&start_date="+dateString;//transform gets the difference between prices of two days
    
    R.open("GET", url, true);
    if(current==0)
    {
        container= niftyContainer;
    }    

    R.onreadystatechange = function () {
        //Create the onreadystate function
        
        if (R.readyState == 4 && R.status == 200) {
            //This part runs when the request is finished successfully
            var ourData= JSON.parse(this.responseText);
            var AvgClose=sendhtml(arr.length, current, ourData);
             avgarr.push(AvgClose);

            ++current; //Go to the next URL
            
            if (current < arr.length) //If there is a next company
                Ajaxapi(current,arr, container); //Then request it
            else
                company2(0, arr);
                return avgarr;
        }
    
    }
    var recomend1=[];
   recomend1.push(getRecommendation1());
    R.send(); //Now send the request   
}



function sendhtml(len, current,  nifty){
    if(current==0)
    {
        container.innerHTML="<br><br><h4><center>Fetching data...Please hold on for a while!</center></h4>";
        sequence=[];
    }
    //var htmlString="";
       var close=0;
       var days= nifty.dataset.data.length;

       for(i=0; i<days; i++)
       {
           for(j=0; j<nifty.dataset.data[i].length; j++)
           {
               if(j==5)
               {
                   close+= Number(nifty.dataset.data[i][j]);
               }
           }
       }

       
       var AvgClose=close/days;
       
       sequence.push([nifty.dataset.name,close])
       console.log("-------"+sequence[current]);
         
       if((len-1)==current)
       {
       
       sequence.sort(function(one, two) {
           one = one[1];
           two = two[1];
       
           return one < two ? -1 : (one > two ? 1 : 0);
       });
   
    }

     
    console.log("DATE: "+dateString);

    return AvgClose;
}

function Table(len, curr, ourData1)
{
    if(curr==0)
    {
        records=[];
        key=[];
    }
   
    var days= ourData1.dataset.column_names.length;
    console.log("Data length is :"+days)
    var datalength = ourData1.dataset.data.length;
    //json of API columns
    for(j=0; j<datalength; j++)
    {
        if(j==5)   //column is close
        {
            close.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
            
        }
        if(j==2)   //column is high
        {
            high.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
        if(j==3)   //column is low
        {
            low.push([ourData1.dataset.name, Number(ourData1.dataset.data[days][j])]);
        }
        
            
    }      

    if(curr==(len-1))
    {
        sequence.reverse(); //descending order of stocks as per growth
        console.log("!!!!!"+sequence);
        var i=0;
        while(i<5 && i<sequence.length)
        {
            key[i] = sequence[i][0];   //name of company
            console.log("$$$$$"+sequence[i][1]);
            growth[i] = Math.round(sequence[i][1] * 100) / 100;
            console.log("*****"+growth[i]);
            i++;           
        }  

        for(i in key)
        {
            var record=[key[i], growth[i], match(key[i],close), match(key[i],high),match(key[i],low)]
            records.push(record); 
            console.log("Records:"+records[i][0]);  
        }
    }
    
    var Table = document.createElement('Table'); // CREATE DYNAMIC TABLE.
        
   
        Table.setAttribute("cellpadding", "15");
        Table.setAttribute("margin", "10");
        Table.setAttribute("align","center")
        var thr= document.createElement('tr');
        
       var th=[];
        for(var j=0; j<5; j++)    //heading
        {
            th[j]=document.createElement('th');
           
        }
        th[0].appendChild(document.createTextNode('Company'));
        th[1].appendChild(document.createTextNode('Growth'));
        th[2].appendChild(document.createTextNode('Close'));
        th[3].appendChild(document.createTextNode('High'));
        th[4].appendChild(document.createTextNode('Low'));
       
        
        for(var j=0; j<5; j++)
        {
            thr.appendChild(th[j]);
        }
        Table.appendChild(thr);
        Table.border="solid 3px black";
      

        for (var i = 0; i < records.length; i++){
            var tr = document.createElement('tr');   
            var td=[];
            for(var j=0; j<7; j++)
            {
                td[j] = document.createElement('td');
                
                
            }
            td[0].appendChild(document.createTextNode(records[i][0])); //putting other elements in the table
            td[1].appendChild(document.createTextNode(records[i][1]));
            td[2].appendChild(document.createTextNode(records[i][2]));
            td[3].appendChild(document.createTextNode(records[i][3]));
            td[4].appendChild(document.createTextNode(records[i][4]));
                   
            for(var j=0; j<5; j++)
            {
                tr.appendChild(td[j]);
            }
            
            Table.appendChild(tr);
        }
        if(container!=null)
        {
            container.innerHTML="<br><br>";
            container.appendChild(Table);
        }

    else
      console.log("its null");


}

function getRecommendation1()   
{
    return records[0];
}

function getRecommendation2()
{
    return records[1];
}

function getRecommendation3()
{
    return records[2];
}

function getRecommendation4()
{
    return records[3];
}

function getRecommendation5()
{
    return records[4];
}
function match(value,arr)
{
    for(i=0; i<arr.length; i++)
    {
        if(arr[i][0]==value)
        {
            console.log("####"+arr[i][1]); //other values close high low 
            return arr[i][1];
        }
    }
}


exports.Ajaxapi= Ajaxapi;

